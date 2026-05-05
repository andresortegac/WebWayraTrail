export interface Inscription {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  eps: string;
  fecha_nacimiento: string;
  edad: number;
  genero: 'M' | 'F';
  categoria: string;
  color_categoria: string;
  talla_camiseta: string;
  contacto_emergencia: string;
  telefono_emergencia: string;
  fecha_inscripcion: string;
}

export interface InscriptionFormData {
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  eps: string;
  fecha_nacimiento: string;
  genero: 'M' | 'F';
  talla_camiseta: string;
  contacto_emergencia: string;
  telefono_emergencia: string;
  es_recreativa: boolean;
}

export interface CategoryInfo {
  categoria: string;
  color_categoria: string;
  total: number;
  hombres: number;
  mujeres: number;
}

export interface Stats {
  total: number;
  hombres: number;
  mujeres: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CategoryDefinition {
  name: string;
  color: string;
  bgClass: string;
  textClass: string;
  description: string;
  ageRange: string;
}

export interface HomeGalleryItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  accentColor: string;
  image: string;
}

export interface HomeVideoItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  accentColor: string;
}

export interface HomeInfoItem {
  id: string;
  value: string;
  title: string;
  description: string;
  accentColor: string;
}

export interface HomeContent {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  spotlightLabel: string;
  spotlightTitle: string;
  spotlightDescription: string;
  galleryItems: HomeGalleryItem[];
  videoItems: HomeVideoItem[];
  infoItems: HomeInfoItem[];
}
