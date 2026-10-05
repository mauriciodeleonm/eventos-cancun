import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Event } from '@/features/events/schema';
import { getComputedStatus } from '@/features/events/utils/getComputedStatus';
import { hasExplicitTime, nowInCancun, parseCancunDate } from '@/lib/timezone';
import { capitalize } from '@/lib/utils';

export interface EventDayGroup {
  key: string;
  label: string;
  events: Event[];
}

function dayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function dayLabel(date: Date, now: Date): string {
  const key = dayKey(date);

  if (key === dayKey(now)) return 'Hoy';
  if (key === dayKey(addDays(now, 1))) return 'Mañana';

  return capitalize(format(date, "EEEE d 'de' MMMM", { locale: es }));
}

function sortKey(event: Event): number {
  return hasExplicitTime(event.startDate)
    ? parseCancunDate(event.startDate).getTime()
    : Number.POSITIVE_INFINITY;
}

function compareEvents(a: Event, b: Event): number {
  return sortKey(a) - sortKey(b) || a.name.localeCompare(b.name, 'es');
}

export function groupByDay(events: Event[], now: Date = nowInCancun()): EventDayGroup[] {
  const buckets = new Map<string, Event[]>();

  for (const event of events) {
    const status = getComputedStatus(event, now);
    if (status === 'finalizado') continue;

    const key = status === 'en-curso' ? dayKey(now) : dayKey(parseCancunDate(event.startDate));
    const bucket = buckets.get(key) ?? [];
    bucket.push(event);
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, bucketEvents]) => ({
      key,
      label: dayLabel(parseCancunDate(key), now),
      events: bucketEvents.sort(compareEvents),
    }));
}
