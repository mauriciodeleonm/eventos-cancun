import { useQuery } from '@tanstack/react-query';
import { fetchEventById } from '@/features/events/api/events';

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventById(id),
  });
}
