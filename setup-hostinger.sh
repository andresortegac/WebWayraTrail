#!/bin/bash

# Script para configurar WebWayraTrail en Hostinger
# Ejecutar: bash setup-hostinger.sh

echo "🚀 Configurando WebWayraTrail en Hostinger..."
echo ""

# Crear archivo .env desde .env.example
echo "📋 Creando archivo .env..."
if [ -f ".env" ]; then
  echo "⚠️  Archivo .env ya existe. Haciendo backup..."
  cp .env .env.backup.$(date +%s)
fi

cat > .env << 'ENVEOF'
PORT=3000
DB_HOST=5.183.10.192
DB_PORT=3306
DB_DATABASE=u811973920_wayratrail_db
DB_USERNAME=u811973920_wayratrail
DB_PASSWORD=Wayra@2026_
JWT_SECRET=wayra_trail_jwt_secret_2024_production_key_random_secure
AUTH_ADMIN_NAME=Administrador WAYRA TRAIL
AUTH_ADMIN_USERNAME=admin
AUTH_ADMIN_EMAIL=admin@wayratrail.com
AUTH_ADMIN_PASSWORD=Wayra@2026_
AUTH_ADMIN_ROLE=admin
ENVEOF

echo "✅ Archivo .env creado correctamente"
echo ""

# Verificar versión de Node
echo "📦 Versión de Node.js:"
node -v
echo ""

# Limpiar node_modules
echo "🧹 Limpiando node_modules anteriores..."
rm -rf node_modules package-lock.json
echo "✅ Limpiado"
echo ""

# Instalar dependencias
echo "📥 Instalando dependencias..."
npm install
echo "✅ Dependencias instaladas"
echo ""

# Compilar frontend
echo "🏗️ Compilando frontend..."
npm run build
echo "✅ Frontend compilado"
echo ""

# Verificar archivos de build
echo "✅ Archivos de build generados:"
ls -lah dist/ | head -5
echo ""

echo "🎉 ¡Configuración completada!"
echo "El servidor puede iniciarse con: node server.js"
