import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEventById } from '@/features/events/api/events';
import type { Event } from '@/features/events/schema';

export function useEvent(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventById(id),
    initialData: () => {
      const cachedEvents = queryClient.getQueryData<Event[]>(['events']);
      if (!cachedEvents) return undefined;
      return cachedEvents.find((event) => event.id === id) ?? null;
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(['events'])?.dataUpdatedAt,
  });
}
