import { PageContainer } from '@/components/layout/PageContainer';
import { EventFilters } from '@/features/events/components/EventFilters';
import { EventList } from '@/features/events/components/EventList';

export function HomePage() {
  return (
    <>
      <h1 className="sr-only">Próximos eventos</h1>
      <EventFilters />
      <PageContainer className="pt-5 pb-16">
        <EventList />
      </PageContainer>
    </>
  );
}
