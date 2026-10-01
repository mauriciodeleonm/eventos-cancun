import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Event } from '@/features/events/schema';
import { EventDayGroup } from '@/features/events/components/EventDayGroup';

function makeEvent(overrides: Partial<Event> & Pick<Event, 'id' | 'name' | 'startDate'>): Event {
  return {
    venueName: 'Parque Kabah',
    price: 0,
    description: 'Descripción de prueba.',
    category: 'otro',
    ...overrides,
  };
}

describe('EventDayGroup', () => {
  it('renders the day label as a heading and one card per event', () => {
    const group = {
      key: '2026-10-01',
      label: 'Hoy',
      events: [
        makeEvent({ id: 'a1', name: 'Evento uno', startDate: '2026-10-01T09:00' }),
        makeEvent({ id: 'a2', name: 'Evento dos', startDate: '2026-10-01T19:00' }),
      ],
    };

    render(
      <MemoryRouter>
        <EventDayGroup group={group} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Hoy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evento uno' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evento dos' })).toBeInTheDocument();
  });
});
