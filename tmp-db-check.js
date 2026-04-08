const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const cfg = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || process.env.DB_NAME || 'wayra_trail'
    };

    const pool = await mysql.createPool(cfg);
    const [rows] = await pool.query('SELECT * FROM users');
    console.log('USERS', JSON.stringify(rows, null, 2));
    await pool.end();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
