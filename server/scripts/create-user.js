import { closePool } from "../db.js"
import { runMigrations } from "../migrations-runner.js"
import { hashPassword } from "../password.js"
import { createUser, findUserByEmail, findUserByUsername } from "../users.js"

function getArgument(name) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : ""
}

function printUsage() {
  console.log(
    'Uso: npm run db:create-user -- --name "Admin Wayra" --username admin --email admin@wayratrail.com --password TuClave123 --role admin'
  )
}

async function main() {
  const name = getArgument("name") || "Administrador WAYRA TRAIL"
  const username = (getArgument("username") || "admin").trim().toLowerCase()
  const email = getArgument("email").trim().toLowerCase()
  const password = getArgument("password")
  const role = getArgument("role") || "admin"

  if (!username || !email || !password) {
    printUsage()
    process.exitCode = 1
    return
  }

  await runMigrations()

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new Error(`Ya existe un usuario con el correo ${email}.`)
  }

  const existingUsername = await findUserByUsername(username)
  if (existingUsername) {
    throw new Error(`Ya existe un usuario con el nombre ${username}.`)
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser({
    name,
    username,
    email,
    passwordHash,
    role,
  })

  console.log(`Usuario creado correctamente: ${user.username}`)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await closePool()
  })
