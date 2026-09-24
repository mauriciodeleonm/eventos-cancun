import { render, screen } from '@testing-library/react';
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

  it('renders the event id at /eventos/:id', () => {
    render(
      <MemoryRouter initialEntries={['/eventos/festival-jazz-a7c2']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Detalle del evento' })).toBeInTheDocument();
    expect(screen.getByText('festival-jazz-a7c2')).toBeInTheDocument();
  });

  it('renders the 404 page on an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
  });
});
