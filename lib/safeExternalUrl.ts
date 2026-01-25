export function getSafeExternalUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v) return null;

  // Allow explicit http(s) and tg
  if (/^https?:\/\//i.test(v) || /^tg:\/\//i.test(v)) return v;

  // Normalize common inputs without scheme
  if (/^t\.me\//i.test(v)) return `https://${v}`;
  if (/^vk\.com\//i.test(v)) return `https://${v}`;
  if (/^youtube\.com\//i.test(v) || /^www\.youtube\.com\//i.test(v))
    return `https://${v}`;
  if (/^youtu\.be\//i.test(v)) return `https://${v}`;

  return null;
}
