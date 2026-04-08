const DEFAULT_ACCENT_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6'];

const createDefaultGalleryItem = (id, accentColor) => ({
  id,
  badge: '',
  title: '',
  subtitle: '',
  description: '',
  location: '',
  accentColor,
  image: '',
});

const createDefaultVideoItem = (id, accentColor) => ({
  id,
  tag: '',
  title: '',
  description: '',
  videoUrl: '',
  thumbnail: '',
  accentColor,
});

const createDefaultInfoItem = (id, accentColor) => ({
  id,
  value: '',
  title: '',
  description: '',
  accentColor,
});

const defaultHomeContent = {
  heroBadge: '',
  heroTitle: '',
  heroHighlight: '',
  heroSubtitle: '',
  heroDescription: '',
  primaryCtaText: '',
  secondaryCtaText: '',
  spotlightLabel: '',
  spotlightTitle: '',
  spotlightDescription: '',
  galleryItems: [
    createDefaultGalleryItem('gallery-1', DEFAULT_ACCENT_COLORS[0]),
    createDefaultGalleryItem('gallery-2', DEFAULT_ACCENT_COLORS[2]),
    createDefaultGalleryItem('gallery-3', DEFAULT_ACCENT_COLORS[3]),
  ],
  videoItems: [
    createDefaultVideoItem('video-1', DEFAULT_ACCENT_COLORS[1]),
    createDefaultVideoItem('video-2', DEFAULT_ACCENT_COLORS[4]),
  ],
  infoItems: [
    createDefaultInfoItem('info-1', DEFAULT_ACCENT_COLORS[0]),
    createDefaultInfoItem('info-2', DEFAULT_ACCENT_COLORS[2]),
    createDefaultInfoItem('info-3', DEFAULT_ACCENT_COLORS[3]),
  ],
};

const cleanText = (value, fallback = '') =>
  typeof value === 'string' ? value.trim().slice(0, 3000) : fallback;

const normalizeAccentColor = (value, fallback) =>
  /^#[0-9a-fA-F]{6}$/.test(String(value || '').trim()) ? String(value).trim() : fallback;

const normalizeGalleryItems = (items) => {
  const source = Array.isArray(items) && items.length > 0 ? items.slice(0, 8) : defaultHomeContent.galleryItems;

  return source.map((item, index) => ({
    id: cleanText(item?.id, `gallery-${index + 1}`),
    badge: cleanText(item?.badge),
    title: cleanText(item?.title),
    subtitle: cleanText(item?.subtitle),
    description: cleanText(item?.description),
    location: cleanText(item?.location),
    accentColor: normalizeAccentColor(item?.accentColor, DEFAULT_ACCENT_COLORS[index % DEFAULT_ACCENT_COLORS.length]),
    image: typeof item?.image === 'string' ? item.image : '',
  }));
};

const normalizeVideoItems = (items) => {
  const source = Array.isArray(items) && items.length > 0 ? items.slice(0, 8) : defaultHomeContent.videoItems;

  return source.map((item, index) => ({
    id: cleanText(item?.id, `video-${index + 1}`),
    tag: cleanText(item?.tag),
    title: cleanText(item?.title),
    description: cleanText(item?.description),
    videoUrl: cleanText(item?.videoUrl, ''),
    thumbnail: typeof item?.thumbnail === 'string' ? item.thumbnail : '',
    accentColor: normalizeAccentColor(item?.accentColor, DEFAULT_ACCENT_COLORS[(index + 1) % DEFAULT_ACCENT_COLORS.length]),
  }));
};

const normalizeInfoItems = (items) => {
  const source = Array.isArray(items) && items.length > 0 ? items.slice(0, 6) : defaultHomeContent.infoItems;

  return source.map((item, index) => ({
    id: cleanText(item?.id, `info-${index + 1}`),
    value: cleanText(item?.value, ''),
    title: cleanText(item?.title),
    description: cleanText(item?.description),
    accentColor: normalizeAccentColor(item?.accentColor, DEFAULT_ACCENT_COLORS[(index + 2) % DEFAULT_ACCENT_COLORS.length]),
  }));
};

const normalizeHomeContent = (content) => ({
  heroBadge: cleanText(content?.heroBadge, defaultHomeContent.heroBadge),
  heroTitle: cleanText(content?.heroTitle, defaultHomeContent.heroTitle),
  heroHighlight: cleanText(content?.heroHighlight, defaultHomeContent.heroHighlight),
  heroSubtitle: cleanText(content?.heroSubtitle, defaultHomeContent.heroSubtitle),
  heroDescription: cleanText(content?.heroDescription, defaultHomeContent.heroDescription),
  primaryCtaText: cleanText(content?.primaryCtaText, defaultHomeContent.primaryCtaText),
  secondaryCtaText: cleanText(content?.secondaryCtaText, defaultHomeContent.secondaryCtaText),
  spotlightLabel: cleanText(content?.spotlightLabel, defaultHomeContent.spotlightLabel),
  spotlightTitle: cleanText(content?.spotlightTitle, defaultHomeContent.spotlightTitle),
  spotlightDescription: cleanText(content?.spotlightDescription, defaultHomeContent.spotlightDescription),
  galleryItems: normalizeGalleryItems(content?.galleryItems),
  videoItems: normalizeVideoItems(content?.videoItems),
  infoItems: normalizeInfoItems(content?.infoItems),
});

module.exports = {
  defaultHomeContent,
  normalizeHomeContent,
};
