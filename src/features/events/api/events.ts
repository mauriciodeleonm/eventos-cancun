import Papa from 'papaparse';
import mockEvents from '@/features/events/data/mock-events';
import { eventSchema, type Event } from '@/features/events/schema';
import { parseSheetRow, type SheetRow } from '@/features/events/utils/parseSheetRow';

const MOCK_DELAY_MS = 300;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseEvents(rawEvents: unknown[]): Event[] {
  const seenIds = new Set<string>();
  const events: Event[] = [];

  for (const raw of rawEvents) {
    const result = eventSchema.safeParse(raw);

    if (!result.success) {
      console.warn('Evento inválido, se descarta:', result.error.message, raw);
      continue;
    }

    if (seenIds.has(result.data.id)) {
      console.warn(`Id de evento duplicado "${result.data.id}", se conserva la primera aparición.`);
      continue;
    }

    seenIds.add(result.data.id);
    events.push(result.data);
  }

  return events;
}

async function fetchMockEvents(): Promise<Event[]> {
  await delay(MOCK_DELAY_MS);
  return parseEvents(mockEvents);
}

async function fetchSheetEvents(): Promise<Event[]> {
  const csvUrl = import.meta.env.VITE_EVENTS_CSV_URL;

  if (!csvUrl) {
    throw new Error(
      'VITE_EVENTS_CSV_URL no está configurada (VITE_DATA_SOURCE=sheet la requiere).',
    );
  }

  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error(`No se pudo obtener el CSV de eventos (status ${response.status}).`);
  }

  const csvText = await response.text();
  const { data } = Papa.parse<SheetRow>(csvText, { header: true, skipEmptyLines: true });

  return parseEvents(data.map(parseSheetRow));
}

export async function fetchEvents(): Promise<Event[]> {
  return import.meta.env.VITE_DATA_SOURCE === 'sheet' ? fetchSheetEvents() : fetchMockEvents();
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const events = await fetchEvents();
  return events.find((event) => event.id === id) ?? null;
}
