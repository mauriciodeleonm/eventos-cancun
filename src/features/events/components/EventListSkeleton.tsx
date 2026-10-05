import { Skeleton } from '@/components/ui/skeleton';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';

export function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Cargando eventos">
      {[0, 1].map((group) => (
        <section key={group}>
          <Skeleton className="mb-2 h-6 w-24" />
          <div className="flex flex-col gap-3">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </section>
      ))}
    </div>
  );
}
