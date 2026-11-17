import { LayoutGrid } from 'lucide-react';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  EVENT_CATEGORIES,
  categoryColor,
  type EventCategory,
} from '@/features/events/constants';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { DATE_RANGE_LABELS, DATE_RANGES } from '@/features/events/utils/filterEvents';
import { cn } from '@/lib/utils';

const CHIP_BASE =
  'inline-flex h-10 shrink-0 items-center gap-1.75 rounded-full border px-3.5 text-[13px] whitespace-nowrap';

function chipClass(active: boolean): string {
  return cn(
    CHIP_BASE,
    active
      ? 'border-primary bg-primary/14 text-brand-200'
      : 'border-border text-neutral-300 hover:bg-foreground/7 hover:text-foreground',
  );
}

const SEG_OPTION =
  'relative flex cursor-pointer items-center px-3.5 py-2.5 text-[13px] first:rounded-l-md last:rounded-r-md has-[:checked]:text-primary has-[:checked]:shadow-[inset_0_0_0_1px_var(--primary)] hover:bg-foreground/7 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-primary';

export function EventFilters() {
  const { filters, setFilters } = useEventFilters();
  const selectedCategories = filters.categoria ?? [];
  const noCategoryFilter = selectedCategories.length === 0;

  function toggleCategory(category: EventCategory) {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setFilters({ categoria: next.length > 0 ? next : undefined });
  }

  return (
    <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md">
      <fieldset className="mx-auto flex max-w-5xl min-w-0 flex-col gap-2.5 border-none p-0 pt-2 pb-3">
        <legend className="sr-only">Filtrar eventos</legend>

        <div
          role="group"
          aria-label="Categorías"
          className="flex min-w-0 gap-2 overflow-x-auto px-5 py-0.5"
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={noCategoryFilter}
            aria-label="Todas las categorías"
            onClick={() => setFilters({ categoria: undefined })}
            className={chipClass(noCategoryFilter)}
          >
            <LayoutGrid className="size-3.5" aria-hidden="true" />
            Todas
          </button>
          {EVENT_CATEGORIES.map((category) => {
            const CategoryIcon = CATEGORY_ICONS[category];
            const active = selectedCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggleCategory(category)}
                className={chipClass(active)}
              >
                <CategoryIcon
                  className="size-3.5"
                  style={{ color: categoryColor(category) }}
                  aria-hidden="true"
                />
                {CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 px-5">
          <div className="max-w-full min-w-0 overflow-x-auto">
            <div
              role="radiogroup"
              aria-label="Rango de fechas"
              className="inline-flex overflow-hidden rounded-md border border-border whitespace-nowrap"
            >
              <label className={SEG_OPTION}>
                <input
                  type="radio"
                  name="rango"
                  className="sr-only"
                  checked={!filters.rango}
                  onChange={() => setFilters({ rango: undefined })}
                />
                Cualquier fecha
              </label>
              {DATE_RANGES.map((rango) => (
                <label key={rango} className={cn(SEG_OPTION, 'border-l border-border')}>
                  <input
                    type="radio"
                    name="rango"
                    className="sr-only"
                    checked={filters.rango === rango}
                    onChange={() => setFilters({ rango })}
                  />
                  {DATE_RANGE_LABELS[rango]}
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={filters.gratis ?? false}
            aria-label="Solo gratis"
            onClick={() => setFilters({ gratis: filters.gratis ? undefined : true })}
            className="inline-flex h-10 items-center gap-2.5 bg-transparent text-[13px] text-foreground"
          >
            <span
              className={cn(
                'flex h-5.5 w-9 items-center rounded-full border p-0.75',
                filters.gratis
                  ? 'justify-end border-primary bg-brand-800'
                  : 'justify-start border-neutral-700',
              )}
            >
              <span
                className={cn(
                  'size-3.5 rounded-full',
                  filters.gratis ? 'bg-brand-300' : 'bg-neutral-500',
                )}
              />
            </span>
            <span>Solo gratis</span>
          </button>
        </div>
      </fieldset>

      <div className="h-px bg-[linear-gradient(to_right,transparent,var(--border)_48px,var(--border)_calc(100%-48px),transparent)]" />
    </div>
  );
}
