import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { House, LogOut, Trophy } from 'lucide-react';
import { AdminHomeEditor } from '@/components/admin/AdminHomeEditor';
import { AdminInscriptionsPanel } from '@/components/admin/AdminInscriptionsPanel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'inicio' | 'inscripciones'>('inicio');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eff6ef_0%,#f7faf6_36%,#edf4ee_100%)]">
      <header className="border-b border-[#dce7df] bg-[linear-gradient(135deg,#17342a_0%,#0f241d_60%,#17372f_100%)] text-white shadow-[0_25px_65px_-45px_rgba(15,36,29,0.95)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <img src="/chimuelo.png" alt="WAYRA TRAIL" className="h-12 w-auto" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Panel maestro</p>
                <h1 className="mt-2 text-3xl font-black leading-tight lg:text-4xl">Administra historias, portada y registros</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 lg:text-base">
                  El panel ahora separa el inicio visual del evento de la gestión operativa para que puedas editar el contenido con más control y mejor vista previa.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                Bienvenido, <strong>{user?.username}</strong>
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-white/15 bg-white/8 text-white hover:bg-white/15 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-[#dce7df] bg-white p-5 shadow-[0_30px_80px_-60px_rgba(18,49,39,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7368]">Menú admin</p>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => setActiveView('inicio')}
                className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  activeView === 'inicio'
                    ? 'border-[#15352a] bg-[#15352a] text-white shadow-lg shadow-emerald-950/15'
                    : 'border-[#dbe7de] bg-[#f9fbf9] text-[#183127] hover:border-[#c5d6ca] hover:bg-[#f2f7f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${activeView === 'inicio' ? 'bg-white/12' : 'bg-[#e4efe6]'}`}>
                    <House className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Inicio</p>
                    <p className={`text-sm ${activeView === 'inicio' ? 'text-white/72' : 'text-[#6a7f74]'}`}>
                      Fotos, textos, videos y preview visual
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('inscripciones')}
                className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                  activeView === 'inscripciones'
                    ? 'border-[#15352a] bg-[#15352a] text-white shadow-lg shadow-emerald-950/15'
                    : 'border-[#dbe7de] bg-[#f9fbf9] text-[#183127] hover:border-[#c5d6ca] hover:bg-[#f2f7f2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${activeView === 'inscripciones' ? 'bg-white/12' : 'bg-[#e4efe6]'}`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Inscripciones</p>
                    <p className={`text-sm ${activeView === 'inscripciones' ? 'text-white/72' : 'text-[#6a7f74]'}`}>
                      Estadísticas, filtros, exportación y limpieza
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#e5efe7] bg-[#f7faf7] p-4 text-sm text-[#587062]">
              <p className="font-semibold text-[#183127]">Ruta recomendada</p>
              <p className="mt-2 leading-relaxed">
                Usa <strong>Inicio</strong> para construir la portada visual del evento y cambia a <strong>Inscripciones</strong> cuando necesites revisar registros, exportar o limpiar datos.
              </p>
            </div>
          </aside>

          <section>
            {activeView === 'inicio' ? <AdminHomeEditor /> : <AdminInscriptionsPanel />}
          </section>
        </div>
      </main>
    </div>
  );
}
