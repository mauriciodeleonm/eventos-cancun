import mockEvents from '@/features/events/data/mock-events.json';
import { eventSchema, type Event } from '@/features/events/schema';

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

export async function fetchEvents(): Promise<Event[]> {
  await delay(MOCK_DELAY_MS);
  return parseEvents(mockEvents);
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const events = await fetchEvents();
  return events.find((event) => event.id === id) ?? null;
}
