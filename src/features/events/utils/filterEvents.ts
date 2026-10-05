import { addDays, endOfDay, startOfDay } from 'date-fns';
import type { EventCategory } from '@/features/events/constants';
import type { Event } from '@/features/events/schema';
import { getComputedStatus } from '@/features/events/utils/getComputedStatus';
import { nowInCancun, parseCancunDate } from '@/lib/timezone';

export const DATE_RANGES = ['hoy', 'fin-de-semana', 'semana', 'mes'] as const;
export type DateRange = (typeof DATE_RANGES)[number];

export interface EventFiltersState {
  categoria?: EventCategory[];
  rango?: DateRange;
  gratis?: boolean;
}

function getRangeWindow(rango: DateRange, now: Date): { start: Date; end: Date } {
  switch (rango) {
    case 'hoy':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'fin-de-semana': {
      // Si "hoy" ya es domingo, el fin de semana empezó ayer (sábado).
      const day = now.getDay();
      const offsetToSaturday = day === 0 ? -1 : 6 - day;
      const saturday = addDays(now, offsetToSaturday);
      return { start: startOfDay(saturday), end: endOfDay(addDays(saturday, 1)) };
    }
    case 'semana':
      return { start: startOfDay(now), end: endOfDay(addDays(now, 7)) };
    case 'mes':
      return { start: startOfDay(now), end: endOfDay(addDays(now, 30)) };
  }
}

function isEventInRange(event: Event, rango: DateRange, now: Date): boolean {
  if (getComputedStatus(event, now) === 'finalizado') return false;

  const { start, end } = getRangeWindow(rango, now);
  const eventStart = parseCancunDate(event.startDate);
  const eventEnd = event.endDate ? parseCancunDate(event.endDate) : endOfDay(eventStart);

  // El evento entra si se traslapa con la ventana del rango.
  return eventStart <= end && eventEnd >= start;
}

export function filterEvents(
  events: Event[],
  filters: EventFiltersState,
  now: Date = nowInCancun(),
): Event[] {
  return events.filter((event) => {
    if (filters.categoria?.length && !filters.categoria.includes(event.category)) {
      return false;
    }

    if (filters.gratis && event.price !== 0) {
      return false;
    }

    if (filters.rango && !isEventInRange(event, filters.rango, now)) {
      return false;
    }

    return true;
  });
}
