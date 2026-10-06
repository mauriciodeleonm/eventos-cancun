import { Skeleton } from '@/components/ui/skeleton';

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-md bg-card p-2 pb-3.5">
      <Skeleton className="aspect-video rounded-[6px]" />
      <div className="flex flex-col gap-2.25 px-1.5 pt-0.5">
        <Skeleton className="h-2.5 w-16 rounded" />
        <Skeleton className="h-4 w-[82%] rounded" />
        <Skeleton className="h-2.75 w-[46%] rounded" />
        <Skeleton className="h-2.75 w-[62%] rounded" />
        <Skeleton className="mt-0.5 h-3.25 w-14 rounded" />
      </div>
    </div>
  );
}
