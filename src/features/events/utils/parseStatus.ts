import { EVENT_STATUSES } from '@/features/events/constants';
import { stripAccents } from '@/features/events/utils/parsePrice';

type EventStatus = (typeof EVENT_STATUSES)[number];

export function parseStatus(raw: string | undefined): EventStatus | undefined {
  if (!raw || raw.trim() === '') return undefined;

  const normalized = stripAccents(raw.trim().toLowerCase());
  const match = EVENT_STATUSES.find((status) => status === normalized);

  if (!match) {
    console.warn(`Estado desconocido "${raw}", se trata como "programado".`);
    return undefined;
  }

  return match;
}
