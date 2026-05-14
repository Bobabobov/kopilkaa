/**
 * Отпечаток реквизитов: только цифры, не короче 10 (карта/счёт/телефон в одной строке).
 * Для сопоставления заявок и выводов бонусов между пользователями.
 */
export function digitsFingerprint(s: string | null | undefined): string | null {
  const d = String(s ?? "").replace(/\D/g, "");
  return d.length >= 10 ? d : null;
}
