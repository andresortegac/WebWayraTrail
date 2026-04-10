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
    description: 'Solo para personas que no hayan practicado trail running ni carreras atléticas.',
    ageRange: 'Sin límite de edad',
  },
  {
    name: 'Libre',
    color: '#FCD34D',
    description: 'Categoría oficial para participantes entre 18 y 39 años.',
    ageRange: '18 - 39 años',
  },
  {
    name: 'A',
    color: '#10B981',
    description: 'Categoría oficial para participantes entre 40 y 49 años.',
    ageRange: '40 - 49 años',
  },
  {
    name: 'B',
    color: '#3B82F6',
    description: 'Categoría oficial para participantes entre 50 y 59 años.',
    ageRange: '50 - 59 años',
  },
  {
    name: 'C',
    color: '#8B5CF6',
    description: 'Categoría oficial para participantes de 60 años en adelante.',
    ageRange: '60 años en adelante',
  },
];

export const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const navigationItems = [
  { id: 'reglamento', label: 'Reglamento' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'compromisos', label: 'Claves' },
  { id: 'patrocinios', label: 'Patrocinios' },
  { id: 'inscripcion', label: 'Inscripción' },
];

export const heroSlides: HeroSlide[] = [
  {
    title: 'Ruta entre montañas',
    subtitle: 'Senderos que abren la experiencia',
    description: 'La portada ahora respira paisaje real y prepara visualmente para una carrera de montaña con identidad propia.',
    location: 'Sibundoy, Putumayo',
    badge: 'Wayra Trail',
    image: new URL('../../img/hero-bg.jpg', import.meta.url).href,
  },
  {
    title: 'Atardecer del valle',
    subtitle: 'Color, altura y profundidad',
    description: 'Un cierre de luz que le da al slider un tono elegante, natural y mucho más conectado con el territorio.',
    location: 'Valle de Sibundoy',
    badge: 'Paisaje local',
    image: new URL('../../img/sibundoy-atardecer-web.jpg', import.meta.url).href,
  },
  {
    title: 'Memoria viva en el parque',
    subtitle: 'Cultura ancestral en primer plano',
    description: 'La presencia de arte local ayuda a que la portada no sea solo deportiva, sino también cultural y reconocible.',
    location: 'Parque de Sibundoy',
    badge: 'Identidad ancestral',
    image: new URL('../../img/sibundoy-parque-madera-web.jpg', import.meta.url).href,
  },
  {
    title: 'Verde profundo y agua',
    subtitle: 'Calma antes del desafío',
    description: 'Una escena serena para equilibrar el hero con una fotografía fresca, abierta y muy propia del entorno putumayense.',
    location: 'Sibundoy rural',
    badge: 'Naturaleza viva',
    image: new URL('../../img/sibundoy-lago.jpg', import.meta.url).href,
  },
];

export const officialHighlights: HighlightCard[] = [
  {
    title: 'Aceptación obligatoria',
    description: 'La inscripción confirma que leíste, comprendiste y aceptaste el reglamento oficial.',
    icon: FileText,
  },
  {
    title: 'Kit oficial',
    description: 'La entrega será únicamente el 10 de octubre. El 11 de octubre no habrá entrega de kits.',
    icon: Package,
  },
  {
    title: 'Día de carrera',
    description: 'Concentración 6:30 a. m., salida 8:00 a. m., premiación 1:00 p. m. y cierre 2:00 p. m.',
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
  '5 categorías por rama',
  'Cantimplora personal para hidratación',
  'Premiación al cierre oficial',
];

export const timelineSections: TimelineSection[] = [
  {
    day: '10 de octubre',
    title: 'Entrega oficial de kits',
    description:
      'Todos los participantes deben presentarse dentro de los horarios oficiales o autorizar a un compañero de confianza.',
    alert: 'El 11 de octubre no se realizará entrega de kits.',
    items: [
      { time: '8:00 a. m. - 12:00 m.', label: 'Primera franja de entrega' },
      { time: '12:00 m. - 6:00 p. m.', label: 'Segunda franja de entrega' },
      { time: '6:00 p. m. - 10:00 p. m.', label: 'Última franja de entrega' },
    ],
  },
  {
    day: '11 de octubre',
    title: 'Programación oficial del evento',
    description:
      'Todos los atletas deben asistir a la concentración para recibir orientaciones técnicas y de seguridad.',
    alert: 'La premiación se realiza solo en el horario definido por la organización.',
    items: [
      { time: '6:30 a. m.', label: 'Concentración de participantes' },
      { time: '6:30 a. m. - 7:45 a. m.', label: 'Calentamiento e información técnica' },
      { time: '8:00 a. m.', label: 'Salida oficial de la carrera' },
      { time: '12:30 p. m.', label: 'Hora estimada de llegada' },
      { time: '1:00 p. m.', label: 'Premiación oficial' },
      { time: '2:00 p. m.', label: 'Cierre del evento' },
    ],
  },
];

export const participantCards: InfoCard[] = [
  {
    title: 'Requisitos de participación',
    icon: CheckCircle,
    items: [
      'Diligenciar correctamente la inscripción.',
      'Aceptar el reglamento oficial.',
      'Enviar fotografía e información requerida por la organización.',
      'Presentarse con puntualidad en kits y competencia.',
      'Cumplir indicaciones de logística, jueces y organizadores.',
    ],
  },
  {
    title: 'Equipamiento recomendado',
    icon: Droplets,
    items: [
      'Cantimplora o recipiente personal para recibir hidratación.',
      'Guantes.',
      'Bastones de trail o palillos de apoyo en ascensos y descensos.',
      'Calzado de trail o de montaña con buen agarre.',
      'Si llueve: gorro para el frío, pito y chaqueta rompevientos.',
    ],
  },
  {
    title: 'Conducta y premiación',
    icon: Trophy,
    items: [
      'Competir con respeto, honestidad y sana competencia.',
      'Los cinco primeros de cada categoría deben permanecer hasta el cierre de la competencia.',
      'La premiación se entrega solo en el horario oficial.',
      'Quien aspire a premiación debe esperar la llegada del último atleta.',
    ],
  },
  {
    title: 'Revisión de inscripción',
    icon: AlertTriangle,
    items: [
      'La organización puede revisar categorías incorrectas por edad o experiencia.',
      'La categoría recreativa será validada según sus condiciones oficiales.',
      'La información falsa, incompleta o inconsistente puede invalidar la inscripción.',
      'El comité organizador resolverá cualquier caso no previsto.',
    ],
  },
];

export const officialRegulationSections: RegulationSection[] = [
  {
    title: '1. Objeto del reglamento',
    summary: 'Define las condiciones de participación, seguridad, categorías y obligaciones del evento.',
    items: [
      'Establece normas logísticas, requisitos de seguridad, clasificación por categorías y compromisos obligatorios para todos los atletas inscritos en WAYRA TRAIL 16K.',
    ],
  },
  {
    title: '2. Aceptación del reglamento',
    summary: 'La inscripción implica aceptación total de todas las disposiciones.',
    items: [
      'Cada participante declara haber leído el reglamento completo.',
      'Acepta cumplir cada norma aquí establecida.',
      'Se compromete a participar de manera responsable, honesta y respetuosa.',
      'Reconoce que debe inscribirse en la categoría que realmente le corresponde según edad y experiencia.',
    ],
  },
  {
    title: '3. Entrega de kits',
    summary: 'La entrega oficial será solo el 10 de octubre en jornada continua.',
    items: [
      'Los participantes deben presentarse puntualmente dentro de los horarios establecidos.',
      'El 11 de octubre no se realizará entrega de kits.',
      'La organización no se hace responsable por kits no reclamados el día oficial.',
      'Si el atleta no puede asistir, debe autorizar a un compañero de confianza para reclamar el kit.',
    ],
  },
  {
    title: '4. Programación oficial del evento',
    summary: 'Todos deben asistir a la concentración previa a la salida.',
    items: [
      '6:30 a. m.: concentración de los participantes.',
      '6:30 a. m. a 7:45 a. m.: calentamiento general e información técnica de carrera.',
      '8:00 a. m.: salida oficial de la carrera.',
      '12:30 p. m.: hora estimada de llegada.',
      '1:00 p. m.: premiación oficial.',
      '2:00 p. m.: cierre del evento.',
    ],
  },
  {
    title: '5. Categorías oficiales',
    summary: 'Las categorías aplican en rama masculina y femenina.',
    items: [
      'Recreativa: exclusiva para personas que no hayan practicado trail running ni carreras atléticas.',
      'Libre: participantes entre 18 y 39 años.',
      'A: participantes entre 40 y 49 años.',
      'B: participantes entre 50 y 59 años.',
      'C: participantes de 60 años en adelante.',
      'Cada atleta debe inscribirse con total honestidad; la organización podrá verificar la información.',
    ],
  },
  {
    title: '6. Requisitos de participación',
    summary: 'Hay requisitos mínimos que todos los atletas deben cumplir.',
    items: [
      'Haber diligenciado correctamente la inscripción.',
      'Aceptar el presente reglamento.',
      'Enviar su fotografía y la información requerida por la organización según su categoría.',
      'Presentarse con puntualidad en la entrega de kits y el día de la competencia.',
      'Cumplir las indicaciones del equipo logístico, jueces y organizadores.',
    ],
  },
  {
    title: '7. Implementos y equipamiento recomendado',
    summary: 'El recorrido de montaña exige preparación y equipo adecuado.',
    items: [
      'Portar cantimplora para recibir agua en los puntos de avituallamiento.',
      'Se recomienda usar guantes.',
      'Se recomienda llevar bastones de trail o palillos de madera para apoyo.',
      'Usar zapatillas de trail, tenis de montaña o calzado con buen agarre.',
      'En caso de lluvia: gorro para el frío, pito y chaqueta rompevientos.',
      'No se recomienda el uso de bolsas de agua, salvo criterio personal del atleta y bajo su propia responsabilidad.',
    ],
  },
  {
    title: '8. Avituallamiento e hidratación',
    summary: 'Cada atleta es responsable de su hidratación y preparación previa.',
    items: [
      'La organización dispondrá de puntos de avituallamiento durante el recorrido.',
      'Cada participante debe portar su propia cantimplora o recipiente personal para recibir hidratación.',
      'El atleta es responsable de su alimentación, hidratación y preparación física previa.',
    ],
  },
  {
    title: '9. Conducta deportiva y premiación',
    summary: 'La convivencia, el respeto y la permanencia hasta el cierre hacen parte del reglamento.',
    items: [
      'Todos los participantes deben mantener una conducta deportiva adecuada.',
      'Los atletas que ocupen alguno de los cinco primeros puestos de su categoría deben permanecer en el evento hasta la finalización de la competencia.',
      'La premiación se realizará únicamente en el horario establecido por la organización.',
      'Quien aspire a recibir premiación debe esperar la llegada del último atleta como muestra de respeto y para el cierre de clasificación final.',
    ],
  },
  {
    title: '10. Responsabilidad del participante',
    summary: 'Cada corredor participa bajo su propia responsabilidad.',
    items: [
      'El atleta declara que se encuentra en condiciones físicas adecuadas para realizar una carrera de montaña.',
      'Comprende las exigencias físicas de la prueba.',
      'Reconoce los riesgos propios de una competencia de trail running.',
      'Se compromete a actuar con prudencia durante todo el recorrido.',
      'Acepta seguir las instrucciones del personal logístico, de seguridad y organización.',
    ],
  },
  {
    title: '11. Causales de no aceptación o revisión de inscripción',
    summary: 'La organización puede rechazar, revisar o ajustar registros.',
    items: [
      'Cuando el participante se registre en una categoría que no corresponda a su edad.',
      'Cuando se inscriba en categoría recreativa sin cumplir las condiciones establecidas.',
      'Cuando se detecte información falsa, incompleta o inconsistente.',
      'Cuando no se cumplan los requisitos definidos por la organización.',
    ],
  },
  {
    title: '12. Autoridad de la organización',
    summary: 'La organización interpreta y hace cumplir el reglamento.',
    items: [
      'La organización del evento tiene plena facultad para interpretar, aplicar y hacer cumplir este reglamento.',
      'Cualquier situación no prevista será resuelta por el comité organizador, cuya decisión será final.',
    ],
  },
  {
    title: '13. Declaración final del participante',
    summary: 'Formalizar la inscripción equivale a aceptar todas las condiciones.',
    items: [
      'El participante declara que ha leído y comprendido el reglamento y acepta cada una de sus condiciones.',
      'También manifiesta su voluntad de formar parte de la plataforma oficial del evento cumpliendo normas, horarios, requisitos y criterios de participación.',
    ],
  },
  {
    title: '14. Mensaje de bienvenida',
    summary: 'El evento invita a vivir una experiencia deportiva, cultural y de montaña.',
    items: [
      'La organización da la bienvenida a todos los atletas y desea que su participación se viva con disciplina, respeto, seguridad y espíritu de superación.',
    ],
  },
];

export const formReminderItems = [
  '10 de octubre: entrega oficial de kits.',
  '11 de octubre: salida oficial a las 8:00 a. m.',
  'La categoría recreativa solo aplica si no tienes experiencia previa en trail o carreras atléticas.',
  'Debes llevar tu propia cantimplora para recibir hidratación.',
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
    name: 'Sembrado Economía',
    image: new URL('../../img/semprando economia.jpeg', import.meta.url).href,
  },
  {
    name: 'Somos Sibundoy',
    image: new URL('../../img/somos-sibundoy.svg', import.meta.url).href,
  },
  {
    name: 'Sebas Running',
    image: new URL('../../img/sebas-running.svg', import.meta.url).href,
  },
];

export const footerItems = [
  { id: 'categorias', label: 'Categorías' },
  ...navigationItems,
];
