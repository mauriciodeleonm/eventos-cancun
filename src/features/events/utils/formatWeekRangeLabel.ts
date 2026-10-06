import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { nowInCancun } from '@/lib/timezone';

export function formatWeekRangeLabel(now: Date = nowInCancun()): string {
  const offsetToMonday = (now.getDay() + 6) % 7;
  const monday = addDays(now, -offsetToMonday);
  const sunday = addDays(monday, 6);

  const startMonth = format(monday, 'MMMM', { locale: es });
  const endMonth = format(sunday, 'MMMM', { locale: es });

  if (startMonth === endMonth) {
    return `Semana del ${format(monday, 'd')} al ${format(sunday, 'd')} de ${endMonth}`;
  }

  return `Semana del ${format(monday, 'd')} de ${startMonth} al ${format(sunday, 'd')} de ${endMonth}`;
}
