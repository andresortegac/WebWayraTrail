import crypto from "node:crypto"

import { config } from "./config.js"

function sign(payload) {
  return crypto
    .createHmac("sha256", config.auth.secret)
    .update(payload)
    .digest("base64url")
}

export function createAuthToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: Date.now() + config.auth.sessionMinutes * 60 * 1000,
    }),
    "utf8"
  ).toString("base64url")

  return `${payload}.${sign(payload)}`
}

export function verifyAuthToken(token) {
  if (!token || !token.includes(".")) {
    return null
  }

  const [payload, signature] = token.split(".")
  const expectedSignature = sign(payload)
  const receivedBuffer = Buffer.from(signature, "utf8")
  const expectedBuffer = Buffer.from(expectedSignature, "utf8")

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null
  }

  const decoded = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8")
  )

  if (!decoded.exp || decoded.exp < Date.now()) {
    return null
  }

  return decoded
}
