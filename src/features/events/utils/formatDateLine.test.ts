import { formatDateLine } from '@/features/events/utils/formatDateLine';

describe('formatDateLine', () => {
  it('formats a single-day event with its year, capitalized', () => {
    expect(formatDateLine({ startDate: '2026-10-01T19:30' })).toBe('Jueves 1 de octubre de 2026');
  });

  it('formats a multi-day event within the same year, showing the year once', () => {
    expect(formatDateLine({ startDate: '2026-10-24T11:00', endDate: '2026-10-25T21:00' })).toBe(
      'Del sábado 24 de octubre al domingo 25 de octubre de 2026',
    );
  });

  it('shows both years when a multi-day event crosses a year boundary', () => {
    expect(formatDateLine({ startDate: '2026-12-30T20:00', endDate: '2027-01-02T20:00' })).toBe(
      'Del miércoles 30 de diciembre de 2026 al sábado 2 de enero de 2027',
    );
  });
});
