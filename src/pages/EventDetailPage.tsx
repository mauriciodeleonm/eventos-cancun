import { format } from 'date-fns';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CalendarX,
  Clock,
  ExternalLink,
  History,
  MapPin,
  RotateCcw,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { EmptyState, EMPTY_STATE_ACTION_CLASS } from '@/components/EmptyState';
import { PageContainer } from '@/components/layout/PageContainer';
import { EventDetailSkeleton } from '@/features/events/components/EventDetailSkeleton';
import { EventGallery } from '@/features/events/components/EventGallery';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { CATEGORY_ICONS, CATEGORY_LABELS, categoryColor } from '@/features/events/constants';
import { useEvent } from '@/features/events/hooks/useEvent';
import type { Event } from '@/features/events/schema';
import { buildMapsUrl } from '@/features/events/utils/buildMapsUrl';
import { formatDateLine, formatLongDay, isMultiDay } from '@/features/events/utils/formatDateLine';
import { formatPriceLabel } from '@/features/events/utils/formatPriceLabel';
import { formatClockTime, formatTimeLabel } from '@/features/events/utils/formatTimeLabel';
import { getComputedStatus } from '@/features/events/utils/getComputedStatus';
import { hasExplicitTime, parseCancunDate } from '@/lib/timezone';
import { cn } from '@/lib/utils';

function formatTimeLine(event: Pick<Event, 'startDate' | 'endDate'>): string {
  if (!hasExplicitTime(event.startDate)) return 'Hora por confirmar';
  if (isMultiDay(event)) {
    return `Todos los días a las ${formatClockTime(parseCancunDate(event.startDate))}`;
  }
  return formatTimeLabel(event);
}

function formatPastNote(event: Pick<Event, 'startDate'>): string {
  const date = parseCancunDate(event.startDate);
  return `Se realizó el ${formatLongDay(date)} de ${format(date, 'yyyy')}.`;
}

function PriceInfo({ event }: { event: Pick<Event, 'price' | 'priceNote' | 'officialUrl'> }) {
  const label =
    event.price === 0
      ? 'Gratis'
      : event.price === null
        ? 'Consultar costo'
        : formatPriceLabel(event.price);
  const colorClass =
    event.price === 0 ? 'text-brand-300' : event.price === null ? 'text-neutral-400' : '';

  return (
    <>
      {event.officialUrl ? (
        <a
          href={event.officialUrl}
          target="_blank"
          rel="noreferrer"
          className={cn('hover:underline', colorClass)}
        >
          {label}
        </a>
      ) : (
        <span className={colorClass}>{label}</span>
      )}
      {event.price !== null && event.price !== 0 && event.priceNote && (
        <span className="mt-0.5 block text-[13px] text-neutral-400">{event.priceNote}</span>
      )}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3.5 py-3.5">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-neutral-500">{label}</span>
        <span className="text-[15px]">{children}</span>
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { id = '' } = useParams();
  const { data: event, isPending, isError, refetch } = useEvent(id);

  if (isPending) {
    return (
      <PageContainer narrow className="py-6">
        <EventDetailSkeleton />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer narrow className="pt-14 pb-20">
        <EmptyState
          as="h1"
          tone="error"
          icon={AlertTriangle}
          title="No pudimos cargar este evento"
          description="Algo falló al conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
          action={
            <button type="button" onClick={() => refetch()} className={EMPTY_STATE_ACTION_CLASS}>
              <RotateCcw size={16} aria-hidden="true" />
              Reintentar
            </button>
          }
        />
      </PageContainer>
    );
  }

  if (!event) {
    return (
      <PageContainer narrow className="pt-14 pb-20">
        <EmptyState
          as="h1"
          icon={CalendarX}
          title="No encontramos este evento"
          description="Puede que el enlace esté incompleto o que el evento se haya retirado de la agenda."
          action={
            <Link to="/" className={EMPTY_STATE_ACTION_CLASS}>
              <ArrowLeft size={18} aria-hidden="true" />
              Ver todos los eventos
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[event.category];
  const cancelled = event.status === 'cancelado';
  const isFinished = getComputedStatus(event) === 'finalizado';

  return (
    <PageContainer narrow className="flex flex-col gap-5 pt-1 pb-18">
      <Link
        to="/"
        className="-ml-1 inline-flex h-11 w-fit items-center gap-1.5 rounded-md py-0 pr-2 pl-1 text-sm font-medium text-primary hover:bg-primary/10"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Todos los eventos
      </Link>

      {isFinished && (
        <div className="flex items-start gap-3 rounded-md bg-neutral-900 p-3.5 shadow-[0_0_0_1px_var(--color-neutral-800)]">
          <History className="mt-px size-4.5 shrink-0 text-neutral-300" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <strong className="text-sm font-medium">Este evento ya terminó</strong>
            <span className="text-[13px] text-pretty text-neutral-400">
              {formatPastNote(event)}{' '}
              <Link to="/" className="hover:underline">
                Ver los eventos de esta semana
              </Link>
            </span>
          </div>
        </div>
      )}

      <EventGallery event={event} className="rounded-lg" />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-neutral-400">
            <CategoryIcon
              className="size-3.5"
              style={{ color: categoryColor(event.category) }}
              aria-hidden="true"
            />
            {CATEGORY_LABELS[event.category]}
          </span>
          <EventStatusBadge status={event.status} size="md" />
        </div>
        <h1
          className={cn(
            'text-[clamp(28px,6vw,40px)] leading-[1.1] text-balance',
            cancelled ? 'text-neutral-400 line-through decoration-neutral-500' : 'text-foreground',
          )}
        >
          {event.name}
        </h1>
      </div>

      <div className="flex flex-col">
        <InfoRow icon={Calendar} label="Fecha">
          {formatDateLine(event)}
        </InfoRow>
        <InfoRow icon={Clock} label="Horario">
          {formatTimeLine(event)}
        </InfoRow>
        <a
          href={buildMapsUrl(event)}
          target="_blank"
          rel="noreferrer"
          className="-mx-3 flex gap-3.5 rounded-md px-3 py-3.5 hover:bg-foreground/5"
        >
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-xs text-neutral-500">Lugar</span>
            <span className="text-[15px]">{event.venueName}</span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-brand-300">
              Abrir en el mapa
              <ExternalLink size={13} aria-hidden="true" />
            </span>
          </div>
        </a>
        <InfoRow icon={Ticket} label="Precio">
          <PriceInfo event={event} />
        </InfoRow>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <h2 className="text-xs tracking-[0.08em] text-neutral-500 uppercase">Acerca del evento</h2>
        <p className="max-w-[62ch] text-[15px] leading-[1.65] text-pretty text-neutral-200">
          {event.description}
        </p>
      </div>
    </PageContainer>
  );
}
