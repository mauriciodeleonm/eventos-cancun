import { useParams } from 'react-router';

export function EventDetailPage() {
  const { id } = useParams();

  return (
    <>
      <h1 className="text-2xl font-bold">Detalle del evento</h1>
      <p>{id}</p>
    </>
  );
}
