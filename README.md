# WebWayraTrail

Aplicacion web con frontend en Vite/React y backend Express conectado a MySQL.

## Requisitos

- Node.js `20.19.0` LTS
- npm `10+`
- MySQL accesible desde las variables de entorno

## Nota Importante Sobre Hosting

Este proyecto no usa `sqlite3`. La base de datos del backend usa `mysql2` en `server/db.js`.

Si el servidor reporta un error de modulo nativo `sqlite3`, normalmente significa que:

- se subio un `node_modules` viejo generado en otra maquina
- el hosting esta reutilizando dependencias de un despliegue anterior
- el entorno del servidor esta intentando arrancar con una version de Node distinta a la requerida

Ademas, este proyecto depende de herramientas que requieren Node `20`, por lo que `18` no es una opcion segura para instalar dependencias o compilar.

## Instalacion Local

```bash
npm install
npm run build
```

## Despliegue Recomendado

1. Configurar el servidor con Node.js `20 LTS`.
2. Eliminar `node_modules` y cualquier cache de dependencias del hosting.
3. Volver a instalar dependencias directamente en el servidor con `npm install`.
4. Compilar en el servidor con `npm run build` si el flujo de despliegue lo requiere.
5. Iniciar la app con `node server/server.js` o con el comando configurado por el hosting.

## Variables De Entorno

Configura al menos estas variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME` o `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE` o `DB_NAME`
- `PORT`

Variables opcionales para el administrador inicial:

- `AUTH_ADMIN_NAME`
- `AUTH_ADMIN_USERNAME`
- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`
- `AUTH_ADMIN_ROLE`
