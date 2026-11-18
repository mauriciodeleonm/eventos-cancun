import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Event } from '@/features/events/schema';
import { EventCard } from '@/features/events/components/EventCard';

function makeEvent(overrides: Partial<Event> & Pick<Event, 'id' | 'name' | 'startDate'>): Event {
  return {
    venueName: 'Parque Kabah',
    price: 0,
    description: 'Descripción de prueba.',
    category: 'otro',
    ...overrides,
  };
}

function renderEventCard(event: Event) {
  return render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>,
  );
}

describe('EventCard', () => {
  it('renders the event name linked to its detail page, and the venue linked to Google Maps', () => {
    const event = makeEvent({
      id: 'a1',
      name: 'Cine bajo las estrellas',
      startDate: '2026-10-01T19:30',
    });

    renderEventCard(event);

    expect(screen.getByRole('heading', { name: 'Cine bajo las estrellas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cine bajo las estrellas' })).toHaveAttribute(
      'href',
      '/eventos/a1',
    );
    const mapsLink = screen.getByRole('link', { name: 'Parque Kabah' });
    expect(mapsLink).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=Parque%20Kabah%2C%20Canc%C3%BAn',
    );
  });

  it('shows the formatted time when startDate has an explicit time', () => {
    const event = makeEvent({ id: 'a2', name: 'Evento con hora', startDate: '2026-10-01T19:30' });

    renderEventCard(event);

    expect(screen.getByText('7:30 p. m.')).toBeInTheDocument();
  });

  it('shows "Hora por confirmar" when startDate has no time', () => {
    const event = makeEvent({ id: 'a3', name: 'Evento sin hora', startDate: '2026-10-01' });

    renderEventCard(event);

    expect(screen.getByText('Hora por confirmar')).toBeInTheDocument();
  });

  it('shows "Gratis" when price is 0', () => {
    const event = makeEvent({
      id: 'a4',
      name: 'Evento gratis',
      startDate: '2026-10-01T19:30',
      price: 0,
    });

    renderEventCard(event);

    expect(screen.getByText('Gratis')).toBeInTheDocument();
  });

  it('formats a known price in MXN', () => {
    const event = makeEvent({
      id: 'a5',
      name: 'Evento con precio',
      startDate: '2026-10-01T19:30',
      price: 350,
    });

    renderEventCard(event);

    expect(screen.getByText('$350 MXN')).toBeInTheDocument();
  });

  it('shows "Consultar costo" as plain text when price is null and there is no officialUrl', () => {
    const event = makeEvent({
      id: 'a6',
      name: 'Evento sin precio',
      startDate: '2026-10-01T19:30',
      price: null,
    });

    renderEventCard(event);

    expect(screen.getByText('Consultar costo')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Consultar costo' })).not.toBeInTheDocument();
  });

  it('links "Consultar costo" to officialUrl when price is null and officialUrl exists', () => {
    const event = makeEvent({
      id: 'a7',
      name: 'Evento con boletaje externo',
      startDate: '2026-10-01T19:30',
      price: null,
      officialUrl: 'https://example.com/boletos',
    });

    renderEventCard(event);

    expect(screen.getByRole('link', { name: 'Consultar costo' })).toHaveAttribute(
      'href',
      'https://example.com/boletos',
    );
  });

  it('links a known price to officialUrl when both exist', () => {
    const event = makeEvent({
      id: 'a7b',
      name: 'Evento con precio y boletaje externo',
      startDate: '2026-10-01T19:30',
      price: 350,
      officialUrl: 'https://example.com/boletos',
    });

    renderEventCard(event);

    expect(screen.getByRole('link', { name: '$350 MXN' })).toHaveAttribute(
      'href',
      'https://example.com/boletos',
    );
  });

  it('strikes through the name and shows the status badge when cancelado', () => {
    const event = makeEvent({
      id: 'a8',
      name: 'Evento cancelado',
      startDate: '2026-10-01T19:30',
      status: 'cancelado',
    });

    renderEventCard(event);

    expect(screen.getByRole('heading', { name: 'Evento cancelado' })).toHaveClass('line-through');
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('shows the category icon instead of an image when there are no imageUrls', () => {
    const event = makeEvent({
      id: 'a9',
      name: 'Evento sin imagen',
      startDate: '2026-10-01T19:30',
      category: 'deportes',
    });

    const { container } = renderEventCard(event);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
