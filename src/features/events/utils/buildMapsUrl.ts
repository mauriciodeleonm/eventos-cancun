import type { Event } from '@/features/events/schema';

export function buildMapsUrl(event: Pick<Event, 'mapsUrl' | 'venueName'>): string {
  if (event.mapsUrl) return event.mapsUrl;

  const query = encodeURIComponent(`${event.venueName}, Cancún`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
