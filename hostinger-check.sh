#!/bin/bash

# Script to diagnose Hostinger deployment issues

echo "=== Hostinger Deployment Diagnostic ==="
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
  cd public_html || exit 1
fi

echo "1. Checking Git Status"
if [ -d ".git" ]; then
  git log --oneline -3
  echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
else
  echo "Not a git repository"
fi

echo ""
echo "2. Checking dist/ folder"
if [ -d "dist" ]; then
  echo "✅ dist/ exists"
  if [ -f "dist/index.html" ]; then
    echo "✅ dist/index.html exists"
    ls -lh dist/index.html
  else
    echo "❌ dist/index.html NOT found"
  fi
else
  echo "❌ dist/ NOT found"
fi

echo ""
echo "3. Checking server.js"
if [ -f "server.js" ]; then
  echo "✅ server.js exists"
  ls -lh server.js
else
  echo "❌ server.js NOT found"
fi

echo ""
echo "4. Checking .env"
if [ -f ".env" ]; then
  echo "✅ .env exists"
  head -3 .env
else
  echo "❌ .env NOT found"
fi

echo ""
echo "5. Checking Node process"
ps aux | grep -E "node|wayra" | grep -v grep

echo ""
echo "6. Checking port 3000"
netstat -tuln 2>/dev/null | grep 3000 || echo "Port 3000 not listening"

echo ""
echo "7. Last few lines of server.js to verify catch-all route"
tail -20 server/server.js

echo ""
echo "=== End Diagnostic ==="
