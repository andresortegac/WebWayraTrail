import fs from "node:fs/promises"
import path from "node:path"

import { serverDir } from "./config.js"
import { ensureDatabaseExists, getPool } from "./db.js"

const migrationsDir = path.join(serverDir, "migrations")

export async function runMigrations() {
  await ensureDatabaseExists()

  const pool = getPool()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const [appliedRows] = await pool.query(
    "SELECT name FROM schema_migrations ORDER BY id ASC"
  )
  const appliedMigrations = new Set(
    appliedRows.map((migration) => migration.name)
  )

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort()

  const executed = []

  for (const file of files) {
    if (appliedMigrations.has(file)) {
      continue
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8")
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()
      await connection.query(sql)
      await connection.execute(
        "INSERT INTO schema_migrations (name) VALUES (?)",
        [file]
      )
      await connection.commit()
      executed.push(file)
    } catch (error) {
      await connection.rollback()

      throw new Error(
        `No se pudo ejecutar la migracion ${file}: ${error.message}`
      )
    } finally {
      connection.release()
    }
  }

  return {
    executed,
    total: files.length,
  }
}
