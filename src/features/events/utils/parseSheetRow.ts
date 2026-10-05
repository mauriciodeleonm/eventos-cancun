import { parsePrice } from '@/features/events/utils/parsePrice';

export type SheetRow = Record<string, string>;

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim() !== '' ? value : undefined;
}

export function parseSheetRow(row: SheetRow): unknown {
  return {
    id: emptyToUndefined(row.id),
    name: emptyToUndefined(row.name),
    startDate: emptyToUndefined(row.startDate),
    endDate: emptyToUndefined(row.endDate),
    venueName: emptyToUndefined(row.venueName),
    mapsUrl: emptyToUndefined(row.mapsUrl),
    price: parsePrice(row.price ?? ''),
    priceNote: emptyToUndefined(row.priceNote),
    description: emptyToUndefined(row.description),
    imageUrl: emptyToUndefined(row.imageUrl),
    officialUrl: emptyToUndefined(row.officialUrl),
    category: emptyToUndefined(row.category),
    status: emptyToUndefined(row.status),
  };
}
