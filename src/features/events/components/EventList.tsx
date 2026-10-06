import { AlertTriangle, CalendarX, RotateCcw, SearchX } from 'lucide-react';
import { EmptyState, EMPTY_STATE_ACTION_CLASS } from '@/components/EmptyState';
import { EventDayGroup } from '@/features/events/components/EventDayGroup';
import { EventListSkeleton } from '@/features/events/components/EventListSkeleton';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { useEvents } from '@/features/events/hooks/useEvents';
import { DATE_RANGE_LABELS, filterEvents } from '@/features/events/utils/filterEvents';
import { groupByDay } from '@/features/events/utils/groupByDay';

export function EventList() {
  const { data: events, isPending, isError, refetch } = useEvents();
  const { filters, setFilters } = useEventFilters();

  if (isPending) {
    return <EventListSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        tone="error"
        icon={AlertTriangle}
        title="No pudimos cargar los eventos"
        description="Algo falló al conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
        action={
          <button type="button" onClick={() => refetch()} className={EMPTY_STATE_ACTION_CLASS}>
            <RotateCcw size={16} aria-hidden="true" />
            Reintentar
          </button>
        }
      />
    );
  }

  const hasActiveFilters = Boolean(filters.categoria?.length || filters.rango || filters.gratis);
  const groups = groupByDay(filterEvents(events, filters));

  if (groups.length === 0) {
    return hasActiveFilters ? (
      <EmptyState
        icon={SearchX}
        title="Ningún evento coincide con tus filtros"
        description="Prueba con un rango de fechas más amplio o quita alguna categoría."
        action={
          <button
            type="button"
            onClick={() =>
              setFilters({ categoria: undefined, rango: undefined, gratis: undefined })
            }
            className={EMPTY_STATE_ACTION_CLASS}
          >
            Limpiar filtros
          </button>
        }
      />
    ) : (
      <EmptyState
        icon={CalendarX}
        title="Aún no hay eventos publicados"
        description="Estamos reuniendo la agenda de esta semana en Cancún. Vuelve en unas horas."
      />
    );
  }

  const totalEvents = groups.reduce((sum, group) => sum + group.events.length, 0);

  return (
    <div className="flex flex-col gap-9">
      <p className="text-[13px] text-neutral-500">
        {totalEvents} {totalEvents === 1 ? 'evento' : 'eventos'}
        {filters.rango && ` · ${DATE_RANGE_LABELS[filters.rango]}`}
      </p>
      {groups.map((group) => (
        <EventDayGroup key={group.key} group={group} />
      ))}
    </div>
  );
}
