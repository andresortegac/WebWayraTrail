#!/bin/bash

# SSH check script for Hostinger

HOST="5.183.10.192"
PORT="65002"
USER="u811973920"
PASS="Temp#Wayra2026!"

echo "Connecting to Hostinger..."

sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p $PORT $USER@$HOST << 'EOF'
cd public_html
echo "=== Current Directory ===" 
pwd
echo ""
echo "=== Check dist folder ==="
if [ -f "dist/index.html" ]; then
  echo "✅ dist/index.html EXISTS"
  ls -lh dist/index.html
else
  echo "❌ dist/index.html NOT FOUND"
  if [ -d "dist" ]; then
    echo "dist folder exists, contents:"
    ls -la dist/ | head -10
  else
    echo "❌ dist folder does not exist"
  fi
fi
echo ""
echo "=== Check server.js ==="
if [ -f "server/server.js" ]; then
  echo "✅ server/server.js EXISTS"
fi
echo ""
echo "=== Git Status ==="
git log --oneline -5
echo ""
echo "=== Git Remote ==="
git remote -v
echo ""
echo "=== Check node process ==="
ps aux | grep -E "node|wayra" | grep -v grep || echo "No Node process running"
EOF

echo ""
echo "✅ Diagnostic complete"
