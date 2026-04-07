import type { HomeContent, HomeGalleryItem, HomeInfoItem, HomeVideoItem } from '@/types';

const sampleHeroImage = new URL('../../img/hero-bg.jpg', import.meta.url).href;
const sampleSunsetImage = new URL('../../img/sibundoy-atardecer-web.jpg', import.meta.url).href;
const sampleCultureImage = new URL('../../img/sibundoy-parque-madera-web.jpg', import.meta.url).href;
const sampleWaterImage = new URL('../../img/sibundoy-lago.jpg', import.meta.url).href;

const ACCENT_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6'];

export const createEmptyGalleryItem = (id: string, accentColor = ACCENT_COLORS[0]): HomeGalleryItem => ({
  id,
  badge: '',
  title: '',
  subtitle: '',
  description: '',
  location: '',
  accentColor,
  image: '',
});

export const createEmptyVideoItem = (id: string, accentColor = ACCENT_COLORS[1]): HomeVideoItem => ({
  id,
  tag: '',
  title: '',
  description: '',
  videoUrl: '',
  thumbnail: '',
  accentColor,
});

export const createEmptyInfoItem = (id: string, accentColor = ACCENT_COLORS[2]): HomeInfoItem => ({
  id,
  value: '',
  title: '',
  description: '',
  accentColor,
});

export const defaultHomeContent: HomeContent = {
  heroBadge: 'Territorio vivo',
  heroTitle: 'Disena un inicio que haga latir',
  heroHighlight: 'WAYRA TRAIL',
  heroSubtitle: 'Fotos con texto, videos y mensajes que convierten interes en inscripciones',
  heroDescription:
    'Haz que la portada cuente una historia completa: paisaje, identidad, energia del evento y razones para sumarse desde el primer scroll.',
  primaryCtaText: 'Guardar inicio',
  secondaryCtaText: 'Ver resultado',
  spotlightLabel: 'Inicio editable',
  spotlightTitle: 'Un arranque visual para vender la experiencia, no solo anunciarla',
  spotlightDescription:
    'Combina imagen, narrativa y video para que el sitio abra con una sensacion cinematografica, clara y memorable tanto para corredores como para patrocinadores.',
  galleryItems: [
    {
      id: 'gallery-1',
      badge: 'Hero principal',
      title: 'Senderos que abren la jornada',
      subtitle: 'Texto potente directamente sobre la foto',
      description:
        'Usa esta pieza para presentar el espiritu del evento, activar el deseo de participar y reforzar la identidad del territorio.',
      location: 'Sibundoy, Putumayo',
      accentColor: ACCENT_COLORS[0],
      image: sampleHeroImage,
    },
    {
      id: 'gallery-2',
      badge: 'Paisaje de apoyo',
      title: 'Color, altura y emocion',
      subtitle: 'Una segunda historia para el recorrido',
      description:
        'Ideal para mostrar una parte del trayecto, un patrocinador principal o una promesa emocional del evento.',
      location: 'Valle de Sibundoy',
      accentColor: ACCENT_COLORS[2],
      image: sampleSunsetImage,
    },
    {
      id: 'gallery-3',
      badge: 'Cultura y comunidad',
      title: 'La carrera tambien cuenta territorio',
      subtitle: 'Identidad visual con peso propio',
      description:
        'Sirve para vincular cultura local, comunidad, organizadores o mensajes institucionales en un formato atractivo.',
      location: 'Memoria ancestral',
      accentColor: ACCENT_COLORS[3],
      image: sampleCultureImage,
    },
  ],
  videoItems: [
    {
      id: 'video-1',
      tag: 'Video teaser',
      title: 'Presenta la experiencia en movimiento',
      description:
        'Pega aqui un enlace de YouTube, Vimeo o un MP4 para destacar el teaser oficial, un reel o una invitacion del director.',
      videoUrl: '',
      thumbnail: sampleWaterImage,
      accentColor: ACCENT_COLORS[1],
    },
    {
      id: 'video-2',
      tag: 'Mensaje especial',
      title: 'Activa aliados y comunidad',
      description:
        'Usa este bloque para testimonios, videos de aliados, mapas de ruta o piezas de expectativa antes del evento.',
      videoUrl: '',
      thumbnail: sampleSunsetImage,
      accentColor: ACCENT_COLORS[4],
    },
  ],
  infoItems: [
    {
      id: 'info-1',
      value: '16K',
      title: 'Recorrido insignia',
      description: 'Destaca la distancia, el desnivel o una caracteristica deportiva que llame la atencion.',
      accentColor: ACCENT_COLORS[0],
    },
    {
      id: 'info-2',
      value: '5',
      title: 'Categorias activas',
      description: 'Resume rapidamente el formato competitivo, ramas o beneficios que el corredor entendera al instante.',
      accentColor: ACCENT_COLORS[2],
    },
    {
      id: 'info-3',
      value: '100%',
      title: 'Identidad local',
      description: 'Usa este bloque para resaltar cultura, apoyo institucional o el valor diferencial del territorio.',
      accentColor: ACCENT_COLORS[3],
    },
  ],
};

const cloneContent = (content: HomeContent): HomeContent =>
  JSON.parse(JSON.stringify(content)) as HomeContent;

const normalizeGalleryItems = (items?: HomeGalleryItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return defaultHomeContent.galleryItems.map((item) => ({ ...item }));
  }

  return items.map((item, index) => ({
    ...createEmptyGalleryItem(item.id || `gallery-${index + 1}`, item.accentColor || ACCENT_COLORS[index % ACCENT_COLORS.length]),
    ...item,
  }));
};

const normalizeVideoItems = (items?: HomeVideoItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return defaultHomeContent.videoItems.map((item) => ({ ...item }));
  }

  return items.map((item, index) => ({
    ...createEmptyVideoItem(item.id || `video-${index + 1}`, item.accentColor || ACCENT_COLORS[(index + 1) % ACCENT_COLORS.length]),
    ...item,
  }));
};

const normalizeInfoItems = (items?: HomeInfoItem[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return defaultHomeContent.infoItems.map((item) => ({ ...item }));
  }

  return items.map((item, index) => ({
    ...createEmptyInfoItem(item.id || `info-${index + 1}`, item.accentColor || ACCENT_COLORS[(index + 2) % ACCENT_COLORS.length]),
    ...item,
  }));
};

const hasConfiguredContent = (content?: Partial<HomeContent> | null) => {
  if (!content) {
    return false;
  }

  const textFields = [
    content.heroBadge,
    content.heroTitle,
    content.heroHighlight,
    content.heroSubtitle,
    content.heroDescription,
    content.spotlightLabel,
    content.spotlightTitle,
    content.spotlightDescription,
  ];

  if (textFields.some((field) => typeof field === 'string' && field.trim() !== '')) {
    return true;
  }

  const galleryHasData = content.galleryItems?.some((item) =>
    [item.image, item.title, item.subtitle, item.description, item.location].some(
      (value) => typeof value === 'string' && value.trim() !== ''
    )
  );

  const videosHaveData = content.videoItems?.some((item) =>
    [item.videoUrl, item.thumbnail, item.title, item.description].some(
      (value) => typeof value === 'string' && value.trim() !== ''
    )
  );

  const infoHasData = content.infoItems?.some((item) =>
    [item.value, item.title, item.description].some(
      (value) => typeof value === 'string' && value.trim() !== ''
    )
  );

  return Boolean(galleryHasData || videosHaveData || infoHasData);
};

export const mergeHomeContentWithDefaults = (content?: Partial<HomeContent> | null): HomeContent => {
  if (!hasConfiguredContent(content)) {
    return cloneContent(defaultHomeContent);
  }

  return {
    heroBadge: content?.heroBadge || defaultHomeContent.heroBadge,
    heroTitle: content?.heroTitle || defaultHomeContent.heroTitle,
    heroHighlight: content?.heroHighlight || defaultHomeContent.heroHighlight,
    heroSubtitle: content?.heroSubtitle || defaultHomeContent.heroSubtitle,
    heroDescription: content?.heroDescription || defaultHomeContent.heroDescription,
    primaryCtaText: content?.primaryCtaText || defaultHomeContent.primaryCtaText,
    secondaryCtaText: content?.secondaryCtaText || defaultHomeContent.secondaryCtaText,
    spotlightLabel: content?.spotlightLabel || defaultHomeContent.spotlightLabel,
    spotlightTitle: content?.spotlightTitle || defaultHomeContent.spotlightTitle,
    spotlightDescription: content?.spotlightDescription || defaultHomeContent.spotlightDescription,
    galleryItems: normalizeGalleryItems(content?.galleryItems),
    videoItems: normalizeVideoItems(content?.videoItems),
    infoItems: normalizeInfoItems(content?.infoItems),
  };
};

export const duplicateHomeContent = (content?: Partial<HomeContent> | null): HomeContent =>
  cloneContent(mergeHomeContentWithDefaults(content));

export const getVideoEmbedUrl = (url: string) => {
  const value = url.trim();

  if (!value) {
    return '';
  }

  const youtubeMatch =
    value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i) ||
    value.match(/youtube\.com\/embed\/([\w-]+)/i);

  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch =
    value.match(/vimeo\.com\/(\d+)/i) ||
    value.match(/player\.vimeo\.com\/video\/(\d+)/i);

  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return '';
};

export const isDirectVideoFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url.trim());
