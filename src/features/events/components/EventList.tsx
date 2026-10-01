import { EventDayGroup } from '@/features/events/components/EventDayGroup';
import { useEvents } from '@/features/events/hooks/useEvents';
import { groupByDay } from '@/features/events/utils/groupByDay';

export function EventList() {
  const { data: events, isPending, isError } = useEvents();

  if (isPending) {
    return <p>Cargando eventos…</p>;
  }

  if (isError) {
    return <p>Ocurrió un error al cargar los eventos.</p>;
  }

  const groups = groupByDay(events);

  if (groups.length === 0) {
    return <p>No hay eventos próximos por ahora.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <EventDayGroup key={group.key} group={group} />
      ))}
    </div>
  );
}
