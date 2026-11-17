import { parseImageUrls } from '@/features/events/utils/parseImageUrls';

describe('parseImageUrls', () => {
  it('returns undefined for an empty or missing cell', () => {
    expect(parseImageUrls('')).toBeUndefined();
    expect(parseImageUrls(undefined)).toBeUndefined();
  });

  it('returns a single-element array for one URL', () => {
    expect(parseImageUrls('https://example.com/a.jpg')).toEqual(['https://example.com/a.jpg']);
  });

  it('splits multiple comma-separated URLs and trims whitespace', () => {
    expect(
      parseImageUrls(
        'https://example.com/a.jpg, https://example.com/b.jpg ,https://example.com/c.jpg',
      ),
    ).toEqual([
      'https://example.com/a.jpg',
      'https://example.com/b.jpg',
      'https://example.com/c.jpg',
    ]);
  });

  it('ignores empty entries caused by trailing or duplicate commas', () => {
    expect(parseImageUrls('https://example.com/a.jpg,,')).toEqual(['https://example.com/a.jpg']);
  });
});
