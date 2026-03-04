export const DEFAULT_AVATAR = "/default-avatar.png";

const TELEGRAM_RESTRICTED_USERPIC_RE = /^https?:\/\/t\.me\/i\/userpic\//i;

export const isRestrictedTelegramAvatarUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return TELEGRAM_RESTRICTED_USERPIC_RE.test(url);
};

export const resolveAvatarUrl = (url?: string | null): string => {
  if (!url) return DEFAULT_AVATAR;
  if (isRestrictedTelegramAvatarUrl(url)) return DEFAULT_AVATAR;
  return url;
};
