import type { Event } from '@/features/events/schema';
import { hasExplicitTime, parseCancunDate } from '@/lib/timezone';

export function formatClockTime(date: Date): string {
  const hours = date.getHours();
  const displayHours = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? 'a. m.' : 'p. m.';
  return `${displayHours}:${minutes} ${period}`;
}

export function formatTimeLabel(event: Pick<Event, 'startDate' | 'endDate'>): string {
  if (!hasExplicitTime(event.startDate)) return 'Hora por confirmar';

  const start = formatClockTime(parseCancunDate(event.startDate));

  const sameDayEnd =
    event.endDate && event.endDate.slice(0, 10) === event.startDate.slice(0, 10)
      ? event.endDate
      : null;

  if (!sameDayEnd) return start;

  return `${start} – ${formatClockTime(parseCancunDate(sameDayEnd))}`;
}
