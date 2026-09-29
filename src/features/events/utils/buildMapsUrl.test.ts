import { buildMapsUrl } from '@/features/events/utils/buildMapsUrl';

describe('buildMapsUrl', () => {
  it('returns the existing mapsUrl when present', () => {
    const url = buildMapsUrl({
      mapsUrl: 'https://maps.example.com/venue',
      venueName: 'Parque Kabah',
    });

    expect(url).toBe('https://maps.example.com/venue');
  });

  it('generates a Google Maps search url with the venue name when mapsUrl is missing', () => {
    const url = buildMapsUrl({ venueName: 'Parque Kabah' });

    expect(url).toBe(
      'https://www.google.com/maps/search/?api=1&query=Parque%20Kabah%2C%20Canc%C3%BAn',
    );
  });
});
