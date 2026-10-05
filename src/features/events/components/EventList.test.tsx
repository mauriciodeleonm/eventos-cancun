import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { EventList } from '@/features/events/components/EventList';

function renderEventList() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EventList />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('EventList', () => {
  it('shows a loading skeleton while fetching', () => {
    renderEventList();

    expect(screen.getByRole('status', { name: 'Cargando eventos' })).toBeInTheDocument();
  });

  it('renders the fetched events grouped by day once loaded', async () => {
    renderEventList();

    await waitFor(() =>
      expect(screen.queryByRole('status', { name: 'Cargando eventos' })).not.toBeInTheDocument(),
    );

    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });
});
