import { fetchEvents, parseEvents } from '@/features/events/api/events';

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

describe('fetchEvents source switch', () => {
  const csvBody = [
    'id,name,startDate,endDate,venueName,mapsUrl,price,priceNote,description,imageUrl,officialUrl,category,status',
    'evento-sheet-z9x1,Evento del Sheet,2026-10-15T18:00,,Venue del Sheet,,0,,Descripción del Sheet.,,,cultura,',
  ].join('\n');

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses the mock data when VITE_DATA_SOURCE is not "sheet"', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock');

    const events = await fetchEvents();

    expect(events.length).toBeGreaterThanOrEqual(8);
  });

  it('fetches and parses the published CSV when VITE_DATA_SOURCE is "sheet"', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'sheet');
    vi.stubEnv('VITE_EVENTS_CSV_URL', 'https://example.com/events.csv');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve(csvBody) }),
    );

    const events = await fetchEvents();

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('Evento del Sheet');
  });

  it('throws when the CSV request fails, instead of silently returning no events', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'sheet');
    vi.stubEnv('VITE_EVENTS_CSV_URL', 'https://example.com/events.csv');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(fetchEvents()).rejects.toThrow();
  });
});
