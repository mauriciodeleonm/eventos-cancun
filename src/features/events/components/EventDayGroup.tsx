import { EventCard } from '@/features/events/components/EventCard';
import type { EventDayGroup as EventDayGroupData } from '@/features/events/utils/groupByDay';

export function EventDayGroup({ group }: { group: EventDayGroupData }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{group.label}</h2>
      <div className="mt-2 flex flex-col gap-3">
        {group.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
