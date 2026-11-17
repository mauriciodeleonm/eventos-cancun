import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, Routes } from 'react-router';
import { RootLayout } from '@/components/layout/RootLayout';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// staleTime > 0 para que useEvent reutilice la lista ya cacheada por useEvents (ver
// src/features/events/hooks/useEvent.ts) en vez de volver a pedirla/parsearla al instante.
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="eventos/:id" element={<EventDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
