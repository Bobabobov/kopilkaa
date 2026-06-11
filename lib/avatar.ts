export const DEFAULT_AVATAR = "/default-avatar.png";

const TELEGRAM_RESTRICTED_USERPIC_RE = /^https?:\/\/t\.me\/i\/userpic\//i;
const TELEGRAM_CDN_RE = /^https?:\/\/([\w-]+\.)*telesco\.pe\//i;
const TELEGRAM_BOT_FILE_RE = /^https?:\/\/api\.telegram\.org\/file\/bot/i;

export const isRestrictedTelegramAvatarUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return TELEGRAM_RESTRICTED_USERPIC_RE.test(url);
};

/** Публичный CDN/Bot API URL Telegram (можно показывать напрямую в браузере). */
export const isTelegramHostedAvatarUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return TELEGRAM_CDN_RE.test(url) || TELEGRAM_BOT_FILE_RE.test(url);
};

export const isDefaultAvatarUrl = (url?: string | null): boolean => {
  if (!url) return true;
  return url === DEFAULT_AVATAR || url.endsWith("/default-avatar.png");
};

/** Публичный photo_url из Telegram Login Widget (не заглушка userpic). */
export const isUsableTelegramPhotoUrl = (
  url?: string | null,
): url is string => {
  if (!url) return false;
  return !isRestrictedTelegramAvatarUrl(url);
};

/**
 * Можно обновить аватар из Telegram при входе: пользователь не загружал свой
 * и текущий аватар пустой, дефолтный, ограниченный userpic или ранее синхронизированный.
 */
export const shouldSyncAvatarFromTelegram = (
  avatar: string | null | undefined,
  avatarUpdatedAt: Date | null | undefined,
): boolean => {
  if (isDefaultAvatarUrl(avatar)) return true;
  if (isRestrictedTelegramAvatarUrl(avatar)) return true;
  if (isTelegramHostedAvatarUrl(avatar)) return true;
  if (!avatar) return true;
  // Ручная загрузка/удаление помечается avatarUpdatedAt — не перезаписываем свой аватар.
  if (avatarUpdatedAt) return false;
  if (avatar.startsWith("/api/uploads/avatar_")) return true;
  return false;
};

export const resolveAvatarUrl = (url?: string | null): string => {
  if (!url) return DEFAULT_AVATAR;
  if (isRestrictedTelegramAvatarUrl(url)) return DEFAULT_AVATAR;
  return url;
};
