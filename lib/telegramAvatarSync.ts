import {
  isRestrictedTelegramAvatarUrl,
  isTelegramHostedAvatarUrl,
  isUsableTelegramPhotoUrl,
  shouldSyncAvatarFromTelegram,
} from "@/lib/avatar";
import { fetchTelegramProfilePhotoUrl } from "@/lib/telegramAvatar";
import { saveRemoteImageAsAvatar } from "@/lib/uploads/saveRemoteImage";
import { prisma } from "@/lib/db";

const SYNC_COOLDOWN_MS = 15 * 60 * 1000;
const lastAttemptByUser = new Map<string, number>();

function canPersistTelegramPhotoUrl(url: string): boolean {
  return isUsableTelegramPhotoUrl(url) || isTelegramHostedAvatarUrl(url);
}

function scheduleLocalAvatarDownload(userId: string, sourceUrl: string): void {
  void saveRemoteImageAsAvatar(sourceUrl, userId)
    .then((local) => {
      if (!local) return;
      return prisma.user.update({
        where: { id: userId },
        data: { avatar: local },
      });
    })
    .catch((error) => {
      console.warn(
        `[telegram-avatar] фоновое локальное скачивание для ${userId}:`,
        error,
      );
    });
}

export async function resolveTelegramPhotoSource(
  widgetPhotoUrl: string | null | undefined,
  telegramId: string,
): Promise<string | null> {
  if (isUsableTelegramPhotoUrl(widgetPhotoUrl)) return widgetPhotoUrl;
  return fetchTelegramProfilePhotoUrl(telegramId);
}

/**
 * При входе/регистрации: сразу возвращает URL для записи в БД (CDN из виджета),
 * локальное скачивание — в фоне (VPS часто не достучится до Telegram).
 */
export async function commitTelegramAvatarOnAuth(params: {
  userId: string;
  telegramId: string;
  widgetPhotoUrl?: string | null;
  currentAvatar?: string | null;
  avatarUpdatedAt?: Date | null;
}): Promise<string | null> {
  const {
    userId,
    telegramId,
    widgetPhotoUrl,
    currentAvatar,
    avatarUpdatedAt,
  } = params;

  if (!shouldSyncAvatarFromTelegram(currentAvatar, avatarUpdatedAt)) {
    return null;
  }

  if (
    widgetPhotoUrl &&
    (isUsableTelegramPhotoUrl(widgetPhotoUrl) ||
      isRestrictedTelegramAvatarUrl(widgetPhotoUrl))
  ) {
    if (isRestrictedTelegramAvatarUrl(widgetPhotoUrl)) {
      console.info(
        `[telegram-avatar] user ${userId}: сохраняем userpic URL для показа в браузере`,
      );
    }
    scheduleLocalAvatarDownload(userId, widgetPhotoUrl);
    return widgetPhotoUrl;
  }

  if (!widgetPhotoUrl) {
    console.warn(
      `[telegram-avatar] user ${userId}: Telegram не передал photo_url`,
    );
  }

  const botUrl = await fetchTelegramProfilePhotoUrl(telegramId);
  if (botUrl && canPersistTelegramPhotoUrl(botUrl)) {
    scheduleLocalAvatarDownload(userId, botUrl);
    return botUrl;
  }

  return null;
}

/**
 * Полная синхронизация (настройки, фон): пробует скачать, иначе внешний URL.
 */
export async function persistTelegramAvatar(params: {
  userId: string;
  telegramId: string;
  widgetPhotoUrl?: string | null;
  currentAvatar?: string | null;
  avatarUpdatedAt?: Date | null;
}): Promise<string | null> {
  const {
    userId,
    telegramId,
    widgetPhotoUrl,
    currentAvatar,
    avatarUpdatedAt,
  } = params;

  if (!shouldSyncAvatarFromTelegram(currentAvatar, avatarUpdatedAt)) {
    return null;
  }

  if (
    widgetPhotoUrl &&
    (isUsableTelegramPhotoUrl(widgetPhotoUrl) ||
      isRestrictedTelegramAvatarUrl(widgetPhotoUrl))
  ) {
    const saved = await saveRemoteImageAsAvatar(widgetPhotoUrl, userId);
    if (saved) return saved;
    return widgetPhotoUrl;
  }

  const sourceUrl = await resolveTelegramPhotoSource(widgetPhotoUrl, telegramId);
  if (!sourceUrl) return null;

  const saved = await saveRemoteImageAsAvatar(sourceUrl, userId);
  if (saved) return saved;

  if (canPersistTelegramPhotoUrl(sourceUrl)) {
    return sourceUrl;
  }

  return null;
}

/** @deprecated */
export const downloadTelegramAvatar = persistTelegramAvatar;

/** Фоновая подтяжка при открытии профиля. */
export function scheduleTelegramAvatarSync(params: {
  userId: string;
  telegramId: string;
  widgetPhotoUrl?: string | null;
  currentAvatar?: string | null;
  avatarUpdatedAt?: Date | null;
  skipCooldown?: boolean;
}): void {
  if (!shouldSyncAvatarFromTelegram(params.currentAvatar, params.avatarUpdatedAt)) {
    return;
  }

  if (!params.skipCooldown) {
    const now = Date.now();
    const last = lastAttemptByUser.get(params.userId) ?? 0;
    if (now - last < SYNC_COOLDOWN_MS) return;
    lastAttemptByUser.set(params.userId, now);
  } else {
    lastAttemptByUser.set(params.userId, Date.now());
  }

  void (async () => {
    const saved = await persistTelegramAvatar(params);
    if (!saved) return;

    await prisma.user.update({
      where: { id: params.userId },
      data: { avatar: saved },
    });
  })().catch((error) => {
    console.warn("[telegram-avatar] фоновая синхронизация:", error);
  });
}
