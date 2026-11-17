import { Link, Outlet } from 'react-router';
import { formatWeekRangeLabel } from '@/features/events/utils/formatWeekRangeLabel';

export function RootLayout() {
  return (
    <>
      <header className="mx-auto flex max-w-5xl items-end justify-between gap-4 px-5 pt-5 pb-3">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-7 shrink-0" />
          <span className="flex flex-col gap-0.5">
            <span className="text-[19px] leading-[1.2] font-medium tracking-[-0.015em]">
              Eventos Cancún
            </span>
            <span className="text-xs text-neutral-500">{formatWeekRangeLabel()}</span>
          </span>
        </Link>
        <span className="mb-2 h-0.5 w-7 shrink-0 rounded-full bg-primary" />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
