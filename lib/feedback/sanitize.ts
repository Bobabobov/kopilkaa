/** Убираем управляющие символы и null-байты из текста отзыва. */
export function sanitizeFeedbackMessage(raw: string): string {
  return raw
    .replace(/\0/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

/** Только относительные пути внутри сайта — без внешних URL и path traversal. */
export function sanitizeFeedbackPagePath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().slice(0, 500);
  if (!trimmed) return null;
  if (!trimmed.startsWith('/') || trimmed.includes('..') || /^https?:/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

/** Уникальные безопасные URL загрузок в порядке добавления. */
export function normalizeFeedbackImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const url of urls) {
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= 5) break;
  }
  return result;
}
