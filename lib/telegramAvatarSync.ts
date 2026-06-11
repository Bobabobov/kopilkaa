import {
  isTelegramHostedAvatarUrl,
  isUsableTelegramPhotoUrl,
  shouldSyncAvatarFromTelegram,
} from "@/lib/avatar";
import { fetchTelegramProfilePhotoUrl } from "@/lib/telegramAvatar";
import { saveRemoteImageAsAvatar } from "@/lib/uploads/saveRemoteImage";
import { prisma } from "@/lib/db";

const SYNC_COOLDOWN_MS = 15 * 60 * 1000;
const lastAttemptByUser = new Map<string, number>();

export async function resolveTelegramPhotoSource(
  widgetPhotoUrl: string | null | undefined,
  telegramId: string,
): Promise<string | null> {
  if (isUsableTelegramPhotoUrl(widgetPhotoUrl)) return widgetPhotoUrl;
  return fetchTelegramProfilePhotoUrl(telegramId);
}

function canPersistTelegramPhotoUrl(url: string): boolean {
  return isUsableTelegramPhotoUrl(url) || isTelegramHostedAvatarUrl(url);
}

/**
 * Сохраняет аватар локально; если VPS не достучится до Telegram CDN/API —
 * записывает прямую ссылку (в браузере пользователя она обычно открывается).
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

  const sourceUrl = await resolveTelegramPhotoSource(
    widgetPhotoUrl,
    telegramId,
  );
  if (!sourceUrl) return null;

  const saved = await saveRemoteImageAsAvatar(sourceUrl, userId);
  if (saved) return saved;

  if (canPersistTelegramPhotoUrl(sourceUrl)) {
    console.warn(
      `[telegram-avatar] локальное скачивание недоступно, сохраняем внешний URL для ${userId}`,
    );
    return sourceUrl;
  }

  console.warn(
    `[telegram-avatar] не удалось получить аватар для пользователя ${userId}`,
  );
  return null;
}

/** @deprecated Используйте persistTelegramAvatar */
export const downloadTelegramAvatar = persistTelegramAvatar;

/** Фоновая подтяжка аватара — не блокирует вход и API-ответы. */
export function scheduleTelegramAvatarSync(params: {
  userId: string;
  telegramId: string;
  widgetPhotoUrl?: string | null;
  currentAvatar?: string | null;
  avatarUpdatedAt?: Date | null;
  /** Сразу после входа — без 15-минутного cooldown. */
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
