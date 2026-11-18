import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '@/features/events/constants';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/, {
  message: 'La fecha debe tener el formato YYYY-MM-DD o YYYY-MM-DDTHH:mm',
});

export const eventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  venueName: z.string().min(1),
  mapsUrl: z.string().url().optional(),
  price: z.number().nullable(),
  priceNote: z.string().optional(),
  description: z.string().min(1),
  imageUrls: z.array(z.string().url()).min(1).optional(),
  officialUrl: z.string().url().optional(),
  authorName: z.string().optional(),
  authorUrl: z.string().url().optional(),
  category: z.enum(EVENT_CATEGORIES),
  status: z.enum(EVENT_STATUSES).optional(),
});

export type Event = z.infer<typeof eventSchema>;
