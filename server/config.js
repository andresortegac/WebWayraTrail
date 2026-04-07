import path from "node:path"
import { fileURLToPath } from "node:url"

import dotenv from "dotenv"

const serverDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(serverDir, "..")

dotenv.config({ path: path.join(projectRoot, ".env") })

function parsePort(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseOrigins() {
  const defaults = [
    process.env.APP_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]

  const source = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : defaults

  return source
    .map((origin) => origin?.trim())
    .filter(Boolean)
}

function parseSecret(value) {
  if (!value) {
    return Buffer.from("wayratrail-local-secret", "utf8")
  }

  if (value.startsWith("base64:")) {
    return Buffer.from(value.slice(7), "base64")
  }

  return Buffer.from(value, "utf8")
}

export const config = {
  env: process.env.APP_ENV ?? "local",
  port: parsePort(process.env.API_PORT ?? process.env.PORT, 4000),
  corsOrigins: parseOrigins(),
  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: parsePort(process.env.DB_PORT, 3306),
    database: process.env.DB_DATABASE?.trim() || "wayratrail_db",
    user: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
  },
  auth: {
    sessionMinutes: parsePort(process.env.SESSION_LIFETIME, 120),
    secret: parseSecret(
      process.env.AUTH_TOKEN_SECRET ??
        process.env.JWT_SECRET ??
        process.env.APP_KEY
    ),
  },
  adminSeed: {
    name:
      process.env.AUTH_ADMIN_NAME?.trim() || "Administrador WAYRA TRAIL",
    username:
      process.env.AUTH_ADMIN_USERNAME?.trim().toLowerCase() || "admin",
    email:
      process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase() ||
      "admin@wayratrail.com",
    password: process.env.AUTH_ADMIN_PASSWORD || "admin123",
    role: process.env.AUTH_ADMIN_ROLE?.trim() || "admin",
  },
}

export { projectRoot, serverDir }
