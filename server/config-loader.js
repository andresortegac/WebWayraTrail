/**
 * Configuration loader
 * Ensures .env file exists with correct Hostinger variables
 * This runs BEFORE the app starts
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envPath = path.join(__dirname, '../.env');

// Get environment variables, with defaults for Hostinger
const getEnvVar = (name, fallback = '') => {
  return process.env[name] || fallback;
};

// Check if .env exists and is properly configured
function ensureEnvFile() {
  const requiredVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];

  // If .env exists, check if it has valid config
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const hasAllVars = requiredVars.every(v => content.includes(v));
    
    if (hasAllVars && content.includes('5.183.10.192')) {
      return; // .env is properly configured
    }
  }

  // Create/update .env with Hostinger variables
  const dbHost = getEnvVar('DB_HOST', '5.183.10.192');
  const dbPort = getEnvVar('DB_PORT', '3306');
  const dbUsername = getEnvVar('DB_USERNAME', 'u811973920_wayratrail');
  const dbPassword = getEnvVar('DB_PASSWORD', 'Wayra@2026_');
  const dbDatabase = getEnvVar('DB_DATABASE', 'u811973920_wayratrail_db');
  const jwtSecret = getEnvVar('JWT_SECRET', 'wayra_trail_jwt_secret_2024_production_key_random_secure');

  const envContent = `PORT=3000
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USERNAME=${dbUsername}
DB_PASSWORD=${dbPassword}
DB_DATABASE=${dbDatabase}
JWT_SECRET=${jwtSecret}
AUTH_ADMIN_NAME=Administrador WAYRA TRAIL
AUTH_ADMIN_USERNAME=admin
AUTH_ADMIN_EMAIL=admin@wayratrail.com
AUTH_ADMIN_PASSWORD=Wayra@2026_
AUTH_ADMIN_ROLE=admin
`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ .env file created/updated successfully');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
}

// Run the check
ensureEnvFile();

module.exports = { ensureEnvFile };
