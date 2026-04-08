const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const inscriptionRoutes = require('./routes/inscriptions');
const siteContentRoutes = require('./routes/site-content');

const app = express();

// ?? IMPORTANTE: usar puerto dinámico (Hostinger lo exige)
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/site-content', siteContentRoutes);

// ?? Servir frontend SIEMPRE (no solo en production)
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));

// ?? fallback para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`?? Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('? Unable to start server:', error);
    process.exit(1);
  });

module.exports = app;