import { parseCancunDate } from '@/lib/timezone';
import { getComputedStatus } from '@/features/events/utils/getComputedStatus';

const now = parseCancunDate('2026-09-29T12:00');

describe('getComputedStatus', () => {
  it('returns "proximo" when the event has not started', () => {
    const status = getComputedStatus({ startDate: '2026-10-01T19:30' }, now);

    expect(status).toBe('proximo');
  });

  it('returns "en-curso" when the event started and has no endDate, before end of day', () => {
    const status = getComputedStatus({ startDate: '2026-09-29T08:00' }, now);

    expect(status).toBe('en-curso');
  });

  it('returns "finalizado" the day after an event without endDate', () => {
    const status = getComputedStatus({ startDate: '2026-09-28T08:00' }, now);

    expect(status).toBe('finalizado');
  });

  it('returns "en-curso" for a multi-day event that started before today and ends after now', () => {
    const status = getComputedStatus(
      { startDate: '2026-09-27T10:00', endDate: '2026-10-02T20:00' },
      now,
    );

    expect(status).toBe('en-curso');
  });

  it('returns "finalizado" once the endDate has passed', () => {
    const status = getComputedStatus(
      { startDate: '2026-09-20T10:00', endDate: '2026-09-22T20:00' },
      now,
    );

    expect(status).toBe('finalizado');
  });
});
