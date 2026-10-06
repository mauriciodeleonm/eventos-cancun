import {
  BookOpen,
  Music,
  Shapes,
  Trophy,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from 'lucide-react';

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

export const CATEGORY_ICONS: Record<EventCategory, LucideIcon> = {
  deportes: Trophy,
  cultura: BookOpen,
  musica: Music,
  gastronomia: UtensilsCrossed,
  familiar: Users,
  otro: Shapes,
};

// Hue exacto del diseño Nocturne; null = "otro", que no lleva tinte de color.
const CATEGORY_HUE: Record<EventCategory, number | null> = {
  deportes: 155,
  cultura: 70,
  musica: 300,
  gastronomia: 35,
  familiar: 235,
  otro: null,
};

export function categoryColor(category: EventCategory): string {
  const hue = CATEGORY_HUE[category];
  return hue === null ? 'var(--color-neutral-400)' : `oklch(0.78 0.08 ${hue})`;
}

export function categoryIconTint(category: EventCategory): string {
  const hue = CATEGORY_HUE[category];
  return hue === null ? 'var(--color-neutral-600)' : `oklch(0.66 0.06 ${hue})`;
}

export function categoryBackgroundTint(category: EventCategory): string {
  const hue = CATEGORY_HUE[category];
  const center = hue === null ? 'var(--color-neutral-800)' : `oklch(0.36 0.05 ${hue})`;
  return `radial-gradient(110% 120% at 0% 0%, ${center} 0%, transparent 65%), var(--color-neutral-900)`;
}
