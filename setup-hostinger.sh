#!/bin/bash
set -e

echo "Configurando WebWayraTrail en Hostinger..."

if [ ! -f ".env" ]; then
  echo "Falta .env. Copia .env.example a .env y completa credenciales nuevas."
  exit 1
fi

node -v
npm ci
npm run build
echo "Configuracion completada. Inicia el servidor con: node server.js"
