const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || process.env.DB_NAME || 'wayra_trail',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
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
    const adminName = process.env.AUTH_ADMIN_NAME || 'Administrador WAYRA TRAIL';
    const adminUsername = process.env.AUTH_ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.AUTH_ADMIN_EMAIL || 'admin@wayratrail.com';
    const adminPassword = process.env.AUTH_ADMIN_PASSWORD || 'admin123';
    const adminRole = process.env.AUTH_ADMIN_ROLE || 'admin';
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

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

module.exports = { pool, initDatabase };
