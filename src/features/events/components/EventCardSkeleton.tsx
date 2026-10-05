import { Skeleton } from '@/components/ui/skeleton';

export function EventCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-border p-3">
      <Skeleton className="aspect-video w-32 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
