import { useEffect, useRef, useState } from 'react'
import { 
  Mountain, 
  Clock, 
  Calendar, 
  Award, 
  Droplets, 
  Footprints, 
  HandMetal,
  Wind,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Trophy,
  Backpack,
  Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import './App.css'
import chimueloImage from '../img/chimuelo.png'
import alfaDigitalLogo from '../img/alfa digital.png'
import christianLogo from '../img/christian.jpeg'
import climaLabLogo from '../img/clima lab.jpeg'
import comecializadoraHortofruticalLogo from '../img/comecializadora hortofrutical.jpeg'
import semprandoEconomiaLogo from '../img/semprando economia.jpeg'

const sponsors = [
  {
    name: 'Alfa Digital',
    tag: 'Aliado en visibilidad',
    description:
      'Patrocinador que impulsa la presencia de WAYRA TRAIL y fortalece la conexión del evento con más corredores y comunidades.',
    logo: alfaDigitalLogo,
  },
  {
    name: 'Christian',
    tag: 'Respaldo a la comunidad',
    description:
      'Marca aliada que acompaña esta experiencia deportiva y aporta respaldo para seguir construyendo una carrera con identidad local.',
    logo: christianLogo,
  },
  {
    name: 'Clima Lab',
    tag: 'Innovación y acompañamiento',
    description:
      'Empresa patrocinadora que se suma al desarrollo del evento con apoyo a una experiencia organizada, cercana y memorable.',
    logo: climaLabLogo,
  },
  {
    name: 'Comecializadora Hortofrutical',
    tag: 'Bienestar y apoyo logístico',
    description:
      'Aliado que aporta al crecimiento de WAYRA TRAIL y respalda el ambiente de bienestar, esfuerzo y trabajo en equipo del evento.',
    logo: comecializadoraHortofruticalLogo,
  },
  {
    name: 'Semprando Economia',
    tag: 'Impulso al territorio',
    description:
      'Patrocinador comprometido con el fortalecimiento del entorno local y con hacer posible una jornada deportiva con mayor alcance.',
    logo: semprandoEconomiaLogo,
  },
]

function App() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div className="min-h-screen bg-wayra-dark text-wayra-cream overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-wayra-dark/90 backdrop-blur-md border-b border-wayra-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-wayra-trail.png" 
                alt="WAYRA TRAIL Logo" 
                className="h-10 md:h-12 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#reglamento" className="text-sm font-medium hover:text-wayra-gold transition-colors">Reglamento</a>
              <a href="#horarios" className="text-sm font-medium hover:text-wayra-gold transition-colors">Horarios</a>
              <a href="#compromisos" className="text-sm font-medium hover:text-wayra-gold transition-colors">Compromisos</a>
              <a href="#patrocinios" className="text-sm font-medium hover:text-wayra-gold transition-colors">Patrocinios</a>
              <a href="#inscripcion" className="text-sm font-medium hover:text-wayra-gold transition-colors">Inscripción</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero"
        ref={setRef('hero')}
        className="relative min-h-screen flex items-center justify-center pt-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Montañas WAYRA TRAIL" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wayra-dark/70 via-wayra-dark/50 to-wayra-dark" />
        </div>

        {/* Content */}
        <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo Principal */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo-wayra-trail.png" 
              alt="WAYRA TRAIL Logo Oficial" 
              className="h-32 md:h-48 lg:h-56 w-auto drop-shadow-2xl"
            />
          </div>

          {/* Título Principal */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
            <span className="text-gradient-gold">WAYRA TRAIL</span>
          </h1>
          <h2 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold mb-6 text-wayra-cream/90">
            RUTA DE GUERREROS ANCESTRALES <span className="text-wayra-gold">16K</span>
          </h2>

          {/* Frase de Bienvenida */}
          <p className="text-lg md:text-xl text-wayra-cream/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Bienvenido a una experiencia única donde el espíritu de los <span className="text-wayra-gold font-semibold">guerreros ancestrales</span> se fusiona con la pasión del <span className="text-wayra-gold font-semibold">trail running</span>. 
            Superación, aventura y conexión con la montaña en los Andes.
          </p>

          {/* Mascota Chimuelo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-wayra-gold/20 rounded-full blur-3xl" />
              <img 
                src={chimueloImage}
                alt="Chimuelo - Mascota Oficial" 
                className="relative h-40 md:h-56 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-wayra-green/80 backdrop-blur-sm px-6 py-3 rounded-full border border-wayra-gold/30">
              <p className="text-wayra-gold font-heading font-bold text-lg">
                <Flame className="inline-block w-5 h-5 mr-2" />
                Conoce a Chimuelo
              </p>
              <p className="text-wayra-cream/80 text-sm">Nuestra mascota oficial del evento</p>
            </div>
          </div>

          {/* CTA Button */}
          <a href="#inscripcion">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-wayra-gold to-wayra-orange hover:from-wayra-orange hover:to-wayra-gold text-wayra-dark font-bold text-lg px-8 py-6 rounded-full animate-pulse-glow transition-all duration-300 hover:scale-105"
            >
              Quiero Inscribirme
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-wayra-gold/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-wayra-gold rounded-full" />
          </div>
        </div>
      </section>

      {/* Reglamento Oficial Section */}
      <section 
        id="reglamento"
        ref={setRef('reglamento')}
        className="py-20 md:py-32 relative"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['reglamento'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-wayra-gold/10 border border-wayra-gold/30 rounded-full px-4 py-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-wayra-gold" />
                <span className="text-wayra-gold font-medium text-sm">Documento Importante</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Reglamento Oficial del Evento</span>
              </h2>
              <p className="text-wayra-cream/70 text-lg md:text-xl max-w-2xl mx-auto">
                Este reglamento debe leerse cuidadosamente antes de realizar la inscripción
              </p>
            </div>

            {/* Commitment Card */}
            <div className="bg-gradient-card rounded-2xl p-8 md:p-12 border border-wayra-gold/30 shadow-glow">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-wayra-gold/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-wayra-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-wayra-cream mb-2">
                    Compromiso del Participante
                  </h3>
                  <p className="text-wayra-cream/70">
                    Al realizar mi inscripción, me comprometo a cumplir los siguientes requisitos del evento:
                  </p>
                </div>
              </div>

              <div className="bg-wayra-dark/50 rounded-xl p-6 border-l-4 border-wayra-gold">
                <p className="text-wayra-cream/90 text-lg italic">
                  "Me comprometo, al realizar mi inscripción, a cumplir los siguientes requisitos del evento"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fechas y Horarios Section */}
      <section 
        id="horarios"
        ref={setRef('horarios')}
        className="py-20 md:py-32 bg-wayra-green/10 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wayra-green/20 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible['horarios'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-wayra-gold/10 border border-wayra-gold/30 rounded-full px-4 py-2 mb-6">
                <Clock className="w-5 h-5 text-wayra-gold" />
                <span className="text-wayra-gold font-medium text-sm">Programación</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Fechas y Horarios Importantes</span>
              </h2>
            </div>

            {/* Timeline Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Entrega de Kits */}
              <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-wayra-gold/20 hover:border-wayra-gold/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-wayra-gold/20 p-3 rounded-xl">
                    <Backpack className="w-6 h-6 text-wayra-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-wayra-gold">ENTREGA DE KITS</h3>
                    <p className="text-wayra-cream/70 text-sm">10 de Octubre</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Jornada Continua</p>
                      <p className="text-wayra-cream/60 text-sm">8:00 a.m. a 12:00 m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Tarde</p>
                      <p className="text-wayra-cream/60 text-sm">12:00 m. a 6:00 p.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Noche</p>
                      <p className="text-wayra-cream/60 text-sm">6:00 p.m. a 10:00 p.m.</p>
                    </div>
                  </div>
                </div>

                {/* Aclaración Importante */}
                <div className="mt-6 bg-wayra-orange/10 border border-wayra-orange/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-wayra-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-wayra-orange font-semibold text-sm mb-1">ACLARACIÓN IMPORTANTE</p>
                      <p className="text-wayra-cream/70 text-sm">
                        El día 11 de octubre el equipo de logística <span className="text-wayra-orange font-semibold">no se hace responsable</span> de la entrega de kits.
                      </p>
                      <p className="text-wayra-cream/70 text-sm mt-2">
                        En caso de no asistir el 10 de octubre, el participante debe asignar a un <span className="text-wayra-gold">compañero de confianza</span> para reclamarlo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Día de la Carrera */}
              <div className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-wayra-gold/20 hover:border-wayra-gold/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-wayra-gold/20 p-3 rounded-xl">
                    <Mountain className="w-6 h-6 text-wayra-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-wayra-gold">DÍA DE LA CARRERA</h3>
                    <p className="text-wayra-cream/70 text-sm">11 de Octubre</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <MapPin className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Concentración</p>
                      <p className="text-wayra-gold font-bold">6:30 a.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Flame className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Calentamiento e Información</p>
                      <p className="text-wayra-cream/60 text-sm">Espacio preparatorio</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-gold/20 rounded-lg p-4 border border-wayra-gold/30">
                    <Footprints className="w-5 h-5 text-wayra-gold flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Hora de Salida</p>
                      <p className="text-wayra-gold font-bold text-lg">8:00 a.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Clock className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Llegada Estimada</p>
                      <p className="text-wayra-cream/80">12:30 p.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Trophy className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Premiación</p>
                      <p className="text-wayra-cream/80">1:00 p.m.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-wayra-dark/50 rounded-lg p-4">
                    <Calendar className="w-5 h-5 text-wayra-green-bright flex-shrink-0" />
                    <div>
                      <p className="text-wayra-cream font-medium">Cierre del Evento</p>
                      <p className="text-wayra-cream/80">2:00 p.m.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compromisos del Participante Section */}
      <section 
        id="compromisos"
        ref={setRef('compromisos')}
        className="py-20 md:py-32 relative"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['compromisos'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-wayra-gold/10 border border-wayra-gold/30 rounded-full px-4 py-2 mb-6">
                <HandMetal className="w-5 h-5 text-wayra-gold" />
                <span className="text-wayra-gold font-medium text-sm">Tu Responsabilidad</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Compromisos del Participante</span>
              </h2>
              <p className="text-wayra-cream/70 text-lg max-w-2xl mx-auto">
                Cumplir con estos compromisos garantiza una experiencia segura y exitosa para todos
              </p>
            </div>

            {/* Commitments Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Commitment 1 */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-gold/30 transition-colors">
                  <Clock className="w-6 h-6 text-wayra-gold" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Puntualidad en Entrega de Kits</h3>
                <p className="text-wayra-cream/70 text-sm">Llegar puntual el día de la entrega de kits, el 10 de octubre</p>
              </div>

              {/* Commitment 2 */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-orange/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-orange/30 transition-colors">
                  <AlertTriangle className="w-6 h-6 text-wayra-orange" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">No Entrega el Día de Carrera</h3>
                <p className="text-wayra-cream/70 text-sm">Entender que el 11 de octubre no habrá entrega de kits por parte del equipo logístico</p>
              </div>

              {/* Commitment 3 */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-gold/30 transition-colors">
                  <MapPin className="w-6 h-6 text-wayra-gold" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Concentración Puntual</h3>
                <p className="text-wayra-cream/70 text-sm">Llegar puntual el día de la carrera, 11 de octubre, a las 6:30 a.m.</p>
              </div>

              {/* Commitment 4 */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-green-bright/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-green-bright/30 transition-colors">
                  <Flame className="w-6 h-6 text-wayra-green-bright" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Participación Responsable</h3>
                <p className="text-wayra-cream/70 text-sm">Participar responsablemente en el calentamiento y en la información previa a la carrera</p>
              </div>

              {/* Commitment 5 */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-gold/30 transition-colors">
                  <Trophy className="w-6 h-6 text-wayra-gold" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Espíritu Deportivo</h3>
                <p className="text-wayra-cream/70 text-sm">Esperar al último atleta en caso de ocupar uno de los 5 primeros puestos para la premiación</p>
              </div>

              {/* Commitment 6 - Hidratación */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-green-bright/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-green-bright/30 transition-colors">
                  <Droplets className="w-6 h-6 text-wayra-green-bright" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Cantimplora Obligatoria</h3>
                <p className="text-wayra-cream/70 text-sm">Llevar cantimplora para recibir agua en los puntos de avituallamiento. No se recomienda el uso de bolsas de agua</p>
              </div>

              {/* Commitment 7 - Guantes */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-orange/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-orange/30 transition-colors">
                  <HandMetal className="w-6 h-6 text-wayra-orange" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Guantes</h3>
                <p className="text-wayra-cream/70 text-sm">Llevar guantes para protección durante el ascenso y descenso</p>
              </div>

              {/* Commitment 8 - Bastones */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-gold/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-gold/30 transition-colors">
                  <Footprints className="w-6 h-6 text-wayra-gold" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Bastones de Trail</h3>
                <p className="text-wayra-cream/70 text-sm">Llevar bastones de trail o palillos de madera para facilitar el ascenso y descenso de la montaña</p>
              </div>

              {/* Commitment 9 - Calzado */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group">
                <div className="bg-wayra-green-bright/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-wayra-green-bright/30 transition-colors">
                  <Footprints className="w-6 h-6 text-wayra-green-bright" />
                </div>
                <h3 className="font-heading font-bold text-wayra-cream mb-2">Calzado Apropiado</h3>
                <p className="text-wayra-cream/70 text-sm">Llevar zapatillas running de montaña o zapatos con taches para evitar caídas en el terreno</p>
              </div>

              {/* Commitment 10 - Equipo de Lluvia */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300 group sm:col-span-2 lg:col-span-3">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-wayra-orange/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-wayra-orange/30 transition-colors">
                    <Wind className="w-6 h-6 text-wayra-orange" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-wayra-cream mb-2">Equipo para Lluvia</h3>
                    <p className="text-wayra-cream/70">En caso de lluvia, llevar gorro para el frío, <span className="text-wayra-gold">pito</span> y <span className="text-wayra-gold">chaqueta rompevientos</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patrocinios Section */}
      <section
        id="patrocinios"
        ref={setRef('patrocinios')}
        className="py-20 md:py-32 bg-wayra-green/10 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-wayra-gold/15 via-transparent to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible['patrocinios'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-wayra-gold/10 border border-wayra-gold/30 rounded-full px-4 py-2 mb-6">
                <Award className="w-5 h-5 text-wayra-gold" />
                <span className="text-wayra-gold font-medium text-sm">Patrocinadores Oficiales</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Empresas que impulsan esta aventura</span>
              </h2>
              <p className="text-wayra-cream/70 text-lg max-w-3xl mx-auto">
                Nuestros patrocinadores hacen posible que WAYRA TRAIL siga creciendo con más alcance, mejor experiencia y mayor conexión con la comunidad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sponsors.map((sponsor) => (
                <article
                  key={sponsor.name}
                  className="group bg-gradient-card rounded-2xl p-6 border border-wayra-gold/20 hover:border-wayra-gold/50 hover:shadow-glow transition-all duration-300"
                >
                  <div className="bg-white/95 rounded-2xl min-h-40 flex items-center justify-center p-5 mb-6 shadow-lg">
                    <img
                      src={sponsor.logo}
                      alt={`Logo de ${sponsor.name}`}
                      className="max-h-24 w-full object-contain"
                    />
                  </div>

                  <div className="inline-flex items-center rounded-full bg-wayra-gold/10 border border-wayra-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-wayra-gold mb-4">
                    {sponsor.tag}
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-wayra-cream mb-3">
                    {sponsor.name}
                  </h3>
                  <p className="text-wayra-cream/75 leading-relaxed">
                    {sponsor.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías e Inscripción Section */}
      <section 
        id="inscripcion"
        ref={setRef('inscripcion')}
        className="py-20 md:py-32 bg-wayra-green/10 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wayra-green/20 via-transparent to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${isVisible['inscripcion'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-wayra-gold/10 border border-wayra-gold/30 rounded-full px-4 py-2 mb-6">
                <Award className="w-5 h-5 text-wayra-gold" />
                <span className="text-wayra-gold font-medium text-sm">Categorías</span>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Categorías e Inscripción Responsable</span>
              </h2>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-card rounded-2xl p-8 md:p-10 border border-wayra-gold/30 shadow-glow mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-wayra-gold/20 p-4 rounded-xl">
                  <Mountain className="w-8 h-8 text-wayra-gold" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-wayra-cream">
                  Bienvenido a WAYRA TRAIL
                </h3>
              </div>
              <p className="text-wayra-cream/80 text-lg leading-relaxed">
                Bienvenido a la plataforma oficial del evento <span className="text-wayra-gold font-semibold">WAYRA TRAIL – RUTA DE GUERREROS ANCESTRALES 16K</span>. 
                Estamos emocionados de tenerte como parte de esta aventura única en la montaña.
              </p>
            </div>

            {/* Categories Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Categoría Recreativa */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-green-bright/30 hover:border-wayra-green-bright/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-wayra-green-bright/20 p-3 rounded-xl">
                    <Footprints className="w-6 h-6 text-wayra-green-bright" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-wayra-green-bright">Categoría Recreativa</h3>
                </div>
                <div className="space-y-3 text-wayra-cream/80">
                  <p>
                    Si una persona <span className="text-wayra-gold font-semibold">nunca ha practicado esta disciplina</span> o no ha participado en carreras atléticas de ninguna modalidad, ya sea ruta o circuito, puede inscribirse en la categoría recreativa.
                  </p>
                  <div className="bg-wayra-orange/10 border border-wayra-orange/30 rounded-lg p-3">
                    <p className="text-wayra-orange text-sm">
                      <AlertTriangle className="inline-block w-4 h-4 mr-1" />
                      Si no cumple con esta condición, no será aceptado en esa categoría.
                    </p>
                  </div>
                </div>
              </div>

              {/* Inscripción Responsable */}
              <div className="bg-gradient-card rounded-xl p-6 border border-wayra-gold/30 hover:border-wayra-gold/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-wayra-gold/20 p-3 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-wayra-gold" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-wayra-gold">Inscripción Responsable</h3>
                </div>
                <div className="space-y-3 text-wayra-cream/80">
                  <p>
                    El participante debe ser <span className="text-wayra-gold font-semibold">sincero</span> e inscribirse en la categoría que realmente le corresponde.
                  </p>
                  <p>
                    Después de leer todo el reglamento, el participante puede continuar con la inscripción.
                  </p>
                  <p>
                    Debe enviar su foto a la categoría que, según su edad, le corresponde.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <div className="bg-wayra-dark/50 rounded-2xl p-8 border border-wayra-gold/20">
                <p className="text-wayra-cream/70 mb-6 text-lg">
                  ¿Has leído todo el reglamento y estás listo para ser parte de esta aventura?
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-wayra-gold to-wayra-orange hover:from-wayra-orange hover:to-wayra-gold text-wayra-dark font-bold text-lg px-10 py-6 rounded-full animate-pulse-glow transition-all duration-300 hover:scale-105"
                  onClick={() => alert('Redirigiendo al sistema de inscripción...')}
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  He leído el reglamento y deseo inscribirme
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-wayra-cream/50 text-sm mt-4">
                  Serás redirigido a la plataforma de inscripción oficial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-wayra-dark border-t border-wayra-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/logo-wayra-trail.png" 
                alt="WAYRA TRAIL" 
                className="h-16 w-auto"
              />
              <div>
                <p className="font-heading font-bold text-wayra-cream">WAYRA TRAIL</p>
                <p className="text-wayra-cream/60 text-sm">Ruta de Guerreros Ancestrales 16K</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center md:text-right">
                <p className="text-wayra-gold font-semibold">10 de Octubre</p>
                <p className="text-wayra-cream/60 text-sm">Entrega de Kits</p>
              </div>
              <div className="w-px h-10 bg-wayra-gold/30" />
              <div className="text-center md:text-right">
                <p className="text-wayra-gold font-semibold">11 de Octubre</p>
                <p className="text-wayra-cream/60 text-sm">Día de la Carrera</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-wayra-gold/10 text-center">
            <p className="text-wayra-cream/50 text-sm">
              © 2024 WAYRA TRAIL - Ruta de Guerreros Ancestrales 16K. Todos los derechos reservados.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <img 
                src={chimueloImage}
                alt="Chimuelo" 
                className="h-8 w-auto opacity-70"
              />
              <span className="text-wayra-cream/40 text-xs">Con el apoyo de Chimuelo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
