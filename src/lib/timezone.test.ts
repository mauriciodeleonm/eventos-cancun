import { hasExplicitTime, parseCancunDate } from '@/lib/timezone';

describe('hasExplicitTime', () => {
  it('returns true when the string includes a time', () => {
    expect(hasExplicitTime('2026-10-01T19:30')).toBe(true);
  });

  it('returns false for a date-only string', () => {
    expect(hasExplicitTime('2026-10-01')).toBe(false);
  });
});

describe('parseCancunDate', () => {
  it('interprets a datetime string as Cancún wall-clock time', () => {
    const date = parseCancunDate('2026-10-01T19:30');

    expect(date.toISOString()).toBe('2026-10-01T19:30:00.000-05:00');
  });

  // Regression: a bare "YYYY-MM-DD" string is parsed by the underlying Date
  // as UTC midnight, which TZDate then shows as the previous evening in
  // Cancún (-05:00). We normalize by appending T00:00 before parsing.
  it('interprets a date-only string as Cancún midnight, not UTC midnight', () => {
    const date = parseCancunDate('2026-10-01');

    expect(date.toISOString()).toBe('2026-10-01T00:00:00.000-05:00');
  });
});
