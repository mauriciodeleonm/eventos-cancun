import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { EVENT_CATEGORIES, type EventCategory } from '@/features/events/constants';
import {
  DATE_RANGES,
  type DateRange,
  type EventFiltersState,
} from '@/features/events/utils/filterEvents';

function isEventCategory(value: string): value is EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(value);
}

function isDateRange(value: string): value is DateRange {
  return (DATE_RANGES as readonly string[]).includes(value);
}

function parseFilters(searchParams: URLSearchParams): EventFiltersState {
  const categoria = searchParams.getAll('categoria').filter(isEventCategory);
  const rangoRaw = searchParams.get('rango');
  const rango = rangoRaw && isDateRange(rangoRaw) ? rangoRaw : undefined;
  const gratis = searchParams.get('gratis') === 'true';

  return {
    ...(categoria.length > 0 && { categoria }),
    ...(rango && { rango }),
    ...(gratis && { gratis }),
  };
}

export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  function setFilters(partial: Partial<EventFiltersState>) {
    const next: EventFiltersState = { ...filters, ...partial };

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.delete('categoria');
        params.delete('rango');
        params.delete('gratis');

        next.categoria?.forEach((category) => params.append('categoria', category));
        if (next.rango) params.set('rango', next.rango);
        if (next.gratis) params.set('gratis', 'true');

        return params;
      },
      { replace: true },
    );
  }

  return { filters, setFilters };
}
