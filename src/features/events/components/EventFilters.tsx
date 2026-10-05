import { CATEGORY_LABELS, EVENT_CATEGORIES, type EventCategory } from '@/features/events/constants';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import { DATE_RANGES, type DateRange } from '@/features/events/utils/filterEvents';

const RANGE_LABELS: Record<DateRange, string> = {
  hoy: 'Hoy',
  'fin-de-semana': 'Fin de semana',
  semana: 'Próximos 7 días',
  mes: 'Próximos 30 días',
};

export function EventFilters() {
  const { filters, setFilters } = useEventFilters();
  const selectedCategories = filters.categoria ?? [];

  function toggleCategory(category: EventCategory) {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setFilters({ categoria: next.length > 0 ? next : undefined });
  }

  return (
    <fieldset className="flex flex-wrap items-center gap-4 border-none p-0">
      <legend className="sr-only">Filtrar eventos</legend>

      <div className="flex flex-wrap gap-3">
        {EVENT_CATEGORIES.map((category) => (
          <label key={category} className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {CATEGORY_LABELS[category]}
          </label>
        ))}
      </div>

      <select
        value={filters.rango ?? ''}
        onChange={(e) =>
          setFilters({ rango: e.target.value ? (e.target.value as DateRange) : undefined })
        }
        className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        aria-label="Rango de fechas"
      >
        <option value="">Cualquier fecha</option>
        {DATE_RANGES.map((rango) => (
          <option key={rango} value={rango}>
            {RANGE_LABELS[rango]}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-1.5 text-sm">
        <input
          type="checkbox"
          checked={filters.gratis ?? false}
          onChange={(e) => setFilters({ gratis: e.target.checked ? true : undefined })}
        />
        Solo gratis
      </label>
    </fieldset>
  );
}
