import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  CheckCircle,
  ChevronRight,
  FileText,
  Flag,
  MapPin,
  Mail,
  Mountain,
  Phone,
  Shield,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { duplicateHomeContent, getVideoEmbedUrl, isDirectVideoFile, mergeHomeContentWithDefaults } from '@/lib/home-content';
import {
  categories,
  footerItems,
  formReminderItems,
  heroSlides,
  navigationItems,
  officialHighlights,
  officialRegulationSections,
  participantCards,
  quickFacts,
  sponsors,
  tallas,
  timelineSections,
} from '@/data/eventContent';
import { inscriptionService, siteContentService } from '@/services/api';
import type { HomeContent, InscriptionFormData } from '@/types';

const initialFormData: InscriptionFormData = {
  nombres: '',
  apellidos: '',
  cedula: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  genero: 'M',
  talla_camiseta: '',
  contacto_emergencia: '',
  telefono_emergencia: '',
  es_recreativa: false,
};

export default function Home() {
  const [showInscriptionModal, setShowInscriptionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedCategory, setAssignedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAcceptedRegulation, setHasAcceptedRegulation] = useState(false);
  const [formData, setFormData] = useState<InscriptionFormData>(initialFormData);
  const [homeContent, setHomeContent] = useState<HomeContent>(() => duplicateHomeContent());

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const response = await siteContentService.getHomeContent();
        setHomeContent(duplicateHomeContent(mergeHomeContentWithDefaults(response)));
      } catch (error) {
        console.error('Error loading home content:', error);
      }
    };

    void loadHomeContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setHasAcceptedRegulation(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReviewRegulation = () => {
    setShowInscriptionModal(false);
    window.setTimeout(() => scrollToSection('reglamento'), 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasAcceptedRegulation) {
      alert('Debes aceptar el reglamento oficial para completar la inscripcion');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await inscriptionService.create(formData);
      setAssignedCategory(response.categoria);
      setShowInscriptionModal(false);
      setShowSuccessModal(true);
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error al procesar la inscripcion');
      } else {
        alert('Error al procesar la inscripcion');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const customHeroSlides = homeContent.galleryItems
    .filter((item) => item.image.trim() !== '')
    .map((item) => ({
      title: item.title || 'Historia principal',
      subtitle: item.subtitle || 'Texto destacado del inicio',
      description: item.description || 'Presenta el momento, el paisaje o el mensaje principal del evento.',
      location: item.location || 'Wayra Trail',
      badge: item.badge || 'Inicio visual',
      image: item.image,
    }));

  const heroSlidesToRender = customHeroSlides.length > 0 ? customHeroSlides : heroSlides;
  const showcaseGallery = homeContent.galleryItems.filter((item) => item.image.trim() !== '');
  const showcaseVideos = homeContent.videoItems.filter(
    (item) => item.videoUrl.trim() !== '' || item.thumbnail.trim() !== ''
  );

  return (
    <div className="min-h-screen bg-[#F1F8E9]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/chimuelo.png" alt="WAYRA TRAIL" className="h-12 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-green-800 leading-tight">WAYRA TRAIL</h1>
                <p className="text-xs text-green-600">Ruta de Guerreros Ancestrales 16K</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors px-2 py-1 whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
              <a href="/login" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors whitespace-nowrap">
                Admin
              </a>
            </div>
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => scrollToSection('inscripcion')}
                className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors whitespace-nowrap"
              >
                Inscripcion
              </button>
              <a href="/login" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors whitespace-nowrap">
                Admin
              </a>
            </div>
          </div>
          <div className="lg:hidden -mx-4 mt-3 px-4 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pb-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors px-3 py-1.5 rounded-full bg-green-50 whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="inicio" className="relative pt-36 pb-16 lg:pt-32 lg:pb-24 hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
                <Mountain className="w-4 h-4" />
                <span>{homeContent.heroBadge}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
                {homeContent.heroTitle}{' '}
                <span className="wayra-gradient-text">{homeContent.heroHighlight}</span>
              </h1>
              <h2 className="text-xl lg:text-2xl font-bold text-green-700 mb-6">
                {homeContent.heroSubtitle}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                {homeContent.heroDescription}
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-green-800 shadow-sm">
                  Sibundoy
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-green-800 shadow-sm">
                  Putumayo
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-green-800 shadow-sm">
                  Colombia
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowInscriptionModal(true)}
                  className="wayra-button flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {homeContent.primaryCtaText}
                </button>
                <button
                  onClick={() => scrollToSection('reglamento')}
                  className="wayra-button-outline flex items-center justify-center gap-2"
                >
                  {homeContent.secondaryCtaText}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <HeroCarousel slides={heroSlidesToRender} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[linear-gradient(180deg,#fcfdf9_0%,#f2f7f1_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="wayra-gradient rounded-[2rem] p-8 text-white shadow-[0_30px_90px_-50px_rgba(21,53,42,0.88)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                <Flag className="w-4 h-4" />
                {homeContent.spotlightLabel}
              </div>
              <h2 className="mt-6 text-3xl font-black leading-tight lg:text-4xl">{homeContent.spotlightTitle}</h2>
              <p className="mt-4 text-base leading-relaxed text-white/78">{homeContent.spotlightDescription}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {homeContent.infoItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-white/10 p-4 backdrop-blur-sm"
                    style={{ background: `linear-gradient(180deg, ${item.accentColor}30 0%, rgba(255,255,255,0.08) 100%)` }}
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">{item.title}</p>
                    <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {showcaseGallery.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-[2rem] border border-green-100 shadow-xl ${
                    index === 0 ? 'md:col-span-2 min-h-[400px]' : 'min-h-[320px]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                  />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.12)_0%,rgba(6,16,10,0.78)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div
                      className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ backgroundColor: `${item.accentColor}D0` }}
                    >
                      {item.badge}
                    </div>
                    <h3 className="mt-4 text-2xl font-black leading-tight">{item.title}</h3>
                    <p className="mt-2 text-base font-semibold text-green-100">{item.subtitle}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/78">{item.description}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/60">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showcaseVideos.length > 0 ? (
            <div className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">Videos destacados</p>
                  <h3 className="mt-2 text-3xl font-black text-gray-900">Historias en movimiento</h3>
                </div>
                <p className="max-w-2xl text-sm text-gray-600">
                  Estos videos se administran desde el panel del evento y ayudan a presentar teaser, aliados o mensajes clave antes de la inscripcion.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {showcaseVideos.map((item) => {
                  const embedUrl = getVideoEmbedUrl(item.videoUrl);
                  const hasDirectVideo = isDirectVideoFile(item.videoUrl);

                  return (
                    <div key={item.id} className="overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-xl">
                      <div className="relative aspect-video bg-[#10231b]">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title={item.title}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : hasDirectVideo ? (
                          <video src={item.videoUrl} poster={item.thumbnail} controls className="h-full w-full object-cover" />
                        ) : (
                          <>
                            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,13,0.15)_0%,rgba(8,17,13,0.75)_100%)]" />
                          </>
                        )}
                      </div>
                      <div className="p-6">
                        <div
                          className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                          style={{ backgroundColor: item.accentColor }}
                        >
                          {item.tag}
                        </div>
                        <h4 className="mt-4 text-2xl font-black text-gray-900">{item.title}</h4>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="categorias" className="py-16 lg:py-24 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Categorias de <span className="wayra-gradient-text">competencia</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La categoria se define por edad y experiencia. En recreativa solo pueden inscribirse
              quienes no hayan practicado trail running ni carreras atleticas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div
                key={cat.name}
                className="wayra-card p-6 hover:shadow-xl transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <Trophy className="w-8 h-8" style={{ color: cat.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.ageRange}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
            <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Como se valida tu categoria
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="rounded-2xl bg-green-50 p-4">
                  Las categorias Libre, A, B y C aplican para rama masculina y femenina.
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  Tu edad se revisa con base en la fecha de nacimiento registrada.
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  La categoria recreativa exige honestidad total sobre tu experiencia deportiva.
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  La organizacion puede revisar o ajustar inscripciones con datos inconsistentes.
                </div>
              </div>
            </div>

            <div className="wayra-gradient rounded-3xl p-6 text-white shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-[0.18em]">
                <Shield className="w-4 h-4" />
                Regla clave
              </div>
              <h3 className="text-2xl font-bold mt-4 mb-3">Inscribete con honestidad</h3>
              <p className="text-green-50 leading-relaxed">
                El reglamento indica que cada atleta debe elegir la categoria que realmente le corresponde
                segun su edad y experiencia. Si hay inconsistencias, la organizacion puede revisarlas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reglamento" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-5">
                <FileText className="w-4 h-4" />
                Reglamento oficial
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Lo importante, <span className="wayra-gradient-text">sin hacerte leer de mas</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl">
                Resumimos el reglamento en bloques rapidos para que ubiques lo esencial en segundos,
                pero dejamos el detalle completo disponible por secciones para quien quiera revisarlo.
              </p>

              <div className="mt-8 grid md:grid-cols-2 gap-5">
                {officialHighlights.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="wayra-card p-6">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="wayra-gradient rounded-3xl p-8 text-white shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-[0.18em]">
                <Flag className="w-4 h-4" />
                Lectura rapida
              </div>
              <h3 className="text-2xl font-bold mt-4 mb-3">Antes de inscribirte</h3>
              <p className="text-green-50 leading-relaxed">
                La inscripcion implica aceptar el reglamento completo, participar bajo tu responsabilidad
                y cumplir horarios, categoria real y reglas de convivencia.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {quickFacts.map((fact) => (
                  <span
                    key={fact}
                    className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white"
                  >
                    {fact}
                  </span>
                ))}
              </div>
              <button
                onClick={() => scrollToSection('inscripcion')}
                className="mt-8 bg-white text-green-700 px-5 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-md inline-flex items-center gap-2"
              >
                Ir a inscripcion
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 bg-[#F8FCF5] rounded-3xl border border-green-100 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Texto completo por secciones</h3>
                <p className="text-gray-600 mt-1">
                  Todo el reglamento oficial sigue disponible aqui, organizado en acordeones cortos y faciles de revisar.
                </p>
              </div>
              <div className="text-sm text-green-700 font-semibold">
                La inscripcion implica aceptacion total del reglamento.
              </div>
            </div>

            <Accordion type="single" collapsible className="divide-y divide-green-100">
              {officialRegulationSections.map((section) => (
                <AccordionItem key={section.title} value={section.title} className="border-none">
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="text-left pr-4">
                      <p className="text-base font-bold text-gray-900">{section.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{section.summary}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1">
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="horarios" className="py-16 lg:py-24 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Horarios y <span className="wayra-gradient-text">momentos clave</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Aqui tienes la agenda oficial resumida en dos bloques: kits y dia de carrera.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {timelineSections.map((section) => (
              <div key={section.title} className="bg-white rounded-3xl shadow-lg border border-green-100 p-6 lg:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                  <CalendarDays className="w-4 h-4" />
                  {section.day}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{section.description}</p>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={`${section.title}-${item.time}`} className="flex gap-4 rounded-2xl bg-green-50 p-4">
                      <div className="min-w-[120px] text-sm font-bold text-green-700">{item.time}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {section.alert}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="compromisos" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Claves para <span className="wayra-gradient-text">competir bien</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Este bloque junta lo que mas suele preguntar un corredor: que debe cumplir, que llevar,
              como se maneja la premiacion y cuando una inscripcion puede revisarse.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {participantCards.map(({ title, items, icon: Icon }) => (
              <div key={title} className="wayra-card p-6 lg:p-7">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="patrocinios" className="py-16 lg:py-24 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Patrocinios y <span className="wayra-gradient-text">aliados</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Gracias a las marcas y aliados que respaldan esta experiencia y ayudan a hacer
              posible cada detalle de WAYRA TRAIL.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col items-center justify-center text-center min-h-[190px]">
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="h-20 w-full object-contain mb-4"
                />
                <p className="text-sm font-semibold text-gray-700">{sponsor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inscripcion" className="py-16 lg:py-24 wayra-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Listo para el desafio
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Completa tu registro y asegura tu lugar en esta experiencia. Los cupos son limitados.
          </p>
          <button
            onClick={() => setShowInscriptionModal(true)}
            className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Inscribirme ahora
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/chimuelo.png" alt="WAYRA TRAIL" className="h-16 w-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">WAYRA TRAIL</h3>
              <p className="text-gray-400 text-sm">Ruta de Guerreros Ancestrales 16K</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@wayratrail.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +593 98 765 4321
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ecuador
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <div className="space-y-2">
                {footerItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <a href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Administrador
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 WAYRA TRAIL - Desarrolladores ALFA DIGITAL SOLUTION S.A.S</p>
          </div>
        </div>
      </footer>

      <Dialog open={showInscriptionModal} onOpenChange={setShowInscriptionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Formulario de inscripcion
            </DialogTitle>
            <DialogDescription>
              Completa tus datos y confirma que aceptas el reglamento oficial de WAYRA TRAIL 16K.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingresa tus nombres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingresa tus apellidos"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cedula/Pasaporte *</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingresa tu numero de identificacion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electronico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  placeholder="099 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genero">Genero *</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value: 'M' | 'F') => setFormData((prev) => ({ ...prev, genero: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu genero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="talla_camiseta">Talla de camiseta *</Label>
                <Select
                  value={formData.talla_camiseta}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, talla_camiseta: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {tallas.map((talla) => (
                      <SelectItem key={talla} value={talla}>
                        {talla}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contacto_emergencia">Contacto de emergencia *</Label>
                <Input
                  id="contacto_emergencia"
                  name="contacto_emergencia"
                  value={formData.contacto_emergencia}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre del contacto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono_emergencia">Telefono de emergencia *</Label>
                <Input
                  id="telefono_emergencia"
                  name="telefono_emergencia"
                  value={formData.telefono_emergencia}
                  onChange={handleInputChange}
                  required
                  placeholder="099 123 4567"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="es_recreativa"
                checked={formData.es_recreativa}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, es_recreativa: checked as boolean }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="es_recreativa"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Participar en categoria recreativa
                </Label>
                <p className="text-sm text-gray-500">
                  Marca esta opcion solo si no has practicado trail running ni carreras atleticas.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50/80 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white text-green-700 flex items-center justify-center shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Resumen express del reglamento</p>
                  <div className="mt-2 space-y-2">
                    {formReminderItems.map((item) => (
                      <p key={item} className="text-sm text-gray-600 leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acepta_reglamento"
                  checked={hasAcceptedRegulation}
                  onCheckedChange={(checked) => setHasAcceptedRegulation(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="acepta_reglamento"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    He leido y acepto el reglamento oficial del evento *
                  </Label>
                  <p className="text-sm text-gray-500">
                    La inscripcion solo se formaliza si aceptas las condiciones del reglamento oficial.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReviewRegulation}
                className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors inline-flex items-center gap-2"
              >
                Ver reglamento resumido en la pagina
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full wayra-button"
                disabled={isSubmitting || !hasAcceptedRegulation}
              >
                {isSubmitting ? 'Procesando...' : 'Completar inscripcion'}
              </Button>
              {!hasAcceptedRegulation && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Debes aceptar el reglamento oficial para continuar.
                </p>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Inscripcion exitosa
            </DialogTitle>
            <DialogDescription className="text-center">
              Tu registro fue procesado correctamente.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">Has sido asignado a la categoria:</p>
            <div
              className="inline-block px-6 py-3 rounded-xl text-xl font-bold"
              style={{
                backgroundColor: `${categories.find((c) => c.name === assignedCategory)?.color || '#10B981'}20`,
                color: categories.find((c) => c.name === assignedCategory)?.color || '#10B981',
              }}
            >
              {assignedCategory}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Recuerda el color de tu categoria para la entrega de kits.
            </p>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full wayra-button">
            Aceptar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
