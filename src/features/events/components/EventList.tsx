import { EventDayGroup } from '@/features/events/components/EventDayGroup';
import { EventListSkeleton } from '@/features/events/components/EventListSkeleton';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { useEvents } from '@/features/events/hooks/useEvents';
import { filterEvents } from '@/features/events/utils/filterEvents';
import { groupByDay } from '@/features/events/utils/groupByDay';

export function EventList() {
  const { data: events, isPending, isError } = useEvents();
  const { filters } = useEventFilters();

  if (isPending) {
    return <EventListSkeleton />;
  }

  if (isError) {
    return <p className="text-destructive">Ocurrió un error al cargar los eventos.</p>;
  }

  const hasActiveFilters = Boolean(filters.categoria?.length || filters.rango || filters.gratis);
  const groups = groupByDay(filterEvents(events, filters));

  if (groups.length === 0) {
    return (
      <p className="text-muted-foreground">
        {hasActiveFilters
          ? 'No hay eventos que coincidan con los filtros.'
          : 'No hay eventos próximos por ahora.'}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <EventDayGroup key={group.key} group={group} />
      ))}
    </div>
  );
}
