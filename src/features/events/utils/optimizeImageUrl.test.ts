import { optimizeImageUrl } from '@/features/events/utils/optimizeImageUrl';

describe('optimizeImageUrl', () => {
  it('inserts transformation params into a Cloudinary upload url', () => {
    const url = optimizeImageUrl('https://res.cloudinary.com/demo/image/upload/sample.jpg');

    expect(url).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600/sample.jpg');
  });

  it('inserts transformation params before an existing version segment', () => {
    const url = optimizeImageUrl(
      'https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg',
    );

    expect(url).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_600/v1699999999/sample.jpg',
    );
  });

  it('returns non-Cloudinary urls unchanged', () => {
    const url = optimizeImageUrl('https://placehold.co/600x400?text=Evento');

    expect(url).toBe('https://placehold.co/600x400?text=Evento');
  });
});
