#!/bin/bash
set -e

: "${HOSTINGER_HOST:?Define HOSTINGER_HOST}"
: "${HOSTINGER_PORT:=65002}"
: "${HOSTINGER_USER:?Define HOSTINGER_USER}"

ssh -p "$HOSTINGER_PORT" "$HOSTINGER_USER@$HOSTINGER_HOST" << 'EOF'
cd public_html
pwd
test -f dist/index.html && echo "dist/index.html existe" || echo "dist/index.html no existe"
test -f server/server.js && echo "server/server.js existe" || echo "server/server.js no existe"
git log --oneline -5
git remote -v
ps aux | grep -E "node|wayra" | grep -v grep || echo "No hay proceso Node activo"
EOF
