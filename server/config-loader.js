/** Load local environment variables without ever generating secrets. */
require('dotenv').config();

function ensureEnvFile() {
  const requiredVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];

  const missingVars = requiredVars.filter((name) => !process.env[name]);
  if (missingVars.length > 0) {
    console.warn(`Missing database environment variables: ${missingVars.join(', ')}`);
  }
}

ensureEnvFile();

module.exports = { ensureEnvFile };
