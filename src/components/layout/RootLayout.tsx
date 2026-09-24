import { Link, Outlet } from 'react-router';

export function RootLayout() {
  return (
    <>
      <header>
        <Link to="/">Eventos Cancún</Link>
      </header>
      <main className="mx-auto max-w-5xl">
        <Outlet />
      </main>
    </>
  );
}
