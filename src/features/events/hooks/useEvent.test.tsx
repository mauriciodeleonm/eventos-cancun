import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useEvent } from '@/features/events/hooks/useEvent';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useEvent', () => {
  it('returns the event that matches the given id', async () => {
    const { result } = renderHook(() => useEvent('cine-bajo-las-estrellas-k3f9'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.name).toBe('Cine bajo las estrellas');
  });

  it('returns undefined for an id that does not exist', async () => {
    const { result } = renderHook(() => useEvent('id-inexistente'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
