import { endOfDay, isAfter, isBefore } from 'date-fns';
import type { Event } from '@/features/events/schema';
import { nowInCancun, parseCancunDate } from '@/lib/timezone';

export type ComputedStatus = 'proximo' | 'en-curso' | 'finalizado';

export function getComputedStatus(
  event: Pick<Event, 'startDate' | 'endDate'>,
  now: Date = nowInCancun(),
): ComputedStatus {
  const start = parseCancunDate(event.startDate);
  const end = event.endDate ? parseCancunDate(event.endDate) : endOfDay(start);

  if (isBefore(now, start)) return 'proximo';
  if (isAfter(now, end)) return 'finalizado';
  return 'en-curso';
}
