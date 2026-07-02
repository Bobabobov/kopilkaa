const TZ_CITY_LABELS: Record<string, string> = {
  'Europe/Kaliningrad': 'Калининград',
  'Europe/Moscow': 'Москва',
  'Europe/Samara': 'Самара',
  'Asia/Yekaterinburg': 'Екатеринбург',
  'Asia/Omsk': 'Омск',
  'Asia/Krasnoyarsk': 'Красноярск',
  'Asia/Irkutsk': 'Иркутск',
  'Asia/Yakutsk': 'Якутск',
  'Asia/Vladivostok': 'Владивосток',
  'Asia/Magadan': 'Магадан',
  'Asia/Kamchatka': 'Камчатка',
  'Europe/Kiev': 'Киев',
  'Europe/Kyiv': 'Киев',
  'Europe/Minsk': 'Минск',
  'Asia/Almaty': 'Алматы',
  'Asia/Tashkent': 'Ташкент',
  'Asia/Tbilisi': 'Тбилиси',
  'Asia/Baku': 'Баку',
  'Asia/Yerevan': 'Ереван',
};

/** Человекочитаемое название города по IANA timezone. */
export function getTimezoneCityLabel(timeZone: string): string {
  const trimmed = timeZone.trim();
  if (TZ_CITY_LABELS[trimmed]) return TZ_CITY_LABELS[trimmed];
  const part = trimmed.split('/').pop()?.replace(/_/g, ' ');
  return part ?? trimmed;
}

/** Валидация IANA timezone с клиента. */
export function parseClientTimezone(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 64) return null;
  if (!/^[A-Za-z0-9_+\/-]+$/.test(trimmed)) return null;
  try {
    Intl.DateTimeFormat('ru-RU', { timeZone: trimmed });
    return trimmed;
  } catch {
    return null;
  }
}
