#!/bin/bash

# Diagnóstico para verificar si la BD de Hostinger está lista

echo "🔍 Iniciando diagnóstico de la aplicación WebWayraTrail..."
echo ""

# 1. Verificar que el .env está configurado
echo "1️⃣ Verificando archivo .env..."
if [ -f ".env" ]; then
  echo "✅ .env existe"
  if grep -q "DB_HOST" .env; then
    echo "✅ DB_HOST configurado"
  else
    echo "❌ DB_HOST no encontrado en .env"
  fi
else
  echo "❌ .env no existe - creando desde defaults..."
  cp .env.example .env
fi
echo ""

# 2. Verificar Node.js
echo "2️⃣ Versión de Node.js:"
node -v
echo ""

# 3. Verificar si node_modules existe
echo "3️⃣ Verificando dependencias..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules existe"
else
  echo "❌ node_modules no existe - instalando..."
  npm install
fi
echo ""

# 4. Verificar si dist existe
echo "4️⃣ Verificando build del frontend..."
if [ -d "dist" ]; then
  echo "✅ dist existe"
  if [ -f "dist/index.html" ]; then
    echo "✅ dist/index.html encontrado"
  else
    echo "❌ dist/index.html NO encontrado - compilando..."
    npm run build
  fi
else
  echo "❌ dist no existe - compilando..."
  npm run build
fi
echo ""

# 5. Verificar conectividad a BD
echo "5️⃣ Verificando conectividad a Base de Datos..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();
const host = process.env.DB_HOST;
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

(async () => {
  try {
    const connection = await mysql.createConnection({ host, port, user, password, database });
    console.log('✅ Conexión a BD exitosa');
    
    // Verificar tabla site_content
    const [tables] = await connection.query(\"SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'site_content'\");
    if (tables[0].count > 0) {
      console.log('✅ Tabla site_content existe');
    } else {
      console.log('❌ Tabla site_content NO existe - créala ejecutando: npm run migrate');
    }
    
    await connection.end();
  } catch (error) {
    console.log('❌ Error conectando a BD:', error.message);
    console.log('Verifica: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE en .env');
  }
})();
" 2>/dev/null || echo "❌ No se pudo verificar la conexión"
echo ""

echo "✅ Diagnóstico completado"
echo ""
echo "📌 Próximos pasos:"
echo "1. Si todas las verificaciones pasaron, reinicia el servidor"
echo "2. Si hay errores de BD, ejecuta: npm run migrate"
echo "3. Si hay errores de dependencias, ejecuta: npm install"
