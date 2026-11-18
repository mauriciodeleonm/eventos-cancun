import { addDays, format } from 'date-fns';
import { nowInCancun } from '@/lib/timezone';

const now = nowInCancun();

function at(dayOffset: number, time?: string): string {
  const date = format(addDays(now, dayOffset), 'yyyy-MM-dd');
  return time ? `${date}T${time}` : date;
}

const mockEvents = [
  {
    id: 'cine-bajo-las-estrellas-k3f9',
    name: 'Cine bajo las estrellas',
    startDate: at(2, '19:30'),
    venueName: 'Parque Kabah',
    price: 0,
    description:
      'Proyección al aire libre de clásicos del cine mexicano, con área de cojines y food trucks.',
    imageUrls: ['https://placehold.co/600x400?text=Cine+bajo+las+estrellas'],
    category: 'familiar',
  },
  {
    id: 'torneo-voleibol-playa-x7m2',
    name: 'Torneo de Voleibol Playa',
    startDate: at(5, '09:00'),
    venueName: 'Playa Delfines',
    price: null,
    description: 'Torneo abierto de voleibol de playa con categorías varonil, femenil y mixto.',
    imageUrls: ['https://placehold.co/600x400?text=Voleibol+Playa'],
    officialUrl: 'https://example.com/torneo-voleibol',
    category: 'deportes',
  },
  {
    id: 'feria-gastronomica-caribe-b4t8',
    name: 'Feria Gastronómica del Caribe',
    startDate: at(9, '12:00'),
    endDate: at(11, '22:00'),
    venueName: 'Malecón Tajamar',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Malec%C3%B3n%20Tajamar%2C%20Canc%C3%BAn',
    price: 150,
    description: 'Tres días de gastronomía caribeña con más de 30 expositores locales.',
    imageUrls: [
      'https://placehold.co/600x400?text=Feria+Gastronomica+1',
      'https://placehold.co/600x400?text=Feria+Gastronomica+2',
      'https://placehold.co/600x400?text=Feria+Gastronomica+3',
    ],
    category: 'gastronomia',
  },
  {
    id: 'expo-artesanal-cancun-p9w1',
    name: 'Expo Artesanal Cancún',
    startDate: at(-2, '10:00'),
    endDate: at(3, '20:00'),
    venueName: 'Plaza Las Américas',
    price: 50,
    description: 'Exposición y venta de artesanías de creadores de Quintana Roo.',
    imageUrls: ['https://placehold.co/600x400?text=Expo+Artesanal'],
    category: 'cultura',
  },
  {
    id: 'carrera-nocturna-5k-a7c2',
    name: 'Carrera Nocturna 5K',
    startDate: at(-10, '19:00'),
    venueName: 'Malecón Bonampak',
    price: 200,
    description: 'Carrera nocturna de 5 kilómetros con kit de corredor incluido.',
    imageUrls: ['https://placehold.co/600x400?text=Carrera+Nocturna'],
    category: 'deportes',
  },
  {
    id: 'bazar-diseno-local-q2n5',
    name: 'Bazar de Diseño Local',
    startDate: at(8),
    venueName: 'Mercado 28',
    price: 0,
    description: 'Bazar de diseñadores y marcas independientes de Cancún.',
    imageUrls: ['https://placehold.co/600x400?text=Bazar+de+Diseno'],
    category: 'otro',
  },
  {
    id: 'rodada-nocturna-bici-h8j3',
    name: 'Rodada Nocturna en Bici',
    startDate: at(3, '20:00'),
    venueName: 'Bici Ruta Kukulcán',
    price: 0,
    description: 'Rodada grupal nocturna por la zona hotelera, ritmo libre.',
    category: 'deportes',
  },
  {
    id: 'concierto-rock-alternativo-m1v6',
    name: 'Concierto de Rock Alternativo',
    startDate: at(20, '21:00'),
    venueName: 'Foro GNP',
    price: 550,
    priceNote: 'Reembolsos en el punto de venta original',
    description: 'Concierto de rock alternativo con bandas locales e invitados nacionales.',
    imageUrls: ['https://placehold.co/600x400?text=Concierto+Rock'],
    category: 'musica',
    status: 'cancelado',
  },
  {
    id: 'obra-bodas-sangre-z5r0',
    name: 'Obra de Teatro: Bodas de Sangre',
    startDate: at(6, '19:00'),
    venueName: 'Teatro de Cancún',
    price: 450,
    priceNote: 'Boletos agotados en línea, verificar disponibilidad en taquilla',
    officialUrl: 'https://example.com/bodas-de-sangre',
    description: 'Puesta en escena de la obra de Federico García Lorca.',
    imageUrls: ['https://placehold.co/600x400?text=Bodas+de+Sangre'],
    category: 'cultura',
    status: 'agotado',
  },
  {
    id: 'festival-cine-independiente-t3y7',
    name: 'Festival de Cine Independiente',
    startDate: at(60, '18:00'),
    venueName: 'Cinépolis La Isla',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Cin%C3%A9polis%20La%20Isla%2C%20Canc%C3%BAn',
    price: null,
    description: 'Muestra de cine independiente mexicano y latinoamericano.',
    officialUrl: 'https://example.com/festival-cine',
    category: 'cultura',
    status: 'reprogramado',
  },
];

export default mockEvents;
