import { useState } from 'react';
import {
  CATEGORY_ICONS,
  categoryBackgroundTint,
  categoryIconTint,
} from '@/features/events/constants';
import type { Event } from '@/features/events/schema';
import { optimizeImageUrl } from '@/features/events/utils/optimizeImageUrl';
import { cn } from '@/lib/utils';

export function EventImage({
  event,
  className,
  iconSize = 30,
}: {
  event: Pick<Event, 'name' | 'category' | 'imageUrls' | 'status'>;
  className?: string;
  iconSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[event.category];
  const opacity = event.status === 'cancelado' ? 0.45 : 1;
  const imageUrl = event.imageUrls?.[0];

  if (!imageUrl || failed) {
    return (
      <div
        className={cn('flex aspect-video items-center justify-center overflow-hidden', className)}
        style={{ background: categoryBackgroundTint(event.category), opacity }}
      >
        <CategoryIcon
          size={iconSize}
          strokeWidth={1.5}
          style={{ color: categoryIconTint(event.category) }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={optimizeImageUrl(imageUrl)}
      alt={event.name}
      loading="lazy"
      className={cn('aspect-video object-cover', className)}
      style={{ opacity }}
      onError={() => setFailed(true)}
    />
  );
}
