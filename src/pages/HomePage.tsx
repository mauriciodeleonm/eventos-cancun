import { EventList } from '@/features/events/components/EventList';

export function HomePage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Próximos eventos</h1>
      <EventList />
    </>
  );
}
