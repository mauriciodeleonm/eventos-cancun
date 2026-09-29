import { parseEvents } from '@/features/events/api/events';

const baseEvent = {
  id: 'evento-base-a1b2',
  name: 'Evento base',
  startDate: '2026-10-01T19:00',
  venueName: 'Venue de prueba',
  price: 0,
  description: 'Descripción de prueba.',
  category: 'otro',
};

describe('parseEvents', () => {
  it('keeps valid events', () => {
    expect(parseEvents([baseEvent])).toEqual([baseEvent]);
  });

  it('discards invalid rows', () => {
    const invalid = { ...baseEvent, category: 'no-existe' };

    expect(parseEvents([invalid])).toEqual([]);
  });

  it('keeps only the first event when ids are duplicated', () => {
    const duplicate = { ...baseEvent, name: 'Duplicado' };

    expect(parseEvents([baseEvent, duplicate])).toEqual([baseEvent]);
  });
});
