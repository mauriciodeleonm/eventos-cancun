import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { EventDetailPage } from '@/pages/EventDetailPage';

function renderDetailPage(id: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/eventos/${id}`]}>
        <Routes>
          <Route path="/eventos/:id" element={<EventDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('EventDetailPage', () => {
  it('shows a loading skeleton while fetching', () => {
    renderDetailPage('cine-bajo-las-estrellas-k3f9');

    expect(screen.getByRole('status', { name: 'Cargando evento' })).toBeInTheDocument();
  });

  it('renders the event details once loaded, without the finished notice', async () => {
    // Uses the furthest-dated non-cancelled mock event (mock dates are computed relative to
    // today, see mock-events.ts) so this test stays valid regardless of when it runs.
    renderDetailPage('festival-cine-independiente-t3y7');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Festival de Cine Independiente' }),
      ).toBeInTheDocument(),
    );

    expect(screen.getByRole('link', { name: /Cinépolis La Isla/ })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=Cin%C3%A9polis%20La%20Isla%2C%20Canc%C3%BAn',
    );
    expect(screen.queryByText('Este evento ya terminó')).not.toBeInTheDocument();
  });

  it('shows a not-found state with a link back to the listing for an unknown id', async () => {
    renderDetailPage('id-que-no-existe');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'No encontramos este evento' }),
      ).toBeInTheDocument(),
    );

    expect(screen.getByRole('link', { name: 'Ver todos los eventos' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows a notice when the event already finished, without hiding it', async () => {
    renderDetailPage('carrera-nocturna-5k-a7c2');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Carrera Nocturna 5K' })).toBeInTheDocument(),
    );

    expect(screen.getByText('Este evento ya terminó')).toBeInTheDocument();
  });

  it('strikes through the name and shows the Cancelado badge', async () => {
    renderDetailPage('concierto-rock-alternativo-m1v6');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Concierto de Rock Alternativo' }),
      ).toBeInTheDocument(),
    );

    expect(screen.getByRole('heading', { name: 'Concierto de Rock Alternativo' })).toHaveClass(
      'line-through',
    );
    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('shows the price note alongside the formatted price', async () => {
    renderDetailPage('obra-bodas-sangre-z5r0');

    await waitFor(() => expect(screen.getByText('$450 MXN')).toBeInTheDocument());

    expect(
      screen.getByText('Boletos agotados en línea, verificar disponibilidad en taquilla'),
    ).toBeInTheDocument();
  });

  it('links "Consultar costo" to officialUrl when the price is unknown', async () => {
    renderDetailPage('torneo-voleibol-playa-x7m2');

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Consultar costo' })).toBeInTheDocument(),
    );

    expect(screen.getByRole('link', { name: 'Consultar costo' })).toHaveAttribute(
      'href',
      'https://example.com/torneo-voleibol',
    );
  });
});
