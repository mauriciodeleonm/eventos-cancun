import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useSearchParams } from 'react-router';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';

function renderWithUrl(initialUrl: string) {
  function wrapper({ children }: { children: ReactNode }) {
    return <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;
  }

  return renderHook(
    () => {
      const eventFilters = useEventFilters();
      const [searchParams] = useSearchParams();
      return { ...eventFilters, url: `?${searchParams.toString()}` };
    },
    { wrapper },
  );
}

describe('useEventFilters - reading from the URL', () => {
  it('returns no filters when there are no search params', () => {
    const { result } = renderWithUrl('/');

    expect(result.current.filters).toEqual({});
  });

  it('parses a single category', () => {
    const { result } = renderWithUrl('/?categoria=musica');

    expect(result.current.filters).toEqual({ categoria: ['musica'] });
  });

  it('parses multiple categories (repeated query param)', () => {
    const { result } = renderWithUrl('/?categoria=musica&categoria=cultura');

    expect(result.current.filters).toEqual({ categoria: ['musica', 'cultura'] });
  });

  it('ignores a category that does not exist, without breaking', () => {
    const { result } = renderWithUrl('/?categoria=musica&categoria=no-existe');

    expect(result.current.filters).toEqual({ categoria: ['musica'] });
  });

  it('parses a valid rango', () => {
    const { result } = renderWithUrl('/?rango=fin-de-semana');

    expect(result.current.filters).toEqual({ rango: 'fin-de-semana' });
  });

  it('ignores an invalid rango, without breaking', () => {
    const { result } = renderWithUrl('/?rango=siempre');

    expect(result.current.filters).toEqual({});
  });

  it('treats gratis=true as the gratis filter', () => {
    const { result } = renderWithUrl('/?gratis=true');

    expect(result.current.filters).toEqual({ gratis: true });
  });

  it('ignores gratis with any value other than "true"', () => {
    const { result } = renderWithUrl('/?gratis=yes');

    expect(result.current.filters).toEqual({});
  });

  it('parses categoria, rango, and gratis together', () => {
    const { result } = renderWithUrl('/?categoria=musica&rango=semana&gratis=true');

    expect(result.current.filters).toEqual({
      categoria: ['musica'],
      rango: 'semana',
      gratis: true,
    });
  });
});

describe('useEventFilters - writing to the URL', () => {
  it('sets a filter and reflects it in the url', () => {
    const { result } = renderWithUrl('/');

    act(() => {
      result.current.setFilters({ gratis: true });
    });

    expect(result.current.filters).toEqual({ gratis: true });
    expect(result.current.url).toBe('?gratis=true');
  });

  it('merges a new filter with the existing ones', () => {
    const { result } = renderWithUrl('/?categoria=musica');

    act(() => {
      result.current.setFilters({ rango: 'mes' });
    });

    expect(result.current.filters).toEqual({ categoria: ['musica'], rango: 'mes' });
  });

  it('clears a filter by setting it to undefined', () => {
    const { result } = renderWithUrl('/?categoria=musica&gratis=true');

    act(() => {
      result.current.setFilters({ gratis: undefined });
    });

    expect(result.current.filters).toEqual({ categoria: ['musica'] });
  });
});
