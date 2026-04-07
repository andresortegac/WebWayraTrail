import crypto from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(crypto.scrypt)
const KEY_LENGTH = 64

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = await scrypt(password, salt, KEY_LENGTH)

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false
  }

  const [salt, expectedHash] = storedHash.split(":")
  const derivedKey = await scrypt(password, salt, KEY_LENGTH)
  const expectedBuffer = Buffer.from(expectedHash, "hex")
  const derivedBuffer = Buffer.from(derivedKey)

  if (expectedBuffer.length !== derivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, derivedBuffer)
}
