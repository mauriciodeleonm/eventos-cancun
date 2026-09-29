import { eventSchema } from '@/features/events/schema';

const validEvent = {
  id: 'festival-jazz-a7c2',
  name: 'Festival de Jazz',
  startDate: '2026-10-04T20:00',
  venueName: 'Parque de las Palapas',
  price: 0,
  description: 'Un festival de jazz al aire libre.',
  category: 'musica',
};

describe('eventSchema', () => {
  it('accepts a valid event', () => {
    expect(eventSchema.safeParse(validEvent).success).toBe(true);
  });

  it('accepts a null price as an unknown cost', () => {
    const result = eventSchema.safeParse({ ...validEvent, price: null });

    expect(result.success).toBe(true);
  });

  it('accepts a date-only startDate when the time is not confirmed', () => {
    const result = eventSchema.safeParse({ ...validEvent, startDate: '2026-10-04' });

    expect(result.success).toBe(true);
  });

  it('rejects an unknown category', () => {
    const result = eventSchema.safeParse({ ...validEvent, category: 'no-existe' });

    expect(result.success).toBe(false);
  });

  it('rejects a missing id', () => {
    const withoutId: Partial<typeof validEvent> = { ...validEvent };
    delete withoutId.id;
    const result = eventSchema.safeParse(withoutId);

    expect(result.success).toBe(false);
  });
});
