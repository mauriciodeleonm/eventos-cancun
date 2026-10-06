import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={cn('mx-auto px-5', narrow ? 'max-w-190' : 'max-w-5xl', className)}>
      {children}
    </div>
  );
}
