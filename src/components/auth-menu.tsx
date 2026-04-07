import { useEffect, useState, type FormEvent } from "react"
import {
  LoaderCircle,
  LogIn,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  clearStoredToken,
  fetchCurrentUser,
  getStoredToken,
  loginUser,
  persistToken,
  type AuthUser,
} from "@/lib/auth-client"

const initialCredentials = {
  identifier: "admin",
  password: "",
}

export function AuthMenu() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [credentials, setCredentials] = useState(initialCredentials)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let ignore = false

    async function restoreSession() {
      const token = getStoredToken()

      if (!token) {
        if (!ignore) {
          setIsCheckingSession(false)
        }

        return
      }

      try {
        const response = await fetchCurrentUser(token)

        if (!ignore) {
          setCurrentUser(response.user)
        }
      } catch {
        clearStoredToken()

        if (!ignore) {
          setCurrentUser(null)
        }
      } finally {
        if (!ignore) {
          setIsCheckingSession(false)
        }
      }
    }

    restoreSession()

    return () => {
      ignore = true
    }
  }, [])

  const shortName = currentUser?.name.split(" ")[0] ?? ""

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const response = await loginUser(
        credentials.identifier,
        credentials.password
      )
      persistToken(response.token)
      setCurrentUser(response.user)
      setCredentials(initialCredentials)
      setIsDialogOpen(false)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesion."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLogout() {
    clearStoredToken()
    setCurrentUser(null)
    setCredentials(initialCredentials)
    setErrorMessage("")
  }

  if (isCheckingSession) {
    return (
      <Button
        type="button"
        disabled
        className="rounded-full border border-wayra-gold/20 bg-wayra-dark/60 px-4 text-wayra-cream/80"
      >
        <LoaderCircle className="animate-spin" />
        Verificando
      </Button>
    )
  }

  if (currentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            className="rounded-full border border-wayra-gold/30 bg-wayra-green/35 px-4 text-wayra-cream hover:border-wayra-gold/60 hover:bg-wayra-green/45"
          >
            <ShieldCheck className="size-4 text-wayra-gold" />
            <span className="hidden sm:inline">{shortName}</span>
            <span className="sm:hidden">Cuenta</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 border-wayra-gold/20 bg-wayra-dark text-wayra-cream"
        >
          <DropdownMenuLabel className="space-y-1 px-3 py-2">
            <p className="font-semibold text-wayra-cream">{currentUser.name}</p>
            <p className="text-xs text-wayra-cream/60">
              @{currentUser.username} · {currentUser.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-wayra-gold/10" />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              handleLogout()
            }}
            className="cursor-pointer px-3 py-2 text-wayra-cream focus:bg-wayra-green/40 focus:text-wayra-gold"
          >
            <LogOut className="size-4 text-wayra-gold" />
            Cerrar sesion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-full border border-wayra-gold/30 bg-wayra-green/35 px-4 text-wayra-cream hover:border-wayra-gold/60 hover:bg-wayra-green/45"
        >
          <LogIn className="size-4 text-wayra-gold" />
          Iniciar sesion
        </Button>
      </DialogTrigger>

      <DialogContent className="border border-wayra-gold/20 bg-wayra-dark p-0 text-wayra-cream sm:max-w-md">
        <div className="rounded-3xl border border-wayra-gold/10 bg-gradient-card p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl text-wayra-cream">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-wayra-gold/15">
                <UserRound className="size-5 text-wayra-gold" />
              </span>
              Acceso WAYRA TRAIL
            </DialogTitle>
            <DialogDescription className="text-wayra-cream/70">
              Inicia sesion con un usuario guardado en MySQL para administrar el
              acceso desde el menu.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-wayra-cream">
                Usuario
              </Label>
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="admin"
                value={credentials.identifier}
                onChange={(event) =>
                  setCredentials((previous) => ({
                    ...previous,
                    identifier: event.target.value,
                  }))
                }
                className="h-11 border-wayra-gold/20 bg-wayra-dark/70 text-wayra-cream placeholder:text-wayra-cream/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-wayra-cream">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="admin123"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
                className="h-11 border-wayra-gold/20 bg-wayra-dark/70 text-wayra-cream placeholder:text-wayra-cream/40"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </div>
            ) : (
              <p className="rounded-2xl border border-wayra-gold/10 bg-wayra-dark/40 px-4 py-3 text-sm text-wayra-cream/65">
                Credenciales por defecto: usuario `admin` y contraseña
                `admin123`.
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-2xl bg-gradient-to-r from-wayra-gold to-wayra-orange text-wayra-dark hover:from-wayra-orange hover:to-wayra-gold"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
