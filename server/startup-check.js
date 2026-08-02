#!/usr/bin/env node

/**
 * Pre-startup script for Hostinger
 * Ensures dist/ exists and is valid before starting the server
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

const MIN_VALID_INDEX_SIZE = 800; // Minimum size for a valid Vite-compiled index.html

const distExists = fs.existsSync(distPath);
const indexExists = fs.existsSync(indexPath);

log(`Directory exists (dist/): ${distExists}`);
log(`File exists (dist/index.html): ${indexExists}`);

let isValidHtml = false;
let htmlSize = 0;

if (indexExists) {
  try {
    const stat = fs.statSync(indexPath);
    htmlSize = stat.size;
    log(`File size: ${htmlSize} bytes`);
    
    const content = fs.readFileSync(indexPath, 'utf8');
    isValidHtml = content.includes('<html') && content.includes('<body') && (content.includes('<script') || content.includes('type="module"'));
    
    log(`Is valid HTML (has html + body + script): ${isValidHtml}`);
    log(`File size check (>= ${MIN_VALID_INDEX_SIZE}): ${htmlSize >= MIN_VALID_INDEX_SIZE}`);
  } catch (e) {
    log(`❌ Error reading index.html: ${e.message}`);
  }
}

if (distExists && !indexExists) {
  log(`Contents of dist/: ${fs.readdirSync(distPath).join(', ')}`);
}

// Rebuild if:
// 1. index.html doesn't exist, OR
// 2. index.html is too small (corrupted), OR
// 3. index.html doesn't have valid HTML structure
if (!indexExists || htmlSize < MIN_VALID_INDEX_SIZE || !isValidHtml) {
  if (!indexExists) {
    log('⚠️  dist/index.html NOT found. Need to build.');
  } else if (htmlSize < MIN_VALID_INDEX_SIZE) {
    log(`⚠️  dist/index.html is too small (${htmlSize} bytes, expected >= ${MIN_VALID_INDEX_SIZE}). File may be corrupted. Rebuilding...`);
  } else if (!isValidHtml) {
    log('⚠️  dist/index.html does not have valid HTML structure. Rebuilding...');
  }
  
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
    
    // Verify the build actually created a valid file
    if (fs.existsSync(indexPath)) {
      const stat = fs.statSync(indexPath);
      const newSize = stat.size;
      log(`✅ Verified: dist/index.html exists (${newSize} bytes)`);
      
      if (newSize < MIN_VALID_INDEX_SIZE) {
        log(`❌ WARNING: Build completed but index.html is still too small (${newSize} bytes)!`);
      }
    } else {
      log('❌ WARNING: Build completed but dist/index.html still not found!');
    }
  } catch (error) {
    log(`❌ Build FAILED: ${error.message}`);
    log('⚠️  Application will serve "Not Found" errors - frontend not available');
    log('Continuing startup anyway to allow API routes to function...');
  }
} else {
  log(`✅ Frontend build valid (${htmlSize} bytes, HTML structure OK)`);
}

log('═══════════════════════════════════════');
log('✅ STARTUP CHECK COMPLETED');
log('═══════════════════════════════════════\n');
