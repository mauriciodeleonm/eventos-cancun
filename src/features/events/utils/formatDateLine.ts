import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Event } from '@/features/events/schema';
import { parseCancunDate } from '@/lib/timezone';
import { capitalize } from '@/lib/utils';

export function isMultiDay(event: Pick<Event, 'startDate' | 'endDate'>): boolean {
  return Boolean(event.endDate) && event.endDate!.slice(0, 10) !== event.startDate.slice(0, 10);
}

export function formatLongDay(date: Date): string {
  return format(date, "EEEE d 'de' MMMM", { locale: es });
}

export function formatDateLine(event: Pick<Event, 'startDate' | 'endDate'>): string {
  const start = parseCancunDate(event.startDate);

  if (isMultiDay(event)) {
    const end = parseCancunDate(event.endDate!);
    const startYear = format(start, 'yyyy');
    const endYear = format(end, 'yyyy');

    if (startYear === endYear) {
      return `Del ${formatLongDay(start)} al ${formatLongDay(end)} de ${startYear}`;
    }

    return `Del ${formatLongDay(start)} de ${startYear} al ${formatLongDay(end)} de ${endYear}`;
  }

  return `${capitalize(formatLongDay(start))} de ${format(start, 'yyyy')}`;
}
