import { config } from "../config.js"
import { closePool } from "../db.js"
import { runMigrations } from "../migrations-runner.js"
import { ensureAdminUser } from "../users.js"

async function main() {
  const result = await runMigrations()

  const adminUser = await ensureAdminUser(config.adminSeed)

  if (result.executed.length === 0) {
    console.log("No hay migraciones pendientes.")
    console.log(
      `Usuario por defecto sincronizado: ${adminUser.username} / ${config.adminSeed.password}`
    )
    return
  }

  console.log(`Migraciones aplicadas: ${result.executed.join(", ")}`)
  console.log(
    `Usuario por defecto sincronizado: ${adminUser.username} / ${config.adminSeed.password}`
  )
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await closePool()
  })
