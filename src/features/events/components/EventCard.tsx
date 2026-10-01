import { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { CATEGORY_FALLBACK_IMAGE } from '@/features/events/constants';
import type { Event } from '@/features/events/schema';
import { buildMapsUrl } from '@/features/events/utils/buildMapsUrl';
import { hasExplicitTime, parseCancunDate } from '@/lib/timezone';
import { cn } from '@/lib/utils';

function formatTimeLabel(event: Pick<Event, 'startDate'>): string {
  if (!hasExplicitTime(event.startDate)) return 'Hora por confirmar';
  return format(parseCancunDate(event.startDate), 'HH:mm');
}

function formatPriceLabel(price: number): string {
  return `$${new Intl.NumberFormat('es-MX').format(price)} MXN`;
}

function PriceInfo({ event }: { event: Pick<Event, 'price' | 'priceNote' | 'officialUrl'> }) {
  if (event.price === 0) {
    return <p className="text-sm font-medium">Gratis</p>;
  }

  if (event.price === null) {
    return event.officialUrl ? (
      <a
        href={event.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium hover:underline"
      >
        Consultar costo
      </a>
    ) : (
      <p className="text-sm font-medium">Consultar costo</p>
    );
  }

  return (
    <div className="text-sm">
      <p className="font-medium">{formatPriceLabel(event.price)}</p>
      {event.priceNote && <p className="text-muted-foreground">{event.priceNote}</p>}
    </div>
  );
}

export function EventCard({ event }: { event: Event }) {
  const fallbackImage = CATEGORY_FALLBACK_IMAGE[event.category];
  const [imageSrc, setImageSrc] = useState(event.imageUrl ?? fallbackImage);

  return (
    <article className="flex gap-4 rounded-lg border border-border p-3">
      <img
        src={imageSrc}
        alt={event.name}
        loading="lazy"
        className="aspect-video w-32 shrink-0 rounded-md object-cover"
        onError={() => setImageSrc(fallbackImage)}
      />
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn('font-semibold', event.status === 'cancelado' && 'line-through')}>
            <Link to={`/eventos/${event.id}`} className="hover:underline">
              {event.name}
            </Link>
          </h3>
          <EventStatusBadge status={event.status} />
        </div>
        <p className="text-sm text-muted-foreground">{formatTimeLabel(event)}</p>
        <a
          href={buildMapsUrl(event)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground hover:underline"
        >
          {event.venueName}
        </a>
        <PriceInfo event={event} />
      </div>
    </article>
  );
}
