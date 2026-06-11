/** Разбирает комментарий админа: основной текст и список связанных аккаунтов (строки «— …»). */
export function parseAdminComment(raw: string): {
  body: string;
  linkedAccounts: string[];
} {
  const text = raw.trim();
  if (!text) return { body: "", linkedAccounts: [] };

  const marker = "Обнаружены связи с другими аккаунтами:";
  const markerIdx = text.indexOf(marker);

  if (markerIdx === -1) {
    return { body: text, linkedAccounts: [] };
  }

  const body = text.slice(0, markerIdx).trim();
  const tail = text.slice(markerIdx + marker.length);
  const linkedAccounts = tail
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("—") || line.startsWith("-"))
    .map((line) => line.replace(/^[—\-]\s*/, "").trim())
    .filter(Boolean);

  return { body, linkedAccounts };
}
