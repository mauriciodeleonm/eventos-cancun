import { formatClockTime, formatTimeLabel } from '@/features/events/utils/formatTimeLabel';
import { parseCancunDate } from '@/lib/timezone';

describe('formatClockTime', () => {
  it('formats afternoon times with "p. m."', () => {
    expect(formatClockTime(parseCancunDate('2026-10-05T16:00'))).toBe('4:00 p. m.');
  });

  it('formats morning times with "a. m."', () => {
    expect(formatClockTime(parseCancunDate('2026-10-05T09:05'))).toBe('9:05 a. m.');
  });

  it('shows noon as "12:00 p. m."', () => {
    expect(formatClockTime(parseCancunDate('2026-10-05T12:00'))).toBe('12:00 p. m.');
  });

  it('shows midnight as "12:00 a. m."', () => {
    expect(formatClockTime(parseCancunDate('2026-10-05T00:00'))).toBe('12:00 a. m.');
  });
});

describe('formatTimeLabel', () => {
  it('shows "Hora por confirmar" when the event has no explicit time', () => {
    expect(formatTimeLabel({ startDate: '2026-10-05' })).toBe('Hora por confirmar');
  });

  it('shows only the start time when there is no endDate', () => {
    expect(formatTimeLabel({ startDate: '2026-10-05T19:30' })).toBe('7:30 p. m.');
  });

  it('shows a start–end range when endDate is the same day', () => {
    expect(formatTimeLabel({ startDate: '2026-10-05T16:00', endDate: '2026-10-05T20:00' })).toBe(
      '4:00 p. m. – 8:00 p. m.',
    );
  });

  it('shows only the start time when endDate falls on a different day', () => {
    expect(formatTimeLabel({ startDate: '2026-10-05T19:00', endDate: '2026-10-09T21:30' })).toBe(
      '7:00 p. m.',
    );
  });
});
