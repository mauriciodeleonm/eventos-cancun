import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EventCard } from '@/features/events/components/EventCard';
import type { EventDayGroup as EventDayGroupData } from '@/features/events/utils/groupByDay';
import { parseCancunDate } from '@/lib/timezone';
import { capitalize } from '@/lib/utils';

const RELATIVE_LABELS = new Set(['Hoy', 'Mañana']);

export function EventDayGroup({ group }: { group: EventDayGroupData }) {
  const showDate = RELATIVE_LABELS.has(group.label);

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-baseline gap-2.5">
        <h2 className="text-xl font-medium">{group.label}</h2>
        {showDate && (
          <span className="text-[13px] text-muted-foreground">
            {capitalize(format(parseCancunDate(group.key), "EEEE d 'de' MMMM", { locale: es }))}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
        {group.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
