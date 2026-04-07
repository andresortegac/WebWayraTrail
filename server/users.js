import { getPool } from "./db.js"
import { hashPassword } from "./password.js"

function mapUser(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function findUserByEmail(email) {
  const [rows] = await getPool().execute(
    `
      SELECT id, name, username, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  )

  return mapUser(rows[0])
}

export async function findUserByUsername(username) {
  const [rows] = await getPool().execute(
    `
      SELECT id, name, username, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
    [username]
  )

  return mapUser(rows[0])
}

export async function findUserByIdentifier(identifier) {
  const normalizedIdentifier = identifier.trim().toLowerCase()

  const [rows] = await getPool().execute(
    `
      SELECT id, name, username, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE username = ? OR email = ?
      LIMIT 1
    `,
    [normalizedIdentifier, normalizedIdentifier]
  )

  return mapUser(rows[0])
}

export async function findUserById(id) {
  const [rows] = await getPool().execute(
    `
      SELECT id, name, username, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  )

  return mapUser(rows[0])
}

export async function createUser({
  name,
  username,
  email,
  passwordHash,
  role = "admin",
}) {
  const [result] = await getPool().execute(
    `
      INSERT INTO users (name, username, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `,
    [name, username, email, passwordHash, role]
  )

  return findUserById(result.insertId)
}

export async function ensureAdminUser({
  name,
  username,
  email,
  password,
  role = "admin",
}) {
  if (!username || !email || !password) {
    return null
  }

  const normalizedUsername = username.trim().toLowerCase()
  const normalizedEmail = email.trim().toLowerCase()
  const existingUser =
    (await findUserByUsername(normalizedUsername)) ||
    (await findUserByEmail(normalizedEmail))
  const passwordHash = await hashPassword(password)
  const displayName = name?.trim() || "Administrador WAYRA TRAIL"

  if (!existingUser) {
    return createUser({
      name: displayName,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      role,
    })
  }

  await getPool().execute(
    `
      UPDATE users
      SET name = ?, username = ?, email = ?, password_hash = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      displayName,
      normalizedUsername,
      normalizedEmail,
      passwordHash,
      role,
      existingUser.id,
    ]
  )

  return findUserById(existingUser.id)
}
