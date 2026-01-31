/**
 * Единые утилиты форматирования для всего проекта.
 * Используйте эти функции вместо локальных копий в компонентах.
 */

const ruFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

/**
 * Форматирует число как сумму в рублях: "1 234 ₽"
 * @param amount - число для форматирования
 * @param showSymbol - добавлять ли символ рубля (по умолчанию true)
 */
export function formatRub(amount: number | null | undefined, showSymbol = true): string {
  if (amount == null || !Number.isFinite(amount)) return "0 ₽";
  
  const formatted = ruFormatter
    .format(Math.round(amount))
    .replace(/\u00A0/g, " "); // Заменяем неразрывный пробел на обычный
  
  return showSymbol ? `${formatted} ₽` : formatted;
}

/**
 * Форматирует число с разделителями тысяч: "1 234"
 * Без символа валюты.
 */
export function formatAmount(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "0";
  
  return ruFormatter
    .format(Math.round(amount))
    .replace(/\u00A0/g, " ");
}

/**
 * Форматирует строку цифр как сумму для отображения в инпуте: "1 234"
 * Используется в формах для live-форматирования.
 */
export function formatAmountInput(digits: string): string {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return digits;
  return ruFormatter.format(n).replace(/\u00A0/g, " ");
}

/**
 * Форматирует дату в русском формате: "31 января 2026"
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Форматирует дату коротко: "31.01.2026"
 */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleDateString("ru-RU");
}

/**
 * Форматирует время относительно: "5 минут назад", "вчера"
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) return `${diffMinutes} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays === 1) return "вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return formatDateShort(d);
}
