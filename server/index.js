import express from "express"

import { config } from "./config.js"
import { closePool } from "./db.js"
import { runMigrations } from "./migrations-runner.js"
import { verifyPassword } from "./password.js"
import { createAuthToken, verifyAuthToken } from "./token.js"
import {
  ensureAdminUser,
  findUserByIdentifier,
  findUserById,
} from "./users.js"

const app = express()

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function getTokenFromRequest(request) {
  const authorization = request.headers.authorization ?? ""

  if (!authorization.startsWith("Bearer ")) {
    return null
  }

  return authorization.slice(7).trim()
}

app.use((request, response, next) => {
  const origin = request.headers.origin

  if (!origin || config.corsOrigins.includes(origin)) {
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin)
      response.setHeader("Vary", "Origin")
    }

    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  }

  if (request.method === "OPTIONS") {
    response.status(204).end()
    return
  }

  next()
})

app.use(express.json())

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    database: config.db.database,
  })
})

app.post("/api/auth/login", async (request, response) => {
  const identifier = String(
    request.body?.identifier ?? request.body?.username ?? request.body?.email ?? ""
  )
    .trim()
    .toLowerCase()
  const password = String(request.body?.password ?? "")

  if (!identifier || !password) {
    response.status(400).json({
      message: "Usuario y contraseña son obligatorios.",
    })
    return
  }

  const user = await findUserByIdentifier(identifier)

  if (!user) {
    response.status(401).json({
      message: "Credenciales invalidas.",
    })
    return
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    response.status(401).json({
      message: "Credenciales invalidas.",
    })
    return
  }

  response.json({
    token: createAuthToken(user),
    user: sanitizeUser(user),
  })
})

app.get("/api/auth/me", async (request, response) => {
  const token = getTokenFromRequest(request)
  const payload = verifyAuthToken(token)

  if (!payload) {
    response.status(401).json({
      message: "Sesion expirada o invalida.",
    })
    return
  }

  const user = await findUserById(payload.sub)

  if (!user) {
    response.status(401).json({
      message: "El usuario ya no existe.",
    })
    return
  }

  response.json({
    user: sanitizeUser(user),
  })
})

app.post("/api/auth/logout", (_request, response) => {
  response.json({
    message: "Sesion cerrada.",
  })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({
    message: "Ocurrio un error interno en el servidor.",
  })
})

async function startServer() {
  const migrationResult = await runMigrations()

  if (migrationResult.executed.length > 0) {
    console.log(
      `Migraciones aplicadas al iniciar: ${migrationResult.executed.join(", ")}`
    )
  }

  if (config.adminSeed.email && config.adminSeed.password) {
    const user = await ensureAdminUser(config.adminSeed)
    console.log(`Usuario inicial sincronizado: ${user.email}`)
  }

  app.listen(config.port, () => {
    console.log(
      `API WAYRA TRAIL disponible en http://127.0.0.1:${config.port}`
    )
  })
}

async function shutdown() {
  await closePool()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

startServer().catch(async (error) => {
  console.error(error)
  await closePool()
  process.exit(1)
})
