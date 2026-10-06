import { Skeleton } from '@/components/ui/skeleton';
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton';

const SKELETON_GROUPS = [3, 2];

export function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-8" role="status" aria-label="Cargando eventos">
      {SKELETON_GROUPS.map((cardCount, i) => (
        <section key={i} className="flex flex-col gap-3.5">
          <Skeleton className="h-5 w-30 rounded-[6px]" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
            {Array.from({ length: cardCount }).map((_, j) => (
              <EventCardSkeleton key={j} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
