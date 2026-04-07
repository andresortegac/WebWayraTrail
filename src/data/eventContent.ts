import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Droplets,
  FileText,
  Package,
  Shield,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export type HighlightCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type InfoCard = {
  title: string;
  items: string[];
  icon: LucideIcon;
};

export type TimelineSection = {
  day: string;
  title: string;
  description: string;
  alert: string;
  items: Array<{
    time: string;
    label: string;
  }>;
};

export type RegulationSection = {
  title: string;
  summary: string;
  items: string[];
};

export type HeroSlide = {
  title: string;
  subtitle: string;
  description: string;
  location: string;
  badge: string;
  image: string;
};

export const categories = [
  {
    name: 'Recreativa',
    color: '#EF4444',
    description: 'Solo para personas que no hayan practicado trail running ni carreras atleticas.',
    ageRange: 'Sin limite de edad',
  },
  {
    name: 'Libre',
    color: '#FCD34D',
    description: 'Categoria oficial para participantes entre 18 y 39 anos.',
    ageRange: '18 - 39 anos',
  },
  {
    name: 'A',
    color: '#10B981',
    description: 'Categoria oficial para participantes entre 40 y 49 anos.',
    ageRange: '40 - 49 anos',
  },
  {
    name: 'B',
    color: '#3B82F6',
    description: 'Categoria oficial para participantes entre 50 y 59 anos.',
    ageRange: '50 - 59 anos',
  },
  {
    name: 'C',
    color: '#8B5CF6',
    description: 'Categoria oficial para participantes de 60 anos en adelante.',
    ageRange: '60 anos en adelante',
  },
];

export const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const navigationItems = [
  { id: 'reglamento', label: 'Reglamento' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'compromisos', label: 'Claves' },
  { id: 'patrocinios', label: 'Patrocinios' },
  { id: 'inscripcion', label: 'Inscripcion' },
];

export const heroSlides: HeroSlide[] = [
  {
    title: 'Ruta entre montanas',
    subtitle: 'Senderos que abren la experiencia',
    description: 'La portada ahora respira paisaje real y prepara visualmente para una carrera de montana con identidad propia.',
    location: 'Sibundoy, Putumayo',
    badge: 'Wayra Trail',
    image: new URL('../../img/hero-bg.jpg', import.meta.url).href,
  },
  {
    title: 'Atardecer del valle',
    subtitle: 'Color, altura y profundidad',
    description: 'Un cierre de luz que le da al slider un tono elegante, natural y mucho mas conectado con el territorio.',
    location: 'Valle de Sibundoy',
    badge: 'Paisaje local',
    image: new URL('../../img/sibundoy-atardecer-web.jpg', import.meta.url).href,
  },
  {
    title: 'Memoria viva en el parque',
    subtitle: 'Cultura ancestral en primer plano',
    description: 'La presencia de arte local ayuda a que la portada no sea solo deportiva, sino tambien cultural y reconocible.',
    location: 'Parque de Sibundoy',
    badge: 'Identidad ancestral',
    image: new URL('../../img/sibundoy-parque-madera-web.jpg', import.meta.url).href,
  },
  {
    title: 'Verde profundo y agua',
    subtitle: 'Calma antes del desafio',
    description: 'Una escena serena para equilibrar el hero con una fotografia fresca, abierta y muy propia del entorno putumayense.',
    location: 'Sibundoy rural',
    badge: 'Naturaleza viva',
    image: new URL('../../img/sibundoy-lago.jpg', import.meta.url).href,
  },
];

export const officialHighlights: HighlightCard[] = [
  {
    title: 'Aceptacion obligatoria',
    description: 'La inscripcion confirma que leiste, comprendiste y aceptaste el reglamento oficial.',
    icon: FileText,
  },
  {
    title: 'Kit oficial',
    description: 'La entrega sera unicamente el 10 de octubre. El 11 de octubre no habra entrega de kits.',
    icon: Package,
  },
  {
    title: 'Dia de carrera',
    description: 'Concentracion 6:30 a. m., salida 8:00 a. m., premiacion 1:00 p. m. y cierre 2:00 p. m.',
    icon: CalendarDays,
  },
  {
    title: 'Seguridad en ruta',
    description: 'Cada atleta compite bajo su responsabilidad y debe seguir todas las indicaciones del staff.',
    icon: Shield,
  },
];

export const quickFacts = [
  '10 oct: entrega de kits',
  '11 oct: carrera oficial',
  '5 categorias por rama',
  'Cantimplora personal para hidratacion',
  'Premiacion al cierre oficial',
];

export const timelineSections: TimelineSection[] = [
  {
    day: '10 de octubre',
    title: 'Entrega oficial de kits',
    description:
      'Todos los participantes deben presentarse dentro de los horarios oficiales o autorizar a un companero de confianza.',
    alert: 'El 11 de octubre no se realizara entrega de kits.',
    items: [
      { time: '8:00 a. m. - 12:00 m.', label: 'Primera franja de entrega' },
      { time: '12:00 m. - 6:00 p. m.', label: 'Segunda franja de entrega' },
      { time: '6:00 p. m. - 10:00 p. m.', label: 'Ultima franja de entrega' },
    ],
  },
  {
    day: '11 de octubre',
    title: 'Programacion oficial del evento',
    description:
      'Todos los atletas deben asistir a la concentracion para recibir orientaciones tecnicas y de seguridad.',
    alert: 'La premiacion se realiza solo en el horario definido por la organizacion.',
    items: [
      { time: '6:30 a. m.', label: 'Concentracion de participantes' },
      { time: '6:30 a. m. - 7:45 a. m.', label: 'Calentamiento e informacion tecnica' },
      { time: '8:00 a. m.', label: 'Salida oficial de la carrera' },
      { time: '12:30 p. m.', label: 'Hora estimada de llegada' },
      { time: '1:00 p. m.', label: 'Premiacion oficial' },
      { time: '2:00 p. m.', label: 'Cierre del evento' },
    ],
  },
];

export const participantCards: InfoCard[] = [
  {
    title: 'Requisitos de participacion',
    icon: CheckCircle,
    items: [
      'Diligenciar correctamente la inscripcion.',
      'Aceptar el reglamento oficial.',
      'Enviar fotografia e informacion requerida por la organizacion.',
      'Presentarse con puntualidad en kits y competencia.',
      'Cumplir indicaciones de logistica, jueces y organizadores.',
    ],
  },
  {
    title: 'Equipamiento recomendado',
    icon: Droplets,
    items: [
      'Cantimplora o recipiente personal para recibir hidratacion.',
      'Guantes.',
      'Bastones de trail o palillos de apoyo en ascensos y descensos.',
      'Calzado de trail o de montana con buen agarre.',
      'Si llueve: gorro para el frio, pito y chaqueta rompevientos.',
    ],
  },
  {
    title: 'Conducta y premiacion',
    icon: Trophy,
    items: [
      'Competir con respeto, honestidad y sana competencia.',
      'Los cinco primeros de cada categoria deben permanecer hasta el cierre de la competencia.',
      'La premiacion se entrega solo en el horario oficial.',
      'Quien aspire a premiacion debe esperar la llegada del ultimo atleta.',
    ],
  },
  {
    title: 'Revision de inscripcion',
    icon: AlertTriangle,
    items: [
      'La organizacion puede revisar categorias incorrectas por edad o experiencia.',
      'La categoria recreativa sera validada segun sus condiciones oficiales.',
      'La informacion falsa, incompleta o inconsistente puede invalidar la inscripcion.',
      'El comite organizador resolvera cualquier caso no previsto.',
    ],
  },
];

export const officialRegulationSections: RegulationSection[] = [
  {
    title: '1. Objeto del reglamento',
    summary: 'Define las condiciones de participacion, seguridad, categorias y obligaciones del evento.',
    items: [
      'Establece normas logisticas, requisitos de seguridad, clasificacion por categorias y compromisos obligatorios para todos los atletas inscritos en WAYRA TRAIL 16K.',
    ],
  },
  {
    title: '2. Aceptacion del reglamento',
    summary: 'La inscripcion implica aceptacion total de todas las disposiciones.',
    items: [
      'Cada participante declara haber leido el reglamento completo.',
      'Acepta cumplir cada norma aqui establecida.',
      'Se compromete a participar de manera responsable, honesta y respetuosa.',
      'Reconoce que debe inscribirse en la categoria que realmente le corresponde segun edad y experiencia.',
    ],
  },
  {
    title: '3. Entrega de kits',
    summary: 'La entrega oficial sera solo el 10 de octubre en jornada continua.',
    items: [
      'Los participantes deben presentarse puntualmente dentro de los horarios establecidos.',
      'El 11 de octubre no se realizara entrega de kits.',
      'La organizacion no se hace responsable por kits no reclamados el dia oficial.',
      'Si el atleta no puede asistir, debe autorizar a un companero de confianza para reclamar el kit.',
    ],
  },
  {
    title: '4. Programacion oficial del evento',
    summary: 'Todos deben asistir a la concentracion previa a la salida.',
    items: [
      '6:30 a. m.: concentracion de los participantes.',
      '6:30 a. m. a 7:45 a. m.: calentamiento general e informacion tecnica de carrera.',
      '8:00 a. m.: salida oficial de la carrera.',
      '12:30 p. m.: hora estimada de llegada.',
      '1:00 p. m.: premiacion oficial.',
      '2:00 p. m.: cierre del evento.',
    ],
  },
  {
    title: '5. Categorias oficiales',
    summary: 'Las categorias aplican en rama masculina y femenina.',
    items: [
      'Recreativa: exclusiva para personas que no hayan practicado trail running ni carreras atleticas.',
      'Libre: participantes entre 18 y 39 anos.',
      'A: participantes entre 40 y 49 anos.',
      'B: participantes entre 50 y 59 anos.',
      'C: participantes de 60 anos en adelante.',
      'Cada atleta debe inscribirse con total honestidad; la organizacion podra verificar la informacion.',
    ],
  },
  {
    title: '6. Requisitos de participacion',
    summary: 'Hay requisitos minimos que todos los atletas deben cumplir.',
    items: [
      'Haber diligenciado correctamente la inscripcion.',
      'Aceptar el presente reglamento.',
      'Enviar su fotografia y la informacion requerida por la organizacion segun su categoria.',
      'Presentarse con puntualidad en la entrega de kits y el dia de la competencia.',
      'Cumplir las indicaciones del equipo logistico, jueces y organizadores.',
    ],
  },
  {
    title: '7. Implementos y equipamiento recomendado',
    summary: 'El recorrido de montana exige preparacion y equipo adecuado.',
    items: [
      'Portar cantimplora para recibir agua en los puntos de avituallamiento.',
      'Se recomienda usar guantes.',
      'Se recomienda llevar bastones de trail o palillos de madera para apoyo.',
      'Usar zapatillas de trail, tenis de montana o calzado con buen agarre.',
      'En caso de lluvia: gorro para el frio, pito y chaqueta rompevientos.',
      'No se recomienda el uso de bolsas de agua, salvo criterio personal del atleta y bajo su propia responsabilidad.',
    ],
  },
  {
    title: '8. Avituallamiento e hidratacion',
    summary: 'Cada atleta es responsable de su hidratacion y preparacion previa.',
    items: [
      'La organizacion dispondra de puntos de avituallamiento durante el recorrido.',
      'Cada participante debe portar su propia cantimplora o recipiente personal para recibir hidratacion.',
      'El atleta es responsable de su alimentacion, hidratacion y preparacion fisica previa.',
    ],
  },
  {
    title: '9. Conducta deportiva y premiacion',
    summary: 'La convivencia, el respeto y la permanencia hasta el cierre hacen parte del reglamento.',
    items: [
      'Todos los participantes deben mantener una conducta deportiva adecuada.',
      'Los atletas que ocupen alguno de los cinco primeros puestos de su categoria deben permanecer en el evento hasta la finalizacion de la competencia.',
      'La premiacion se realizara unicamente en el horario establecido por la organizacion.',
      'Quien aspire a recibir premiacion debe esperar la llegada del ultimo atleta como muestra de respeto y para el cierre de clasificacion final.',
    ],
  },
  {
    title: '10. Responsabilidad del participante',
    summary: 'Cada corredor participa bajo su propia responsabilidad.',
    items: [
      'El atleta declara que se encuentra en condiciones fisicas adecuadas para realizar una carrera de montana.',
      'Comprende las exigencias fisicas de la prueba.',
      'Reconoce los riesgos propios de una competencia de trail running.',
      'Se compromete a actuar con prudencia durante todo el recorrido.',
      'Acepta seguir las instrucciones del personal logistico, de seguridad y organizacion.',
    ],
  },
  {
    title: '11. Causales de no aceptacion o revision de inscripcion',
    summary: 'La organizacion puede rechazar, revisar o ajustar registros.',
    items: [
      'Cuando el participante se registre en una categoria que no corresponda a su edad.',
      'Cuando se inscriba en categoria recreativa sin cumplir las condiciones establecidas.',
      'Cuando se detecte informacion falsa, incompleta o inconsistente.',
      'Cuando no se cumplan los requisitos definidos por la organizacion.',
    ],
  },
  {
    title: '12. Autoridad de la organizacion',
    summary: 'La organizacion interpreta y hace cumplir el reglamento.',
    items: [
      'La organizacion del evento tiene plena facultad para interpretar, aplicar y hacer cumplir este reglamento.',
      'Cualquier situacion no prevista sera resuelta por el comite organizador, cuya decision sera final.',
    ],
  },
  {
    title: '13. Declaracion final del participante',
    summary: 'Formalizar la inscripcion equivale a aceptar todas las condiciones.',
    items: [
      'El participante declara que ha leido y comprendido el reglamento y acepta cada una de sus condiciones.',
      'Tambien manifiesta su voluntad de formar parte de la plataforma oficial del evento cumpliendo normas, horarios, requisitos y criterios de participacion.',
    ],
  },
  {
    title: '14. Mensaje de bienvenida',
    summary: 'El evento invita a vivir una experiencia deportiva, cultural y de montana.',
    items: [
      'La organizacion da la bienvenida a todos los atletas y desea que su participacion se viva con disciplina, respeto, seguridad y espiritu de superacion.',
    ],
  },
];

export const formReminderItems = [
  '10 de octubre: entrega oficial de kits.',
  '11 de octubre: salida oficial a las 8:00 a. m.',
  'La categoria recreativa solo aplica si no tienes experiencia previa en trail o carreras atleticas.',
  'Debes llevar tu propia cantimplora para recibir hidratacion.',
];

export const sponsors = [
  {
    name: 'Alfa Digital',
    image: new URL('../../img/alfa digital.png', import.meta.url).href,
  },
  {
    name: 'Christian',
    image: new URL('../../img/christian.jpeg', import.meta.url).href,
  },
  {
    name: 'Clima Lab',
    image: new URL('../../img/clima lab.jpeg', import.meta.url).href,
  },
  {
    name: 'Comercializadora Hortofrutical',
    image: new URL('../../img/comecializadora hortofrutical.jpeg', import.meta.url).href,
  },
  {
    name: 'Semprando Economia',
    image: new URL('../../img/semprando economia.jpeg', import.meta.url).href,
  },
];

export const footerItems = [
  { id: 'categorias', label: 'Categorias' },
  ...navigationItems,
];
