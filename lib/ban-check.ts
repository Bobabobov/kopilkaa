// lib/ban-check.ts
import { prisma } from "@/lib/db";

export interface BanStatus {
  isBanned: boolean;
  isPermanent: boolean;
  bannedUntil: Date | null;
  bannedReason: string | null;
}

/**
 * Проверяет блокировку пользователя и автоматически разблокирует, если срок истёк
 * @param userId - ID пользователя
 * @returns Статус блокировки
 */
export async function checkUserBan(userId: string): Promise<BanStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isBanned: true,
      bannedUntil: true,
      bannedReason: true,
    },
  });

  if (!user) {
    return {
      isBanned: false,
      isPermanent: false,
      bannedUntil: null,
      bannedReason: null,
    };
  }

  // Если пользователь не заблокирован
  if (!user.isBanned) {
    return {
      isBanned: false,
      isPermanent: false,
      bannedUntil: null,
      bannedReason: null,
    };
  }

  // Если есть дата окончания блокировки
  if (user.bannedUntil) {
    const bannedUntil = new Date(user.bannedUntil);
    const now = new Date();

    // Если срок блокировки истёк, автоматически разблокируем
    if (bannedUntil <= now) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: false,
          bannedUntil: null,
          bannedReason: null,
        },
      });

      return {
        isBanned: false,
        isPermanent: false,
        bannedUntil: null,
        bannedReason: null,
      };
    }

    // Временная блокировка еще действует
    return {
      isBanned: true,
      isPermanent: false,
      bannedUntil: bannedUntil,
      bannedReason: user.bannedReason,
    };
  }

  // Постоянная блокировка (нет даты окончания)
  return {
    isBanned: true,
    isPermanent: true,
    bannedUntil: null,
    bannedReason: user.bannedReason,
  };
}


