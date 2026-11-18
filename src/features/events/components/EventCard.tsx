import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { EventImage } from '@/features/events/components/EventImage';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { CATEGORY_ICONS, CATEGORY_LABELS, categoryColor } from '@/features/events/constants';
import type { Event } from '@/features/events/schema';
import { buildMapsUrl } from '@/features/events/utils/buildMapsUrl';
import { formatPriceLabel } from '@/features/events/utils/formatPriceLabel';
import { formatTimeLabel } from '@/features/events/utils/formatTimeLabel';
import { parseCancunDate } from '@/lib/timezone';
import { cn } from '@/lib/utils';

function formatUntilLabel(event: Pick<Event, 'startDate' | 'endDate'>): string | null {
  if (!event.endDate || event.endDate.slice(0, 10) === event.startDate.slice(0, 10)) return null;
  return `Hasta el ${format(parseCancunDate(event.endDate), "EEEE d 'de' MMMM", { locale: es })}`;
}

function PriceInfo({ event }: { event: Pick<Event, 'price' | 'priceNote' | 'officialUrl'> }) {
  const label =
    event.price === 0
      ? 'Gratis'
      : event.price === null
        ? 'Consultar costo'
        : formatPriceLabel(event.price);
  const colorClass =
    event.price === 0
      ? 'text-brand-300'
      : event.price === null
        ? 'text-neutral-400'
        : 'text-foreground';

  return (
    <div className="text-sm">
      {event.officialUrl ? (
        <a
          href={event.officialUrl}
          target="_blank"
          rel="noreferrer"
          className={cn('font-medium hover:underline', colorClass)}
        >
          {label}
        </a>
      ) : (
        <p className={cn('font-medium', colorClass)}>{label}</p>
      )}
      {event.price !== null && event.price !== 0 && event.priceNote && (
        <p className="text-neutral-400">{event.priceNote}</p>
      )}
    </div>
  );
}

export function EventCard({ event }: { event: Event }) {
  const CategoryIcon = CATEGORY_ICONS[event.category];
  const until = formatUntilLabel(event);
  const cancelled = event.status === 'cancelado';

  return (
    <article className="flex flex-col gap-2.5 rounded-md bg-card p-2 pb-3.5 hover:bg-neutral-900">
      <EventImage event={event} className="rounded-[6px]" iconSize={30} />
      <div className="flex flex-col gap-1.5 px-1.5 pt-0.5">
        <div className="flex min-h-5 items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
            <CategoryIcon
              className="size-3.5"
              style={{ color: categoryColor(event.category) }}
              aria-hidden="true"
            />
            {CATEGORY_LABELS[event.category]}
          </span>
          <EventStatusBadge status={event.status} />
        </div>
        <h3
          className={cn(
            'text-[17px] leading-tight',
            cancelled ? 'text-neutral-400 line-through decoration-neutral-500' : 'text-foreground',
          )}
        >
          <Link to={`/eventos/${event.id}`} className="hover:underline">
            {event.name}
          </Link>
        </h3>
        <div className="flex flex-col gap-1 text-[13px] text-neutral-400">
          <span className="flex items-center gap-1.75">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {formatTimeLabel(event)}
          </span>
          <span className="flex min-w-0 items-center gap-1.75">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <a
              href={buildMapsUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:underline"
            >
              {event.venueName}
            </a>
          </span>
          {until && (
            <span className="flex items-center gap-1.75">
              <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
              {until}
            </span>
          )}
        </div>
        <div className="mt-1">
          <PriceInfo event={event} />
        </div>
      </div>
    </article>
  );
}
