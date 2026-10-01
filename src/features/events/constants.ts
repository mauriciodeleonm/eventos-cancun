export const EVENT_CATEGORIES = [
  'deportes',
  'cultura',
  'musica',
  'gastronomia',
  'familiar',
  'otro',
] as const;

export const EVENT_STATUSES = [
  'programado',
  'cancelado',
  'pospuesto',
  'reprogramado',
  'agotado',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  deportes: 'Deportes',
  cultura: 'Cultura',
  musica: 'Música',
  gastronomia: 'Gastronomía',
  familiar: 'Familiar',
  otro: 'Otro',
};

// ponytail: placehold.co stand-ins until real fallback art lands in Fase 4 (Diseño visual propio).
export const CATEGORY_FALLBACK_IMAGE: Record<EventCategory, string> = {
  deportes: 'https://placehold.co/600x400?text=Deportes',
  cultura: 'https://placehold.co/600x400?text=Cultura',
  musica: 'https://placehold.co/600x400?text=M%C3%BAsica',
  gastronomia: 'https://placehold.co/600x400?text=Gastronom%C3%ADa',
  familiar: 'https://placehold.co/600x400?text=Familiar',
  otro: 'https://placehold.co/600x400?text=Otro',
};
