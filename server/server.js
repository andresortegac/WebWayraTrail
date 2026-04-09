const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth');
const inscriptionRoutes = require('./routes/inscriptions');
const siteContentRoutes = require('./routes/site-content');

const app = express();
const DB_RETRY_MS = Number(process.env.DB_RETRY_MS || 30000);
let dbInitInFlight = false;

// Use a dynamic port because Hostinger assigns it at runtime.
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

function isDatabaseReady() {
  return Boolean(db.pool);
}

async function ensureDatabaseConnection() {
  if (dbInitInFlight || isDatabaseReady()) {
    return;
  }

  dbInitInFlight = true;

  try {
    await db.initDatabase();
  } catch (error) {
    console.error(`Database unavailable. Retrying in ${DB_RETRY_MS / 1000}s.`);
  } finally {
    dbInitInFlight = false;
  }
}

setInterval(() => {
  if (!isDatabaseReady()) {
    ensureDatabaseConnection();
  }
}, DB_RETRY_MS);

// Routes API
app.use('/api', (req, res, next) => {
  if (isDatabaseReady()) {
    return next();
  }

  return res.status(503).json({
    message: 'La base de datos no está disponible en este momento. Intenta nuevamente en unos minutos.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/site-content', siteContentRoutes);

// Serve the frontend build in every environment.
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));

// Express 5 requires named wildcards; this route also matches "/".
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start the HTTP server even if the database is temporarily unavailable.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  ensureDatabaseConnection();
});

module.exports = app;
