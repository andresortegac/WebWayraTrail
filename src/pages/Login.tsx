import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (!err.response) {
          setError('No se pudo conectar con el servidor. Verifica que el backend este iniciado.');
        } else if (status === 401) {
          setError(message || 'Usuario o contrasena incorrectos.');
        } else if (status === 503) {
          setError(message || 'La base de datos no esta disponible en este momento. Revisa la terminal del servidor e intenta nuevamente.');
        } else if (status && status >= 500) {
          setError(message || 'El backend no esta respondiendo correctamente. Revisa la terminal del servidor.');
        } else {
          setError(message || 'Error del servidor al iniciar sesion.');
        }
      } else {
        setError('No se pudo iniciar sesion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </a>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <img src="/chimuelo.png" alt="WAYRA TRAIL" className="w-16 h-16 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Acceso administrador
            </CardTitle>
            <CardDescription>
              WAYRA TRAIL - Panel de administracion
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    className="pl-10"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contrasena"
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full wayra-button"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2026 WAYRA TRAIL - Sitio web realizado por Alfa Digital Solutions S.A.S.
        </p>
      </div>
    </div>
  );
}
