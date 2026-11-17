import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import * as eventsApi from '@/features/events/api/events';
import { useEvent } from '@/features/events/hooks/useEvent';
import type { Event } from '@/features/events/schema';

function createWrapper(
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
) {
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

  it('reuses the events list already cached by useEvents instead of re-fetching', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
    });
    const cachedEvent = { id: 'cached-event', name: 'Evento en caché' } as Event;
    queryClient.setQueryData(['events'], [cachedEvent]);

    const spy = vi.spyOn(eventsApi, 'fetchEventById');

    const { result } = renderHook(() => useEvent('cached-event'), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.data).toEqual(cachedEvent);
    expect(result.current.isSuccess).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
});
