// lib/time.ts — общие форматтеры даты/времени для RU

function toDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

/** «только что», «N мин назад», «N ч назад», «N дн назад» или дата */
export function formatTimeAgo(date: Date | string): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) {
    const n = diffMinutes;
    return `${n} ${n === 1 ? "минуту" : n < 5 ? "минуты" : "минут"} назад`;
  }
  if (diffHours < 24) {
    const n = diffHours;
    return `${n} ${n === 1 ? "час" : n < 5 ? "часа" : "часов"} назад`;
  }
  if (diffDays < 7) {
    const n = diffDays;
    return `${n} ${n === 1 ? "день" : n < 5 ? "дня" : "дней"} назад`;
  }
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

/** «Сегодня», «Вчера», «N дн. назад» или короткая дата */
export function formatRelativeDate(date: Date | string): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

/** Для заголовков групп: «Сегодня», «Вчера» или «день месяц [год]» */
export function formatDateGroup(date: Date | string): string {
  const d = toDate(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateOnly.getTime() === todayOnly.getTime()) return "Сегодня";
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return "Вчера";
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

/** Короткая дата: «день месяц» (для карточек, списков) */
export function formatDateShort(date: Date | string): string {
  const d = toDate(date);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

/** Полная дата: «день месяц год» */
export function formatDateFull(date: Date | string): string {
  const d = toDate(date);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Дата и время для новостей/постов (день месяц год, час:мин) */
export function formatDateTimeShort(date: Date | string): string {
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Дата и время для «Последний визит» и подобного */
export function formatDateTime(date: Date | string | null): string {
  if (date === null || date === undefined) return "—";
  const d = toDate(date);
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function msToHuman(ms: number) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h} ч ${m} мин`;
  if (m > 0) return `${m} мин ${ss} сек`;
  return `${ss} сек`;
}
