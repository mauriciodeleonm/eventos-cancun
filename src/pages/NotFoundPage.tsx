import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}
