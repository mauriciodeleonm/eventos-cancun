import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const EMPTY_STATE_ACTION_CLASS =
  'mt-2 inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-primary px-4.5 text-sm font-medium text-primary whitespace-nowrap hover:bg-primary/12 active:bg-primary/22';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  as: Heading = 'h2',
  tone = 'neutral',
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  tone?: 'neutral' | 'error';
  className?: string;
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cn('flex max-w-[440px] flex-col items-start gap-3 py-12', className)}
    >
      <span
        className={cn(
          'grid size-12 place-items-center rounded-full border',
          tone === 'error'
            ? 'border-[oklch(0.5_0.08_25)] text-[oklch(0.82_0.08_25)]'
            : 'border-neutral-700 text-neutral-300',
        )}
      >
        <Icon size={22} aria-hidden="true" />
      </span>
      <Heading className="mt-2 text-[22px]">{title}</Heading>
      {description && <p className="text-sm text-pretty text-neutral-400">{description}</p>}
      {action}
    </div>
  );
}
