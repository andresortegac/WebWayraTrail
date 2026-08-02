#!/usr/bin/env node

/**
 * Diagnostic script for WebWayraTrail
 * Checks database connectivity, tables, and application setup
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const mysql = require('mysql2/promise');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  title: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`ℹ️  ${msg}`),
};

async function runDiagnostics() {
  log.title('🔍 WebWayraTrail - Diagnóstico de Sistema');

  // 1. Verificar .env
  log.info('1. Verificando archivo .env...');
  if (!fs.existsSync('.env')) {
    log.error('.env no existe');
    if (fs.existsSync('.env.example')) {
      log.info('Creando .env desde .env.example...');
      fs.copyFileSync('.env.example', '.env');
      log.success('.env creado');
    }
  } else {
    log.success('.env existe');
  }

  // 2. Verificar directorios críticos
  log.info('2. Verificando directorios...');
  const dirs = {
    'dist (Frontend build)': './dist',
    'node_modules (Dependencies)': './node_modules',
    'server (Backend)': './server',
    'src (Source)': './src',
  };

  for (const [name, dir] of Object.entries(dirs)) {
    if (fs.existsSync(dir)) {
      log.success(`${name} existe`);
    } else {
      log.error(`${name} NO existe`);
    }
  }

  // 3. Verificar archivo principal
  log.info('3. Verificando archivos críticos...');
  const files = {
    'dist/index.html': './dist/index.html',
    'server.js': './server.js',
    'server/server.js': './server/server.js',
  };

  for (const [name, file] of Object.entries(files)) {
    if (fs.existsSync(file)) {
      log.success(`${name} existe`);
    } else {
      log.error(`${name} NO existe`);
    }
  }

  // 4. Verificar variables de entorno
  log.info('4. Verificando variables de entorno...');
  const envVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'JWT_SECRET'];

  for (const envVar of envVars) {
    if (process.env[envVar]) {
      const value = envVar === 'DB_PASSWORD' || envVar === 'JWT_SECRET' ? '***' : process.env[envVar];
      log.success(`${envVar} = ${value}`);
    } else {
      log.error(`${envVar} no está configurado`);
    }
  }

  // 5. Verificar conectividad a BD
  log.info('5. Verificando conectividad a Base de Datos...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    log.success('Conexión a BD exitosa');

    // Verificar tabla site_content
    const [tables] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'site_content'"
    );

    if (tables[0].count > 0) {
      log.success('Tabla site_content existe');

      // Verificar registros
      const [rows] = await connection.query('SELECT COUNT(*) as count FROM site_content');
      log.info(`Total de registros en site_content: ${rows[0].count}`);
    } else {
      log.error('Tabla site_content NO existe');
      log.warning('Ejecuta: npm run migrate');
    }

    // Verificar tabla users
    const [userTables] = await connection.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
    );

    if (userTables[0].count > 0) {
      log.success('Tabla users existe');

      const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
      log.info(`Total de usuarios: ${userRows[0].count}`);
    } else {
      log.error('Tabla users NO existe');
      log.warning('Ejecuta: npm run migrate');
    }

    await connection.end();
  } catch (error) {
    log.error(`No se pudo conectar a BD: ${error.message}`);
    log.info('Verifica que DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE estén correctos en .env');
  }

  // 6. Resumen
  log.title('📋 Resumen');
  log.info('Si todos los checks pasaron, el servidor debería estar listo.');
  log.info('Si hay errores, sigue las instrucciones arriba.');
  log.info('');
  log.info('Para iniciar el servidor: npm start');
  log.info('Para compilar frontend: npm run build');
  log.info('Para inicializar BD: npm run migrate');
}

runDiagnostics().catch((error) => {
  log.error(`Error en diagnóstico: ${error.message}`);
  process.exit(1);
});
