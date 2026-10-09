import mockEvents from '@/features/events/data/mock-events';
import { eventSchema } from '@/features/events/schema';

describe('mock-events', () => {
  it('has at least 8 events', () => {
    expect(mockEvents.length).toBeGreaterThanOrEqual(8);
  });

  it.each(mockEvents)('event "$name" matches eventSchema', (event) => {
    const result = eventSchema.safeParse(event);

    expect(result.success).toBe(true);
  });

  it('has unique ids', () => {
    const ids = mockEvents.map((event) => event.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
