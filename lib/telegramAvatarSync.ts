import {
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

export async function downloadTelegramAvatar(params: {
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
  if (!saved) {
    console.warn(
      `[telegram-avatar] не удалось скачать аватар для пользователя ${userId}`,
    );
  }
  return saved;
}

/** Фоновая подтяжка аватара для уже залогиненных Telegram-пользователей. */
export function scheduleTelegramAvatarSync(params: {
  userId: string;
  telegramId: string;
  currentAvatar?: string | null;
  avatarUpdatedAt?: Date | null;
}): void {
  if (!shouldSyncAvatarFromTelegram(params.currentAvatar, params.avatarUpdatedAt)) {
    return;
  }

  const now = Date.now();
  const last = lastAttemptByUser.get(params.userId) ?? 0;
  if (now - last < SYNC_COOLDOWN_MS) return;
  lastAttemptByUser.set(params.userId, now);

  void (async () => {
    const saved = await downloadTelegramAvatar(params);
    if (!saved) return;

    await prisma.user.update({
      where: { id: params.userId },
      data: { avatar: saved },
    });
  })().catch((error) => {
    console.warn("[telegram-avatar] фоновая синхронизация:", error);
  });
}
