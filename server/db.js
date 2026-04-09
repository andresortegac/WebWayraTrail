const mysql = require('mysql2/promise');
require('dotenv').config();

function readEnv(name, fallback) {
  const value = process.env[name];
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? fallback : trimmedValue;
}

function decodeUrlPart(value) {
  if (typeof value !== 'string' || value === '') {
    return '';
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeDatabaseHost(host) {
  if (host === 'localhost' || host === '::1') {
    return '127.0.0.1';
  }

  return host;
}

function readDatabaseUrlConfig() {
  const rawUrl = readEnv('DATABASE_URL', readEnv('MYSQL_URL', ''));
  if (!rawUrl) {
    return null;
  }

  try {
    const connectionUrl = new URL(rawUrl);
    const databaseNameFromUrl = decodeUrlPart(connectionUrl.pathname.replace(/^\/+/, ''));

    return {
      databaseName: databaseNameFromUrl || readEnv('DB_DATABASE', readEnv('DB_NAME', 'wayra_trail')),
      config: {
        host: normalizeDatabaseHost(connectionUrl.hostname || readEnv('DB_HOST', 'localhost')),
        port: Number(connectionUrl.port || readEnv('DB_PORT', '3306')),
        user: decodeUrlPart(connectionUrl.username) || readEnv('DB_USERNAME', readEnv('DB_USER', 'root')),
        password: decodeUrlPart(connectionUrl.password) || process.env.DB_PASSWORD || '',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      },
    };
  } catch (error) {
    console.warn(`Invalid DATABASE_URL or MYSQL_URL. Falling back to DB_* variables. ${error.message}`);
    return null;
  }
}

const databaseUrlConfig = readDatabaseUrlConfig();
const databaseName = databaseUrlConfig?.databaseName || readEnv('DB_DATABASE', readEnv('DB_NAME', 'wayra_trail'));

const dbConfig = databaseUrlConfig?.config || {
  host: normalizeDatabaseHost(readEnv('DB_HOST', 'localhost')),
  port: Number(readEnv('DB_PORT', '3306')),
  user: readEnv('DB_USERNAME', readEnv('DB_USER', 'root')),
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;
const dbModule = { pool: null, initDatabase };

function getDatabaseDebugInfo() {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    database: databaseName,
    user: dbConfig.user,
    source: databaseUrlConfig ? 'DATABASE_URL/MYSQL_URL' : 'DB_*',
  };
}

// Initialize database tables
async function initDatabase() {
  let connection;
  let nextPool;
  let initialized = false;

  try {
    // Try to create the database when the MySQL user allows it.
    // Managed hosts often provision the database ahead of time and block CREATE DATABASE.
    const tempConnection = await mysql.createConnection(dbConfig);
    try {
      await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    } catch (error) {
      const canIgnoreCreateDatabaseError = [
        'ER_DBACCESS_DENIED_ERROR',
        'ER_DB_CREATE_EXISTS',
        'ER_SPECIFIC_ACCESS_DENIED_ERROR',
      ].includes(error.code);

      if (!canIgnoreCreateDatabaseError) {
        throw error;
      }

      console.warn(`Skipping database creation for ${databaseName}: ${error.message}`);
    }
    await tempConnection.end();

    // Now create pool with database
    nextPool = mysql.createPool({
      ...dbConfig,
      database: databaseName
    });

    connection = await nextPool.getConnection();
    
    // Create inscriptions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        cedula VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        edad INT NOT NULL,
        genero ENUM('M', 'F') NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        color_categoria VARCHAR(20) NOT NULL,
        talla_camiseta VARCHAR(10) NOT NULL,
        contacto_emergencia VARCHAR(100) NOT NULL,
        telefono_emergencia VARCHAR(20) NOT NULL,
        fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_categoria (categoria),
        INDEX idx_genero (genero)
      )
    `);

    // Create users table for admin
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        username VARCHAR(80) NOT NULL UNIQUE,
        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        content_key VARCHAR(100) PRIMARY KEY,
        content_json LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user using whichever schema the existing table supports.
    const bcrypt = require('bcryptjs');
    const [userColumns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);

    const availableColumns = new Set(userColumns.map((column) => column.COLUMN_NAME));
    const adminName = readEnv('AUTH_ADMIN_NAME', 'Administrador WAYRA TRAIL');
    const adminUsername = readEnv('AUTH_ADMIN_USERNAME', 'admin');
    const adminEmail = readEnv('AUTH_ADMIN_EMAIL', 'admin@wayratrail.com');
    const adminPassword = readEnv('AUTH_ADMIN_PASSWORD', 'admin123');
    const adminRole = readEnv('AUTH_ADMIN_ROLE', 'admin');
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [adminUsername]
    );

    if (availableColumns.has('password_hash')) {
      if (existingAdmin.length > 0) {
        await connection.execute(
          'UPDATE users SET name = ?, email = ?, password_hash = ?, role = ? WHERE username = ?',
          [adminName, adminEmail, adminPasswordHash, adminRole, adminUsername]
        );
      } else {
        await connection.execute(
          'INSERT INTO users (name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
          [adminName, adminUsername, adminEmail, adminPasswordHash, adminRole]
        );
      }
    } else if (availableColumns.has('password')) {
      if (existingAdmin.length > 0) {
        await connection.execute(
          'UPDATE users SET password = ?, role = ? WHERE username = ?',
          [adminPasswordHash, adminRole, adminUsername]
        );
      } else {
        await connection.execute(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [adminUsername, adminPasswordHash, adminRole]
        );
      }
    }

    pool = nextPool;
    dbModule.pool = nextPool;
    initialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', {
      ...getDatabaseDebugInfo(),
      code: error.code || 'UNKNOWN',
      message: error.message,
    });
    throw error;
  } finally {
    connection?.release();

    if (!initialized) {
      if (nextPool) {
        await nextPool.end().catch(() => {});
      }

      pool = null;
      dbModule.pool = null;
    }
  }
}

module.exports = dbModule;
