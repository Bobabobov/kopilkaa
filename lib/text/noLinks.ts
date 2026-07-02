/** Явные URL, www, markdown-ссылки и популярные домены/сокращатели. */
const USER_TEXT_LINK_PATTERNS: RegExp[] = [
  /(?:https?|ftp):\/\/\S+/i,
  /\bwww\.\S+/i,
  /\[[^\]]+\]\([^)]+\)/,
  /(?:^|\s)(?:t\.me|vk\.com|vk\.cc|bit\.ly|goo\.gl|clck\.ru|youtu\.be)\/\S+/i,
  /\b[a-z0-9][a-z0-9-]*\.(?:com|ru|org|net|io|dev|app|me|su|online|site|link|shop|store|info|biz|pro|xyz)(?:\/\S*|\b)/i,
];

export const USER_TEXT_NO_LINKS_ERROR = "Ссылки в тексте запрещены";

export function textContainsLink(text: string): boolean {
  return USER_TEXT_LINK_PATTERNS.some((pattern) => pattern.test(text));
}
