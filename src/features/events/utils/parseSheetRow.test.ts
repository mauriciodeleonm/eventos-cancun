import { parseEvents } from '@/features/events/api/events';
import { parseSheetRow, type SheetRow } from '@/features/events/utils/parseSheetRow';

// Real rows exported from the published Google Sheet CSV (see README.md "Fuente de datos").
const validRow: SheetRow = {
  id: 'prueba-concierto-m8k2',
  name: 'Prueba Concierto Acústico',
  startDate: '2026-10-20T20:00',
  endDate: '',
  venueName: 'Casa de la Cultura',
  mapsUrl: '',
  price: '0',
  priceNote: '',
  description: 'Evento de prueba para validar el parseo del Sheet.',
  imageUrl: '',
  officialUrl: '',
  category: 'musica',
  status: 'programado',
};

const multiDayRow: SheetRow = {
  id: 'prueba-feria-local-t4n9',
  name: 'Prueba Feria de Antojitos',
  startDate: '2026-10-24T11:00',
  endDate: '2026-10-25T21:00',
  venueName: 'Parque Las Palapas',
  mapsUrl: '',
  price: '120',
  priceNote: 'Incluye una bebida de cortesía',
  description: 'Evento de prueba multi-día para validar endDate.',
  imageUrl: '',
  officialUrl: '',
  category: 'gastronomia',
  status: 'programado',
};

const unknownPriceRow: SheetRow = {
  id: 'prueba-torneo-agotado-w1r5',
  name: 'Prueba Torneo Agotado',
  startDate: '2026-11-02T09:00',
  endDate: '',
  venueName: 'Unidad Deportiva Kabah',
  mapsUrl: '',
  price: '',
  priceNote: '',
  description: 'Evento de prueba con costo desconocido y boletos agotados.',
  imageUrl: '',
  officialUrl: 'https://example.com/prueba-torneo',
  category: 'deportes',
  status: 'agotado',
};

// Missing venueName (required) — the row the onEdit test accidentally left incomplete.
const missingVenueRow: SheetRow = {
  id: 'prueba-feria-de-molletes-ecxw',
  name: 'Prueba Feria de Molletes',
  startDate: '2026-11-03T10:00',
  endDate: '2026-11-03T14:00',
  venueName: '',
  mapsUrl: '',
  price: '',
  priceNote: '',
  description: 'Evento de prueba para onEdit en Google Sheets',
  imageUrl: '',
  officialUrl: '',
  category: 'gastronomia',
  status: 'programado',
};

describe('parseSheetRow', () => {
  it('turns empty cells into undefined instead of invalid empty strings', () => {
    const candidate = parseSheetRow(validRow) as Record<string, unknown>;

    expect(candidate.endDate).toBeUndefined();
    expect(candidate.mapsUrl).toBeUndefined();
    expect(candidate.priceNote).toBeUndefined();
  });

  it('parses the price cell with parsePrice, turning an empty cell into null', () => {
    const candidate = parseSheetRow(unknownPriceRow) as Record<string, unknown>;

    expect(candidate.price).toBeNull();
  });

  it('keeps a numeric price cell as a number', () => {
    const candidate = parseSheetRow(multiDayRow) as Record<string, unknown>;

    expect(candidate.price).toBe(120);
  });
});

describe('parseSheetRow + parseEvents (full pipeline on real sheet rows)', () => {
  it('validates good rows and discards a row missing a required field', () => {
    const rows = [validRow, multiDayRow, unknownPriceRow, missingVenueRow];
    const events = parseEvents(rows.map(parseSheetRow));

    expect(events).toHaveLength(3);
    expect(events.map((e) => e.id)).not.toContain('prueba-feria-de-molletes-ecxw');
  });

  it('keeps only the first event when the sheet has duplicate ids', () => {
    const duplicate = { ...validRow, name: 'Duplicado' };
    const events = parseEvents([validRow, duplicate].map(parseSheetRow));

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('Prueba Concierto Acústico');
  });
});
