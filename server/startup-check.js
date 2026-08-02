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

const logFile = path.join(__dirname, '../startup-check.log');

function log(msg) {
  const timestamp = new Date().toISOString();
  const fullMsg = `[${timestamp}] ${msg}`;
  console.log(fullMsg);
  try {
    fs.appendFileSync(logFile, fullMsg + '\n');
  } catch (e) {
    // Silent fail if can't write log
  }
}

log('═══════════════════════════════════════');
log('🚀 STARTUP CHECK STARTED');
log(`   Working directory: ${path.join(__dirname, '..')}`);
log(`   Looking for: ${indexPath}`);
log('═══════════════════════════════════════');

const distExists = fs.existsSync(distPath);
const indexExists = fs.existsSync(indexPath);

log(`Directory exists (dist/): ${distExists}`);
log(`File exists (dist/index.html): ${indexExists}`);

if (distExists && !indexExists) {
  log(`Contents of dist/: ${fs.readdirSync(distPath).join(', ')}`);
}

if (!indexExists) {
  log('⚠️  dist/index.html NOT found. Attempting to build frontend...');
  
  try {
    const packageJsonPath = path.join(__dirname, '../package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found - cannot run npm build');
    }
    log(`package.json found: ${packageJsonPath}`);
    
    log('Running: npm run build');
    const startTime = Date.now();
    
    execSync('npm run build', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    
    const duration = Date.now() - startTime;
    log(`✅ Frontend build completed successfully in ${duration}ms`);
    
    // Verify the build actually created the file
    if (fs.existsSync(indexPath)) {
      const stats = fs.statSync(indexPath);
      log(`✅ Verified: dist/index.html exists (${stats.size} bytes)`);
    } else {
      log('❌ WARNING: Build completed but dist/index.html still not found!');
    }
  } catch (error) {
    log(`❌ Build FAILED: ${error.message}`);
    log('⚠️  Application will serve "Not Found" errors - frontend not available');
    log('Continuing startup anyway to allow API routes to function...');
  }
} else {
  const stats = fs.statSync(indexPath);
  log(`✅ Frontend build found (${stats.size} bytes, modified: ${stats.mtime})`);
}

log('═══════════════════════════════════════');
log('✅ STARTUP CHECK COMPLETED');
log('═══════════════════════════════════════\n');
