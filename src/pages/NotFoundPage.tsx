import { Home } from 'lucide-react';
import { Link } from 'react-router';
import { EMPTY_STATE_ACTION_CLASS } from '@/components/EmptyState';
import { PageContainer } from '@/components/layout/PageContainer';

export function NotFoundPage() {
  return (
    <PageContainer className="pt-14 pb-20">
      <div className="flex max-w-115 flex-col items-start gap-3">
        <span className="text-[13px] tracking-[0.08em] text-brand-300">ERROR 404</span>
        <h1 className="text-[28px]">Esta página no existe</h1>
        <p className="text-sm text-neutral-400">
          La dirección que abriste no corresponde a ninguna sección de la app.
        </p>
        <Link to="/" className={EMPTY_STATE_ACTION_CLASS}>
          <Home size={16} aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </PageContainer>
  );
}
