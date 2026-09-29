import { parseCancunDate } from '@/lib/timezone';
import type { Event } from '@/features/events/schema';
import { groupByDay } from '@/features/events/utils/groupByDay';

const now = parseCancunDate('2026-09-29T12:00'); // Tuesday

function makeEvent(overrides: Partial<Event> & Pick<Event, 'id' | 'name' | 'startDate'>): Event {
  return {
    venueName: 'Venue de prueba',
    price: 0,
    description: 'Descripción de prueba.',
    category: 'otro',
    ...overrides,
  };
}

const laterToday = makeEvent({
  id: 'later-today',
  name: 'Función de tarde',
  startDate: '2026-09-29T18:00',
});
const earlierToday = makeEvent({
  id: 'earlier-today',
  name: 'Mercado matutino',
  startDate: '2026-09-29T09:00',
});
const todayWithoutTime = makeEvent({
  id: 'today-no-time',
  name: 'Bazar sin hora confirmada',
  startDate: '2026-09-29',
});
const tomorrow = makeEvent({
  id: 'tomorrow',
  name: 'Torneo de mañana',
  startDate: '2026-09-30T10:00',
});
const tomorrowSameTime = makeEvent({
  id: 'tomorrow-tie',
  name: 'Alfa evento',
  startDate: '2026-09-30T10:00',
});
const saturday = makeEvent({
  id: 'saturday',
  name: 'Concierto sábado',
  startDate: '2026-10-03T20:00',
});
const ongoingMultiDay = makeEvent({
  id: 'ongoing-multi-day',
  name: 'Expo artesanal',
  startDate: '2026-09-27T10:00',
  endDate: '2026-10-02T20:00',
});
const finished = makeEvent({
  id: 'finished',
  name: 'Carrera pasada',
  startDate: '2026-09-20T10:00',
});

const events = [
  laterToday,
  earlierToday,
  todayWithoutTime,
  tomorrow,
  tomorrowSameTime,
  saturday,
  ongoingMultiDay,
  finished,
];

describe('groupByDay', () => {
  it('excludes finished events and orders groups chronologically', () => {
    const groups = groupByDay(events, now);

    expect(groups.map((g) => g.key)).toEqual(['2026-09-29', '2026-09-30', '2026-10-03']);
    expect(groups.flatMap((g) => g.events)).not.toContainEqual(finished);
  });

  it('labels today as "Hoy", tomorrow as "Mañana", and later days with a weekday name', () => {
    const groups = groupByDay(events, now);

    expect(groups.map((g) => g.label)).toEqual(['Hoy', 'Mañana', 'Sábado 3 de octubre']);
  });

  it('puts an in-progress multi-day event in "Hoy", even though it started days ago', () => {
    const groups = groupByDay(events, now);
    const today = groups.find((g) => g.label === 'Hoy');

    expect(today?.events.map((e) => e.name)).toContain('Expo artesanal');
  });

  it('sorts events within a day by start time, with no-time events last', () => {
    const groups = groupByDay(events, now);
    const today = groups.find((g) => g.label === 'Hoy');

    expect(today?.events.map((e) => e.name)).toEqual([
      'Expo artesanal',
      'Mercado matutino',
      'Función de tarde',
      'Bazar sin hora confirmada',
    ]);
  });

  it('breaks ties at the same start time by name', () => {
    const groups = groupByDay(events, now);
    const tomorrowGroup = groups.find((g) => g.label === 'Mañana');

    expect(tomorrowGroup?.events.map((e) => e.name)).toEqual(['Alfa evento', 'Torneo de mañana']);
  });
});
