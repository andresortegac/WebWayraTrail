const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ⚠️  CRITICAL: Run startup checks FIRST
require('./startup-check');

// Load/create .env file FIRST, before requiring anything else
require('./config-loader');

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

// 🔍 DEBUG ENDPOINTS - MUST BE BEFORE DB MIDDLEWARE
app.get('/api/debug/status', (req, res) => {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  const status = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    workDir: process.cwd(),
    distPath: distPath,
    distExists: fs.existsSync(distPath),
    indexPath: indexPath,
    indexExists: fs.existsSync(indexPath),
  };

  if (status.distExists) {
    try {
      status.distContents = fs.readdirSync(distPath);
    } catch (e) {
      status.distContentsError = e.message;
    }
  }

  if (status.indexExists) {
    try {
      const stat = fs.statSync(indexPath);
      status.indexSize = stat.size;
      status.indexModified = stat.mtime;
      const content = fs.readFileSync(indexPath, 'utf8');
      status.indexPreview = content.substring(0, 150);
      status.isValidHtml = content.includes('<html') || content.includes('<HTML');
    } catch (e) {
      status.indexError = e.message;
    }
  }

  res.json(status);
});

app.get('/api/debug/startup-log', (req, res) => {
  const logPath = path.join(__dirname, '../startup-check.log');
  
  if (!fs.existsSync(logPath)) {
    return res.json({
      message: 'No startup log found',
      logPath: logPath,
      exists: false,
    });
  }

  try {
    const content = fs.readFileSync(logPath, 'utf8');
    res.type('text/plain').send(content);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read startup log',
      message: error.message,
    });
  }
});

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

const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Serve the frontend build in every environment.
const distPath = path.join(__dirname, '../dist');

// Verify dist directory exists
if (!fs.existsSync(distPath)) {
  console.error(`❌ CRITICAL: dist directory not found at ${distPath}`);
  console.error('This usually means the frontend build is missing.');
  console.error('Run: npm run build');
} else {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const stats = fs.statSync(indexPath);
    console.log(`✅ Frontend build found. dist/index.html size: ${stats.size} bytes`);
  } else {
    console.error(`❌ CRITICAL: dist/index.html not found at ${indexPath}`);
  }
}

app.use(express.static(distPath));

// Catch-all route for SPA: serve index.html for any unmatched routes
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  console.log(`[SPA Catch-all] ${req.method} ${req.path}`);
  console.log(`[SPA Catch-all] Checking for ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    console.log(`[SPA Catch-all] ✅ Serving index.html`);
    res.sendFile(indexPath);
  } else {
    console.error(`[SPA Catch-all] ❌ index.html not found!`);
    res.status(404).json({
      message: 'Application not fully deployed. Run: npm run build',
      path: indexPath,
      distPath: distPath,
      distExists: fs.existsSync(distPath),
      files: fs.existsSync(distPath) ? fs.readdirSync(distPath) : []
    });
  }
});

// Start the HTTP server even if the database is temporarily unavailable.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  ensureDatabaseConnection();
});

module.exports = app;
