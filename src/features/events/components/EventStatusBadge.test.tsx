import { render, screen } from '@testing-library/react';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';

describe('EventStatusBadge', () => {
  it('renders nothing when the status is programado', () => {
    const { container } = render(<EventStatusBadge status="programado" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when there is no status', () => {
    const { container } = render(<EventStatusBadge />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Cancelado" for a cancelado event', () => {
    render(<EventStatusBadge status="cancelado" />);

    expect(screen.getByText('Cancelado')).toBeInTheDocument();
  });

  it('renders "Pospuesto" for a pospuesto event', () => {
    render(<EventStatusBadge status="pospuesto" />);

    expect(screen.getByText('Pospuesto')).toBeInTheDocument();
  });

  it('renders "Nueva fecha" for a reprogramado event', () => {
    render(<EventStatusBadge status="reprogramado" />);

    expect(screen.getByText('Nueva fecha')).toBeInTheDocument();
  });

  it('renders "Agotado" for an agotado event', () => {
    render(<EventStatusBadge status="agotado" />);

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});
