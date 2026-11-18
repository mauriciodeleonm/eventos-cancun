import { TZDate } from '@date-fns/tz';

export const CANCUN_TIME_ZONE = 'America/Cancun';

export function hasExplicitTime(dateString: string): boolean {
  return dateString.includes('T');
}

export function parseCancunDate(dateString: string): TZDate {
  const normalized = hasExplicitTime(dateString) ? dateString : `${dateString}T00:00`;
  const [datePart, timePart] = normalized.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  // Numeric components, not a string, so the wall-clock time is fixed in
  // CANCUN_TIME_ZONE regardless of the runtime's own system time zone — a
  // plain string without an offset is parsed as *system-local* time first,
  // which only happened to match in Cancún-timezone dev machines and broke
  // on CI runners (UTC).
  return new TZDate(year, month - 1, day, hours, minutes, CANCUN_TIME_ZONE);
}

export function nowInCancun(): TZDate {
  return TZDate.tz(CANCUN_TIME_ZONE);
}
