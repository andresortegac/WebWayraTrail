export type AuthUser = {
  id: number
  name: string
  username: string
  email: string
  role: string
  createdAt?: string
  updatedAt?: string
}

type LoginResponse = {
  token: string
  user: AuthUser
}

type CurrentUserResponse = {
  user: AuthUser
}

const TOKEN_STORAGE_KEY = "wayratrail_auth_token"
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

type RequestOptions = RequestInit & {
  token?: string
}

async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { token, headers, ...rest } = options
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
    })
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor de autenticacion. Inicia la API con npm run server."
    )
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : "No se pudo completar la solicitud."
    )
  }

  return payload as T
}

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function persistToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function loginUser(identifier: string, password: string) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  })
}

export async function fetchCurrentUser(token: string) {
  return apiRequest<CurrentUserResponse>("/api/auth/me", {
    method: "GET",
    token,
  })
}
