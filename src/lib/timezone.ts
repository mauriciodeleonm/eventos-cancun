import { TZDate } from '@date-fns/tz';

export const CANCUN_TIME_ZONE = 'America/Cancun';

export function hasExplicitTime(dateString: string): boolean {
  return dateString.includes('T');
}

export function parseCancunDate(dateString: string): TZDate {
  const normalized = hasExplicitTime(dateString) ? dateString : `${dateString}T00:00`;
  return new TZDate(normalized, CANCUN_TIME_ZONE);
}

export function nowInCancun(): TZDate {
  return TZDate.tz(CANCUN_TIME_ZONE);
}
