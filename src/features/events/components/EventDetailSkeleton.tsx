import { Skeleton } from '@/components/ui/skeleton';

export function EventDetailSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Cargando evento">
      <Skeleton className="aspect-4/3 w-full rounded-md" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-24" />
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
