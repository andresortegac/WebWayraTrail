const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeHomeContent } = require('./siteContentDefaults');

const galleryItem = (index) => ({
  id: `gallery-${index}`,
  badge: `Slide ${index}`,
  title: `Titulo ${index}`,
  subtitle: '',
  description: '',
  location: '',
  accentColor: '#f97316',
  image: `data:image/webp;base64,image-${index}`,
});

test('conserva la imagen de un noveno slide nuevo', () => {
  const galleryItems = Array.from({ length: 9 }, (_, index) => galleryItem(index + 1));
  const normalized = normalizeHomeContent({ galleryItems });

  assert.equal(normalized.galleryItems.length, 9);
  assert.equal(normalized.galleryItems[8].image, 'data:image/webp;base64,image-9');
});

test('limita el carrusel a veinte slides', () => {
  const galleryItems = Array.from({ length: 21 }, (_, index) => galleryItem(index + 1));
  const normalized = normalizeHomeContent({ galleryItems });

  assert.equal(normalized.galleryItems.length, 20);
  assert.equal(normalized.galleryItems[19].image, 'data:image/webp;base64,image-20');
});
