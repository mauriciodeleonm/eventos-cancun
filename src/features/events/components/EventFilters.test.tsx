import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router';
import { EventFilters } from '@/features/events/components/EventFilters';

function Harness() {
  const [searchParams] = useSearchParams();
  return (
    <>
      <EventFilters />
      <span data-testid="url">{searchParams.toString()}</span>
    </>
  );
}

function renderFilters(initialUrl = '/') {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Harness />
    </MemoryRouter>,
  );
}

describe('EventFilters', () => {
  it('renders a checkbox for each category', () => {
    renderFilters();

    expect(screen.getByRole('checkbox', { name: 'Música' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Deportes' })).toBeInTheDocument();
  });

  it('toggles a category on and off, updating the url', async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(screen.getByRole('checkbox', { name: 'Música' }));
    expect(screen.getByTestId('url')).toHaveTextContent('categoria=musica');

    await user.click(screen.getByRole('checkbox', { name: 'Música' }));
    expect(screen.getByTestId('url')).not.toHaveTextContent('categoria');
  });

  it('selects a date range', async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(screen.getByRole('radio', { name: 'Próximos 7 días' }));

    expect(screen.getByTestId('url')).toHaveTextContent('rango=semana');
  });

  it('toggles the "Solo gratis" switch', async () => {
    const user = userEvent.setup();
    renderFilters();

    await user.click(screen.getByRole('switch', { name: 'Solo gratis' }));

    expect(screen.getByTestId('url')).toHaveTextContent('gratis=true');
  });

  it('reflects the filters already present in the url', () => {
    renderFilters('/?categoria=musica&gratis=true');

    expect(screen.getByRole('checkbox', { name: 'Música' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Solo gratis' })).toBeChecked();
  });
});
