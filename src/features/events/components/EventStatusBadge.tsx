import type { Event } from '@/features/events/schema';
import { cn } from '@/lib/utils';

type CapturedStatus = Exclude<NonNullable<Event['status']>, 'programado'>;

const STATUS_LABELS: Record<CapturedStatus, string> = {
  cancelado: 'Cancelado',
  pospuesto: 'Pospuesto',
  reprogramado: 'Nueva fecha',
  agotado: 'Agotado',
};

const STATUS_CLASSES: Record<CapturedStatus, string> = {
  cancelado: 'bg-[var(--status-cancelado-bg)] text-[var(--status-cancelado-fg)]',
  pospuesto: 'bg-[var(--status-pospuesto-bg)] text-[var(--status-pospuesto-fg)]',
  reprogramado: 'bg-[var(--status-reprogramado-bg)] text-[var(--status-reprogramado-fg)]',
  agotado: 'bg-[var(--color-neutral-800)] text-[var(--color-neutral-200)]',
};

export function EventStatusBadge({
  status,
  size = 'sm',
}: {
  status?: Event['status'];
  size?: 'sm' | 'md';
}) {
  if (!status || status === 'programado') return null;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[6px] tracking-[0.02em] whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.75 text-xs',
        STATUS_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
