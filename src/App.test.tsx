import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

describe('App', () => {
  it('renders the home page at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Próximos eventos' })).toBeInTheDocument();
  });

  it('renders the event detail page at /eventos/:id', async () => {
    render(
      <MemoryRouter initialEntries={['/eventos/festival-cine-independiente-t3y7']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Festival de Cine Independiente' }),
      ).toBeInTheDocument(),
    );
  });

  it('renders the 404 page on an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Esta página no existe' })).toBeInTheDocument();
  });
});
