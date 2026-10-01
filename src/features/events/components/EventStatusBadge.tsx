import { Badge } from '@/components/ui/badge';
import type { Event } from '@/features/events/schema';

const STATUS_LABELS: Record<
  Exclude<NonNullable<Event['status']>, 'programado'>,
  { label: string; variant: 'destructive' | 'secondary' | 'outline'; className?: string }
> = {
  cancelado: { label: 'Cancelado', variant: 'destructive' },
  pospuesto: {
    label: 'Pospuesto',
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400',
  },
  reprogramado: { label: 'Nueva fecha', variant: 'outline' },
  agotado: { label: 'Agotado', variant: 'secondary' },
};

export function EventStatusBadge({ status }: { status?: Event['status'] }) {
  if (!status || status === 'programado') return null;

  const { label, variant, className } = STATUS_LABELS[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
