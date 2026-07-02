import { getTimezoneCityLabel } from '@/lib/applications/clientTimezone';

export interface SubmittedAtDisplay {
  authorCity: string | null;
  authorTime: string | null;
}

function toDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

function formatInTimezone(date: Date | string, timeZone: string): string {
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Время отправки в часовом поясе автора заявки. */
export function buildSubmittedAtDisplay(
  createdAt: string,
  clientTimezone: string | null | undefined,
): SubmittedAtDisplay {
  if (!clientTimezone) {
    return { authorCity: null, authorTime: null };
  }

  return {
    authorCity: getTimezoneCityLabel(clientTimezone),
    authorTime: formatInTimezone(createdAt, clientTimezone),
  };
}
