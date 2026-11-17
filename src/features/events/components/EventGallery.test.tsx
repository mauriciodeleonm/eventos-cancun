import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Event } from '@/features/events/schema';
import { EventGallery } from '@/features/events/components/EventGallery';

function makeEvent(overrides: Partial<Event>): Event {
  return {
    id: 'g1',
    name: 'Feria de prueba',
    startDate: '2026-10-01T19:30',
    venueName: 'Parque Kabah',
    price: 0,
    description: 'Descripción de prueba.',
    category: 'otro',
    ...overrides,
  };
}

describe('EventGallery', () => {
  it('shows the category icon with no carousel controls when there are no images', () => {
    const { container } = render(<EventGallery event={makeEvent({})} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Siguiente imagen' })).not.toBeInTheDocument();
  });

  it('shows a single image with no carousel controls when there is only one image', () => {
    const event = makeEvent({ imageUrls: ['https://example.com/a.jpg'] });

    render(<EventGallery event={event} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/a.jpg');
    expect(screen.queryByRole('button', { name: 'Siguiente imagen' })).not.toBeInTheDocument();
  });

  it('shows carousel controls and cycles through images when there are several', async () => {
    const user = userEvent.setup();
    const event = makeEvent({
      imageUrls: [
        'https://example.com/a.jpg',
        'https://example.com/b.jpg',
        'https://example.com/c.jpg',
      ],
    });

    render(<EventGallery event={event} />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/a.jpg');

    await user.click(screen.getByRole('button', { name: 'Siguiente imagen' }));
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/b.jpg');

    await user.click(screen.getByRole('button', { name: 'Imagen anterior' }));
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/a.jpg');

    await user.click(screen.getByRole('button', { name: 'Ver imagen 3' }));
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/c.jpg');
  });
});
