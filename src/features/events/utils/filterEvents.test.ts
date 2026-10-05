import { addDays, format } from 'date-fns';
import type { Event } from '@/features/events/schema';
import { filterEvents } from '@/features/events/utils/filterEvents';
import { parseCancunDate } from '@/lib/timezone';

const tuesday = parseCancunDate('2026-09-29T12:00'); // confirmed Tuesday

function makeEvent(overrides: Partial<Event> & Pick<Event, 'id' | 'name' | 'startDate'>): Event {
  return {
    venueName: 'Venue de prueba',
    price: 0,
    description: 'Descripción de prueba.',
    category: 'otro',
    ...overrides,
  };
}

function iso(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

describe('filterEvents - categoria', () => {
  it('keeps only events matching the selected categories', () => {
    const musica = makeEvent({
      id: 'm1',
      name: 'Musica',
      startDate: iso(tuesday),
      category: 'musica',
    });
    const deportes = makeEvent({
      id: 'd1',
      name: 'Deportes',
      startDate: iso(tuesday),
      category: 'deportes',
    });

    expect(filterEvents([musica, deportes], { categoria: ['musica'] }, tuesday)).toEqual([musica]);
  });

  it('returns all events when no category filter is set', () => {
    const musica = makeEvent({
      id: 'm1',
      name: 'Musica',
      startDate: iso(tuesday),
      category: 'musica',
    });

    expect(filterEvents([musica], {}, tuesday)).toEqual([musica]);
  });
});

describe('filterEvents - gratis', () => {
  it('keeps only free events when gratis is true', () => {
    const gratis = makeEvent({ id: 'g1', name: 'Gratis', startDate: iso(tuesday), price: 0 });
    const pagado = makeEvent({ id: 'p1', name: 'Pagado', startDate: iso(tuesday), price: 350 });

    expect(filterEvents([gratis, pagado], { gratis: true }, tuesday)).toEqual([gratis]);
  });
});

describe('filterEvents - rango', () => {
  it('rango "hoy" keeps events happening today, including an ongoing multi-day event', () => {
    const hoy = makeEvent({ id: 'h1', name: 'Hoy', startDate: iso(tuesday) });
    const manana = makeEvent({ id: 'm1', name: 'Mañana', startDate: iso(addDays(tuesday, 1)) });
    const enCurso = makeEvent({
      id: 'ec1',
      name: 'En curso',
      startDate: iso(addDays(tuesday, -2)),
      endDate: iso(addDays(tuesday, 3)),
    });

    const result = filterEvents([hoy, manana, enCurso], { rango: 'hoy' }, tuesday);

    expect(result.map((e) => e.id).sort()).toEqual(['ec1', 'h1']);
  });

  it('rango "semana" keeps events within the next 7 days', () => {
    const en3Dias = makeEvent({ id: 'e3', name: 'En 3 días', startDate: iso(addDays(tuesday, 3)) });
    const en10Dias = makeEvent({
      id: 'e10',
      name: 'En 10 días',
      startDate: iso(addDays(tuesday, 10)),
    });

    const result = filterEvents([en3Dias, en10Dias], { rango: 'semana' }, tuesday);

    expect(result).toEqual([en3Dias]);
  });

  it('rango "mes" keeps events within the next 30 days', () => {
    const en25Dias = makeEvent({
      id: 'e25',
      name: 'En 25 días',
      startDate: iso(addDays(tuesday, 25)),
    });
    const en40Dias = makeEvent({
      id: 'e40',
      name: 'En 40 días',
      startDate: iso(addDays(tuesday, 40)),
    });

    const result = filterEvents([en25Dias, en40Dias], { rango: 'mes' }, tuesday);

    expect(result).toEqual([en25Dias]);
  });

  it('excludes finished events from any date range', () => {
    const finalizado = makeEvent({
      id: 'f1',
      name: 'Finalizado',
      startDate: iso(addDays(tuesday, -10)),
    });

    expect(filterEvents([finalizado], { rango: 'mes' }, tuesday)).toEqual([]);
  });

  describe('rango "fin-de-semana"', () => {
    it('from a weekday, includes the upcoming Saturday and Sunday', () => {
      const monday = addDays(tuesday, -1); // Monday of the same week
      const saturday = addDays(monday, 5);
      const sunday = addDays(monday, 6);
      const nextMonday = addDays(monday, 7);

      const eventoSabado = makeEvent({ id: 's1', name: 'Sábado', startDate: iso(saturday) });
      const eventoDomingo = makeEvent({ id: 'd1', name: 'Domingo', startDate: iso(sunday) });
      const eventoLunesSiguiente = makeEvent({
        id: 'l1',
        name: 'Lunes siguiente',
        startDate: iso(nextMonday),
      });

      const result = filterEvents(
        [eventoSabado, eventoDomingo, eventoLunesSiguiente],
        { rango: 'fin-de-semana' },
        monday,
      );

      expect(result.map((e) => e.id).sort()).toEqual(['d1', 's1']);
    });

    it('from a Sunday, keeps today’s event and a still-ongoing Saturday event, but not a Saturday-only event that already finished', () => {
      const monday = addDays(tuesday, -1);
      const saturday = addDays(monday, 5);
      const sunday = addDays(monday, 6);

      const eventoSabadoFinalizado = makeEvent({
        id: 's1',
        name: 'Sábado (ya terminó)',
        startDate: iso(saturday),
      });
      const eventoSabadoDomingo = makeEvent({
        id: 's2',
        name: 'Sábado y domingo',
        startDate: iso(saturday),
        endDate: iso(sunday),
      });
      const eventoDomingo = makeEvent({ id: 'd1', name: 'Domingo', startDate: iso(sunday) });

      const result = filterEvents(
        [eventoSabadoFinalizado, eventoSabadoDomingo, eventoDomingo],
        { rango: 'fin-de-semana' },
        sunday,
      );

      expect(result.map((e) => e.id).sort()).toEqual(['d1', 's2']);
    });
  });
});

describe('filterEvents - combined', () => {
  it('applies categoria and gratis together', () => {
    const musicaGratis = makeEvent({
      id: 'mg',
      name: 'Musica gratis',
      startDate: iso(tuesday),
      category: 'musica',
      price: 0,
    });
    const musicaPagada = makeEvent({
      id: 'mp',
      name: 'Musica pagada',
      startDate: iso(tuesday),
      category: 'musica',
      price: 200,
    });
    const deportesGratis = makeEvent({
      id: 'dg',
      name: 'Deportes gratis',
      startDate: iso(tuesday),
      category: 'deportes',
      price: 0,
    });

    const result = filterEvents(
      [musicaGratis, musicaPagada, deportesGratis],
      { categoria: ['musica'], gratis: true },
      tuesday,
    );

    expect(result).toEqual([musicaGratis]);
  });
});
