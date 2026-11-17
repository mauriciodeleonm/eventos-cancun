import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { EventImage } from '@/features/events/components/EventImage';
import type { Event } from '@/features/events/schema';
import { optimizeImageUrl } from '@/features/events/utils/optimizeImageUrl';
import { cn } from '@/lib/utils';

export function EventGallery({
  event,
  className,
}: {
  event: Pick<Event, 'name' | 'category' | 'imageUrls' | 'status'>;
  className?: string;
}) {
  const images = event.imageUrls ?? [];
  const [index, setIndex] = useState(0);

  if (images.length <= 1) {
    return <EventImage event={event} className={className} iconSize={52} />;
  }

  const opacity = event.status === 'cancelado' ? 0.45 : 1;

  return (
    <div className={cn('relative aspect-video overflow-hidden', className)}>
      <img
        src={optimizeImageUrl(images[index])}
        alt={`${event.name} (${index + 1} de ${images.length})`}
        className="size-full object-cover"
        style={{ opacity }}
      />
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
        className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-background/70 p-1.5 text-foreground hover:bg-background/90"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Siguiente imagen"
        onClick={() => setIndex((i) => (i + 1) % images.length)}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-background/70 p-1.5 text-foreground hover:bg-background/90"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              'size-1.5 cursor-pointer rounded-full',
              i === index ? 'bg-foreground' : 'bg-foreground/40',
            )}
          />
        ))}
      </div>
    </div>
  );
}
