import { formatWeekRangeLabel } from '@/features/events/utils/formatWeekRangeLabel';

describe('formatWeekRangeLabel', () => {
  it('returns the Monday-to-Sunday range for a date that is itself a Monday', () => {
    expect(formatWeekRangeLabel(new Date(2026, 9, 5))).toBe('Semana del 5 al 11 de octubre');
  });

  it('resolves the same week for any day within it', () => {
    expect(formatWeekRangeLabel(new Date(2026, 9, 8))).toBe('Semana del 5 al 11 de octubre');
    expect(formatWeekRangeLabel(new Date(2026, 9, 11))).toBe('Semana del 5 al 11 de octubre');
  });

  it('includes both month names when the week spans two months', () => {
    expect(formatWeekRangeLabel(new Date(2026, 9, 29))).toBe(
      'Semana del 26 de octubre al 1 de noviembre',
    );
  });
});
