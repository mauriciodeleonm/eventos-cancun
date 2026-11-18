import { parseImageUrls } from '@/features/events/utils/parseImageUrls';
import { parsePrice } from '@/features/events/utils/parsePrice';
import { parseStatus } from '@/features/events/utils/parseStatus';

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
    imageUrls: parseImageUrls(row.imageUrl),
    officialUrl: emptyToUndefined(row.officialUrl),
    authorName: emptyToUndefined(row.authorName),
    authorUrl: emptyToUndefined(row.authorUrl),
    category: emptyToUndefined(row.category),
    status: parseStatus(row.status),
  };
}
