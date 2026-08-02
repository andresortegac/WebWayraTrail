#!/usr/bin/env node

/**
 * Pre-startup script for Hostinger
 * Ensures dist/ exists before starting the server
 * Run this BEFORE server.js starts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

console.log('[STARTUP] Checking if frontend build exists...');

if (!fs.existsSync(indexPath)) {
  console.warn('[STARTUP] ⚠️  dist/index.html NOT found. Building frontend...');
  
  try {
    console.log('[STARTUP] Running: npm run build');
    execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    console.log('[STARTUP] ✅ Frontend build completed');
  } catch (error) {
    console.error('[STARTUP] ❌ Build failed:', error.message);
    console.error('[STARTUP] The application may not work correctly without the frontend build');
  }
} else {
  const stats = fs.statSync(indexPath);
  console.log(`[STARTUP] ✅ Frontend build found (${stats.size} bytes)`);
}

console.log('[STARTUP] Startup check completed. Starting application...');
