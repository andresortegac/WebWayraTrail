import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Eye,
  Flag,
  Image,
  MapPin,
  Mountain,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { navigationItems } from '@/data/eventContent';
import {
  createEmptyGalleryItem,
  createEmptyInfoItem,
  createEmptyVideoItem,
  duplicateHomeContent,
  getVideoEmbedUrl,
  isDirectVideoFile,
  mergeHomeContentWithDefaults,
} from '@/lib/home-content';
import { siteContentService } from '@/services/api';
import type { HomeContent, HomeGalleryItem, HomeInfoItem, HomeVideoItem } from '@/types';

type SaveState = {
  tone: 'idle' | 'success' | 'error';
  message: string;
};

const FALLBACK_PREVIEW_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23163126'/%3E%3Cstop offset='0.5' stop-color='%2325493d'/%3E%3Cstop offset='1' stop-color='%23c18d2d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Ccircle cx='220' cy='180' r='170' fill='rgba(255,255,255,0.08)'/%3E%3Ccircle cx='980' cy='620' r='210' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E";
const MAX_UPLOAD_EDGE = 1600;
const MAX_UPLOAD_BYTES = 120 * 1024;
const IMAGE_QUALITIES = [0.82, 0.74, 0.66, 0.58, 0.5];

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(blob);
  });

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo procesar la imagen seleccionada'));
    };

    image.src = objectUrl;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo convertir la imagen'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality
    );
  });

const optimizeImageFile = async (file: File) => {
  const image = await loadImageElement(file);
  const dominantSide = Math.max(image.naturalWidth, image.naturalHeight, 1);
  const scale = Math.min(1, MAX_UPLOAD_EDGE / dominantSide);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No se pudo preparar la imagen para subirla');
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let bestBlob: Blob | null = null;

  for (const mimeType of ['image/webp', 'image/jpeg']) {
    for (const quality of IMAGE_QUALITIES) {
      const blob = await canvasToBlob(canvas, mimeType, quality);

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }

      if (blob.size <= MAX_UPLOAD_BYTES) {
        return readBlobAsDataUrl(blob);
      }
    }
  }

  return bestBlob ? readBlobAsDataUrl(bestBlob) : readBlobAsDataUrl(file);
};

const SectionHeading = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#15352a] text-[#f3f8ef] shadow-lg shadow-emerald-950/15">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-[#12231b]">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-[#587062]">{description}</p>
    </div>
  </div>
);

export function AdminHomeEditor() {
  const [content, setContent] = useState<HomeContent>(() => duplicateHomeContent());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ tone: 'idle', message: '' });

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);

      try {
        const response = await siteContentService.getHomeContent();
        setContent(duplicateHomeContent(mergeHomeContentWithDefaults(response)));
      } catch (error) {
        console.error('Error loading home content:', error);
        setContent(duplicateHomeContent());
        setSaveState({
          tone: 'error',
          message: 'No se pudo cargar el contenido guardado. Se mostraron valores base para seguir trabajando.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadContent();
  }, []);

  const updateContentField = (field: keyof HomeContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const updateGalleryItem = (index: number, field: keyof HomeGalleryItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateVideoItem = (index: number, field: keyof HomeVideoItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      videoItems: prev.videoItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateInfoItem = (index: number, field: keyof HomeInfoItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      infoItems: prev.infoItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleImageUpload = async (index: number, file?: File) => {
    if (!file) {
      return;
    }

    try {
      const image = await optimizeImageFile(file);
      updateGalleryItem(index, 'image', image);
      setSaveState({ tone: 'success', message: 'Imagen optimizada para web. Ya puedes guardar sin subir el peso del contenido.' });
    } catch (error) {
      console.error('Image upload error:', error);
      setSaveState({ tone: 'error', message: 'No se pudo leer la imagen seleccionada.' });
    }
  };

  const handleVideoThumbnailUpload = async (index: number, file?: File) => {
    if (!file) {
      return;
    }

    try {
      const image = await optimizeImageFile(file);
      updateVideoItem(index, 'thumbnail', image);
      setSaveState({ tone: 'success', message: 'Miniatura optimizada para web. Ya puedes guardarla en el inicio.' });
    } catch (error) {
      console.error('Video thumbnail upload error:', error);
      setSaveState({ tone: 'error', message: 'No se pudo leer la miniatura seleccionada.' });
    }
  };

  const addGalleryItem = () => {
    setContent((prev) => ({
      ...prev,
      galleryItems: [...prev.galleryItems, createEmptyGalleryItem(`gallery-${Date.now()}`, '#f97316')],
    }));
  };

  const addVideoItem = () => {
    setContent((prev) => ({
      ...prev,
      videoItems: [...prev.videoItems, createEmptyVideoItem(`video-${Date.now()}`, '#8b5cf6')],
    }));
  };

  const addInfoItem = () => {
    setContent((prev) => ({
      ...prev,
      infoItems: [...prev.infoItems, createEmptyInfoItem(`info-${Date.now()}`, '#06b6d4')],
    }));
  };

  const removeGalleryItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeVideoItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      videoItems: prev.videoItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removeInfoItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      infoItems: prev.infoItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleReset = () => {
    setContent(duplicateHomeContent());
    setSaveState({
      tone: 'success',
      message: 'Se restauraron los valores base del editor. Si te gustan, recuerda guardarlos.',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveState({ tone: 'idle', message: '' });

    try {
      const savedContent = await siteContentService.updateHomeContent(content);
      setContent(duplicateHomeContent(savedContent));
      setSaveState({
        tone: 'success',
        message: 'Inicio actualizado. La portada publica ya puede mostrar este nuevo contenido.',
      });
    } catch (error) {
      console.error('Save home content error:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setSaveState({
            tone: 'error',
            message: 'No se pudo conectar con el backend. Verifica que el servidor del API siga activo en el puerto 3001.',
          });
        } else if (error.response.status === 401 || error.response.status === 403) {
          setSaveState({
            tone: 'error',
            message: 'Tu sesion de administrador vencio o ya no es valida. Inicia sesion de nuevo e intenta guardar otra vez.',
          });
        } else if (typeof error.response.data?.message === 'string') {
          setSaveState({
            tone: 'error',
            message: error.response.data.message,
          });
        } else {
          setSaveState({
            tone: 'error',
            message: 'No se pudo guardar el contenido. Verifica la conexion y vuelve a intentarlo.',
          });
        }
      } else {
        setSaveState({
          tone: 'error',
          message: 'No se pudo guardar el contenido. Verifica la conexion y vuelve a intentarlo.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const previewGallery = content.galleryItems.filter((item) => item.image.trim() !== '');
  const previewVideos = content.videoItems.filter(
    (item) => item.videoUrl.trim() !== '' || item.thumbnail.trim() !== ''
  );
  const previewSlidesSource = previewGallery.length > 0 ? previewGallery.slice(0, 4) : content.galleryItems.slice(0, 3);
  const previewSlides = previewSlidesSource.map((item, index) => ({
    title: item.title || `Bloque visual ${index + 1}`,
    subtitle: item.subtitle || 'Texto superpuesto para la portada',
    description: item.description || 'La portada del admin ahora replica el tono visual del home publico.',
    location: item.location || 'Wayra Trail',
    badge: item.badge || 'Inicio visual',
    image: item.image || FALLBACK_PREVIEW_IMAGE,
  }));
  const previewStats = content.infoItems.slice(0, 3);
  const previewGalleryCardsSource = previewGallery.length > 0 ? previewGallery : content.galleryItems;
  const previewGalleryCards = previewGalleryCardsSource.slice(0, 3);
  const previewVideoCards = previewVideos.slice(0, 2);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-[#d7e6db] bg-white p-10 shadow-[0_30px_80px_-55px_rgba(21,53,42,0.55)]">
        <div className="flex items-center gap-3 text-[#15352a]">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#15352a]/25 border-t-[#15352a]" />
          <div>
            <p className="font-semibold">Cargando editor de inicio</p>
            <p className="text-sm text-[#587062]">Preparando imagenes, textos y videos guardados.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#d6e7dc] bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.18),_transparent_32%),linear-gradient(135deg,#163126_0%,#0f241d_55%,#17372f_100%)] p-6 text-white shadow-[0_35px_80px_-45px_rgba(15,36,29,0.95)] lg:p-8">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Badge className="border-0 bg-white/14 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white">
              Inicio del admin
            </Badge>
            <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight lg:text-5xl">
              Crea una portada que se sienta viva desde el primer vistazo.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 lg:text-base">
              Aqui puedes armar la historia inicial del evento con fotos, textos superpuestos, videos y bloques de informacion.
              Todo esta pensado para que el admin edite rapido y vea el resultado con una presencia mas cinematografica.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Galeria activa', value: `${content.galleryItems.length} bloques` },
              { label: 'Videos listos', value: `${content.videoItems.length} piezas` },
              { label: 'Mensajes clave', value: `${content.infoItems.length} tarjetas` },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 space-y-6 2xl:order-1">
          <Card className="overflow-hidden border-[#d6e5da] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
            <CardHeader className="border-b border-[#edf3ee] bg-[#f9fbf7]">
              <SectionHeading
                icon={Sparkles}
                title="Narrativa principal"
                description="Edita los textos grandes que abren el home: badge, titulo, subtitulo y llamada a la accion."
              />
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#183127]">Badge superior</label>
                <Input value={content.heroBadge} onChange={(event) => updateContentField('heroBadge', event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#183127]">Palabra destacada</label>
                <Input
                  value={content.heroHighlight}
                  onChange={(event) => updateContentField('heroHighlight', event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Titulo principal</label>
                <Input value={content.heroTitle} onChange={(event) => updateContentField('heroTitle', event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Subtitulo</label>
                <Input
                  value={content.heroSubtitle}
                  onChange={(event) => updateContentField('heroSubtitle', event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Descripcion</label>
                <Textarea
                  value={content.heroDescription}
                  onChange={(event) => updateContentField('heroDescription', event.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#183127]">Boton principal</label>
                <Input
                  value={content.primaryCtaText}
                  onChange={(event) => updateContentField('primaryCtaText', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#183127]">Boton secundario</label>
                <Input
                  value={content.secondaryCtaText}
                  onChange={(event) => updateContentField('secondaryCtaText', event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Etiqueta de spotlight</label>
                <Input
                  value={content.spotlightLabel}
                  onChange={(event) => updateContentField('spotlightLabel', event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Titulo del spotlight</label>
                <Input
                  value={content.spotlightTitle}
                  onChange={(event) => updateContentField('spotlightTitle', event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#183127]">Descripcion del spotlight</label>
                <Textarea
                  value={content.spotlightDescription}
                  onChange={(event) => updateContentField('spotlightDescription', event.target.value)}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#d6e5da] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
            <CardHeader className="border-b border-[#edf3ee] bg-[#f9fbf7]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionHeading
                  icon={Image}
                  title="Bloques fotograficos con texto"
                  description="Cada tarjeta acepta imagen por carga directa o por URL, y los textos se muestran encima de la foto."
                />
                <Button type="button" onClick={addGalleryItem} className="bg-[#15352a] hover:bg-[#0f241d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar foto
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {content.galleryItems.map((item, index) => (
                <div key={item.id} className="rounded-[1.75rem] border border-[#e4ede6] bg-[#fbfcfa] p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587062]">Foto {index + 1}</p>
                      <p className="text-sm text-[#7b8f83]">Carga una imagen o pega un enlace para esta historia.</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeGalleryItem(index)}
                      disabled={content.galleryItems.length === 1}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Quitar
                    </Button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-[1.5rem] border border-[#dfe8e2] bg-[#dde8df]">
                        {item.image ? (
                          <div className="relative h-56 w-full overflow-hidden bg-[#163323]">
                            <img
                              src={item.image}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                            />
                            <img
                              src={item.image}
                              alt={item.title || `Foto ${index + 1}`}
                              className="relative z-10 h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-56 items-center justify-center bg-[linear-gradient(135deg,#d9efe1_0%,#f7e9bf_100%)] text-center text-sm text-[#476255]">
                            Sube una imagen para este bloque
                          </div>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#b9ccbe] bg-white px-4 py-3 text-sm font-medium text-[#15352a] transition hover:border-[#15352a]">
                          <Upload className="h-4 w-4" />
                          Cargar imagen
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => void handleImageUpload(index, event.target.files?.[0])}
                          />
                        </label>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Color acento</label>
                          <Input
                            value={item.accentColor}
                            onChange={(event) => updateGalleryItem(index, 'accentColor', event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">URL de la imagen</label>
                        <Input value={item.image} onChange={(event) => updateGalleryItem(index, 'image', event.target.value)} />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Badge</label>
                        <Input value={item.badge} onChange={(event) => updateGalleryItem(index, 'badge', event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Titulo sobre la foto</label>
                        <Input value={item.title} onChange={(event) => updateGalleryItem(index, 'title', event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Subtitulo</label>
                        <Input
                          value={item.subtitle}
                          onChange={(event) => updateGalleryItem(index, 'subtitle', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Ubicacion o contexto</label>
                        <Input
                          value={item.location}
                          onChange={(event) => updateGalleryItem(index, 'location', event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Descripcion</label>
                        <Textarea
                          value={item.description}
                          onChange={(event) => updateGalleryItem(index, 'description', event.target.value)}
                          className="min-h-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#d6e5da] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
            <CardHeader className="border-b border-[#edf3ee] bg-[#f9fbf7]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionHeading
                  icon={Video}
                  title="Videos destacados"
                  description="Anade videos mediante enlace y una miniatura para que el home tenga piezas en movimiento."
                />
                <Button type="button" onClick={addVideoItem} className="bg-[#15352a] hover:bg-[#0f241d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar video
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {content.videoItems.map((item, index) => (
                <div key={item.id} className="rounded-[1.75rem] border border-[#e4ede6] bg-[#fbfcfa] p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587062]">Video {index + 1}</p>
                      <p className="text-sm text-[#7b8f83]">Funciona bien con enlaces de YouTube, Vimeo o archivos MP4.</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeVideoItem(index)}
                      disabled={content.videoItems.length === 1}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Quitar
                    </Button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-[1.5rem] border border-[#dfe8e2] bg-[#dde8df]">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title || `Video ${index + 1}`} className="h-56 w-full object-cover" />
                        ) : (
                          <div className="flex h-56 items-center justify-center bg-[linear-gradient(135deg,#dbe7ff_0%,#efe5ff_100%)] text-center text-sm text-[#4f5e7c]">
                            Carga una miniatura para este video
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#b9ccbe] bg-white px-4 py-3 text-sm font-medium text-[#15352a] transition hover:border-[#15352a]">
                          <Upload className="h-4 w-4" />
                          Cargar miniatura
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => void handleVideoThumbnailUpload(index, event.target.files?.[0])}
                          />
                        </label>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Color acento</label>
                          <Input
                            value={item.accentColor}
                            onChange={(event) => updateVideoItem(index, 'accentColor', event.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Etiqueta</label>
                        <Input value={item.tag} onChange={(event) => updateVideoItem(index, 'tag', event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Titulo</label>
                        <Input value={item.title} onChange={(event) => updateVideoItem(index, 'title', event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Descripcion</label>
                        <Textarea
                          value={item.description}
                          onChange={(event) => updateVideoItem(index, 'description', event.target.value)}
                          className="min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">URL del video</label>
                        <Input value={item.videoUrl} onChange={(event) => updateVideoItem(index, 'videoUrl', event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">URL de miniatura</label>
                        <Input
                          value={item.thumbnail}
                          onChange={(event) => updateVideoItem(index, 'thumbnail', event.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#d6e5da] bg-white shadow-[0_25px_80px_-60px_rgba(17,51,40,0.5)]">
            <CardHeader className="border-b border-[#edf3ee] bg-[#f9fbf7]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionHeading
                  icon={Sparkles}
                  title="Tarjetas de informacion"
                  description="Crea bloques breves con cifras o mensajes para reforzar la propuesta del inicio."
                />
                <Button type="button" onClick={addInfoItem} className="bg-[#15352a] hover:bg-[#0f241d]">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar tarjeta
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {content.infoItems.map((item, index) => (
                <div key={item.id} className="rounded-[1.5rem] border border-[#e4ede6] bg-[#fbfcfa] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#587062]">Tarjeta {index + 1}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeInfoItem(index)}
                      disabled={content.infoItems.length === 1}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Quitar
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[0.34fr_0.66fr]">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Valor</label>
                      <Input value={item.value} onChange={(event) => updateInfoItem(index, 'value', event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Titulo</label>
                      <Input value={item.title} onChange={(event) => updateInfoItem(index, 'title', event.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Descripcion</label>
                      <Textarea
                        value={item.description}
                        onChange={(event) => updateInfoItem(index, 'description', event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#587062]">Color acento</label>
                      <Input
                        value={item.accentColor}
                        onChange={(event) => updateInfoItem(index, 'accentColor', event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="order-1 space-y-6 2xl:order-2">
          <Card className="overflow-hidden border-[#d6e5da] bg-white shadow-[0_30px_90px_-55px_rgba(18,49,39,0.6)] 2xl:sticky 2xl:top-6">
            <CardHeader className="border-b border-[#edf3ee] bg-[#f9fbf7]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-[#12231b]">
                    <Eye className="h-5 w-5 text-[#15352a]" />
                    Vista previa de inicio
                  </CardTitle>
                  <CardDescription className="mt-1 text-[#587062]">
                    Asi se percibe el contenido mientras editas. El home publico tomara este mismo tono visual.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Restaurar base
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-[#15352a] hover:bg-[#0f241d]">
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Guardando...' : 'Guardar inicio'}
                  </Button>
                </div>
              </div>
              {saveState.message ? (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                    saveState.tone === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {saveState.message}
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="overflow-hidden rounded-[2rem] border border-[#dce8df] bg-[#f1f8e9] shadow-[0_30px_80px_-55px_rgba(21,53,42,0.3)]">
                <div className="border-b border-green-100 bg-white/90 px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-green-50 p-2.5 shadow-sm">
                        <img src="/chimuelo.png" alt="WAYRA TRAIL" className="h-10 w-auto" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-800">WAYRA TRAIL</p>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-600">Ruta de Guerreros Ancestrales 16K</p>
                      </div>
                    </div>
                    <div className="hidden flex-wrap items-center gap-2 lg:flex">
                      {navigationItems.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hero-pattern px-5 py-6 lg:px-6 lg:py-8">
                  <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="animate-fade-in">
                      <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                        <Mountain className="h-4 w-4" />
                        <span>{content.heroBadge}</span>
                      </div>
                      <h2 className="mt-5 text-4xl font-black leading-tight text-gray-900">
                        {content.heroTitle}{' '}
                        <span className="wayra-gradient-text">{content.heroHighlight}</span>
                      </h2>
                      <p className="mt-4 text-xl font-bold text-green-700">{content.heroSubtitle}</p>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 lg:text-base">{content.heroDescription}</p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {['Sibundoy', 'Putumayo', 'Colombia'].map((location) => (
                          <span
                            key={location}
                            className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-green-800 shadow-sm"
                          >
                            {location}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <button className="wayra-button flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          {content.primaryCtaText}
                        </button>
                        <button className="wayra-button-outline flex items-center justify-center gap-2">
                          {content.secondaryCtaText}
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="animate-fade-in">
                      <HeroCarousel slides={previewSlides} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 border-t border-green-100 bg-[linear-gradient(180deg,#fcfdf9_0%,#f2f7f1_100%)] px-5 py-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-6">
                  <div className="wayra-gradient rounded-[2rem] p-6 text-white shadow-[0_25px_75px_-45px_rgba(21,53,42,0.9)]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                      <Flag className="h-4 w-4" />
                      {content.spotlightLabel}
                    </div>
                    <h3 className="mt-5 text-3xl font-black leading-tight">{content.spotlightTitle}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/78 lg:text-base">{content.spotlightDescription}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {previewStats.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[1.35rem] border border-white/10 p-4 backdrop-blur-sm"
                          style={{ background: `linear-gradient(180deg, ${item.accentColor}2E 0%, rgba(255,255,255,0.09) 100%)` }}
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-white/55">{item.title || 'Dato clave'}</p>
                          <p className="mt-3 text-3xl font-black text-white">{item.value || '--'}</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/74">{item.description || 'Refuerza aqui el mensaje principal.'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {previewGalleryCards.map((item, index) => (
                      <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-xl ${
                          index === 0 ? 'md:col-span-2 min-h-[360px]' : 'min-h-[280px]'
                        }`}
                      >
                        <img
                          src={item.image || FALLBACK_PREVIEW_IMAGE}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                        />
                        <img
                          src={item.image || FALLBACK_PREVIEW_IMAGE}
                          alt={item.title || `Bloque ${index + 1}`}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.12)_0%,rgba(6,16,10,0.78)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <div
                            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                            style={{ backgroundColor: `${item.accentColor}D0` }}
                          >
                            {item.badge || `Bloque ${index + 1}`}
                          </div>
                          <h4 className="mt-4 text-2xl font-black leading-tight">{item.title || 'Titulo de la historia'}</h4>
                          <p className="mt-2 text-sm font-semibold text-green-100">{item.subtitle || 'Subtitulo sobre la foto'}</p>
                          <p className="mt-3 text-sm leading-relaxed text-white/78">
                            {item.description || 'Tu descripcion aparecera aqui para complementar la historia visual.'}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location || 'Ubicacion'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#12231b]">
                  <Video className="h-5 w-5 text-[#15352a]" />
                  <h3 className="text-lg font-semibold">Vista de videos destacados</h3>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {previewVideoCards.map((item) => {
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
                          ) : item.thumbnail ? (
                            <>
                              <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,13,0.15)_0%,rgba(8,17,13,0.75)_100%)]" />
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-white/70">Agrega un enlace de video</div>
                          )}
                        </div>
                        <div className="p-5">
                          <div
                            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                            style={{ backgroundColor: item.accentColor }}
                          >
                            {item.tag || 'Video destacado'}
                          </div>
                          <h4 className="mt-4 text-2xl font-black text-gray-900">{item.title || 'Titulo del video'}</h4>
                          <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {item.description || 'La descripcion del video aparecera aqui cuando la edites.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {previewVideos.length === 0 ? (
                    <div className="rounded-[1.75rem] border border-dashed border-[#b9ccbe] bg-[#f8fbf8] p-6 text-sm text-[#587062] xl:col-span-2">
                      Todavia no hay videos configurados. En cuanto pegues un enlace o una miniatura, apareceran aqui con el mismo lenguaje visual de la pagina.
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
