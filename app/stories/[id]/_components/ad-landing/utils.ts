export const stripHTML = (html: string, maxLen = 8000): string => {
  if (!html) return "";
  const sliced = html.length > maxLen ? html.slice(0, maxLen) : html;
  return sliced
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const normalizeWebsiteUrl = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const normalizeTelegramUrl = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("@")) return `https://t.me/${trimmed.slice(1)}`;
  if (/^[a-zA-Z0-9_]{5,}$/.test(trimmed)) return `https://t.me/${trimmed}`;
  return null;
};

export type MainAction =
  | { type: "website"; href: string }
  | { type: "telegram"; href: string }
  | { type: "fallback"; href: string };
