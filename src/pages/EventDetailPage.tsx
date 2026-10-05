import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link, useParams } from 'react-router';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { CATEGORY_FALLBACK_IMAGE } from '@/features/events/constants';
import { useEvent } from '@/features/events/hooks/useEvent';
import type { Event } from '@/features/events/schema';
import { buildMapsUrl } from '@/features/events/utils/buildMapsUrl';
import { getComputedStatus } from '@/features/events/utils/getComputedStatus';
import { hasExplicitTime, parseCancunDate } from '@/lib/timezone';
import { capitalize, cn } from '@/lib/utils';

function formatDateTime(dateString: string): string {
  const date = parseCancunDate(dateString);
  const datePart = capitalize(format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }));

  if (!hasExplicitTime(dateString)) {
    return `${datePart} · Hora por confirmar`;
  }

  return `${datePart} · ${format(date, 'HH:mm')}`;
}

function formatPriceLabel(price: number): string {
  return `$${new Intl.NumberFormat('es-MX').format(price)} MXN`;
}

function PriceInfo({ event }: { event: Pick<Event, 'price' | 'priceNote' | 'officialUrl'> }) {
  if (event.price === 0) {
    return <p className="text-lg font-semibold">Gratis</p>;
  }

  if (event.price === null) {
    return event.officialUrl ? (
      <a
        href={event.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="text-lg font-semibold hover:underline"
      >
        Consultar costo
      </a>
    ) : (
      <p className="text-lg font-semibold">Consultar costo</p>
    );
  }

  return (
    <div>
      <p className="text-lg font-semibold">{formatPriceLabel(event.price)}</p>
      {event.priceNote && <p className="text-sm text-muted-foreground">{event.priceNote}</p>}
    </div>
  );
}

export function EventDetailPage() {
  const { id = '' } = useParams();
  const { data: event, isPending, isError } = useEvent(id);

  if (isPending) {
    return <p>Cargando evento…</p>;
  }

  if (isError) {
    return <p>Ocurrió un error al cargar el evento.</p>;
  }

  if (!event) {
    return (
      <>
        <h1 className="text-2xl font-bold">Evento no encontrado</h1>
        <Link to="/" className="hover:underline">
          Volver al listado
        </Link>
      </>
    );
  }

  const isFinished = getComputedStatus(event) === 'finalizado';

  return (
    <article className="flex flex-col gap-3">
      <img
        src={event.imageUrl ?? CATEGORY_FALLBACK_IMAGE[event.category]}
        alt={event.name}
        className="aspect-video w-full rounded-md object-cover"
      />
      <div className="flex items-start justify-between gap-2">
        <h1 className={cn('text-2xl font-bold', event.status === 'cancelado' && 'line-through')}>
          {event.name}
        </h1>
        <EventStatusBadge status={event.status} />
      </div>
      {isFinished && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Este evento ya terminó.
        </p>
      )}
      <p className="text-muted-foreground">{formatDateTime(event.startDate)}</p>
      <a
        href={buildMapsUrl(event)}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:underline"
      >
        {event.venueName}
      </a>
      <PriceInfo event={event} />
      <p>{event.description}</p>
    </article>
  );
}
