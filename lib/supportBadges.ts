import { prisma } from "@/lib/db";

export type SupportBadge = "supporter" | "subscriber";

export type SupportBadgeMap = Record<string, SupportBadge>;

/**
 * Определяет бейдж поддержки по донатам пользователя.
 *
 * Логика (простая и предсказуемая):
 * - subscriber: есть донат с признаком "ежемесячной" поддержки (comment содержит monthly_support)
 * - supporter: есть любой донат SUPPORT
 *
 * Если подписка есть — возвращаем "subscriber" (она “старше” разовой).
 */
export async function getSupportBadgeForUser(userId: string): Promise<SupportBadge | null> {
  try {
    const hasMonthly = await prisma.donation.findFirst({
      where: {
        userId,
        type: "SUPPORT",
        comment: { contains: "monthly_support" },
      },
      select: { id: true },
    });
    if (hasMonthly) return "subscriber";

    const hasAny = await prisma.donation.findFirst({
      where: {
        userId,
        type: "SUPPORT",
      },
      select: { id: true },
    });
    if (hasAny) return "supporter";

    return null;
  } catch {
    return null;
  }
}

/**
 * Пакетный вариант для списков пользователей (друзья/поиск/рекомендации),
 * чтобы не делать N запросов в БД.
 */
export async function getSupportBadgesForUsers(userIds: string[]): Promise<SupportBadgeMap> {
  const ids = Array.from(new Set(userIds.filter(Boolean)));
  if (ids.length === 0) return {};

  // Ограничим размер, чтобы случайно не “убить” БД одним запросом.
  const limitedIds = ids.slice(0, 500);

  try {
    const donations = await prisma.donation.findMany({
      where: {
        userId: { in: limitedIds },
        type: "SUPPORT",
      },
      select: {
        userId: true,
        comment: true,
      },
    });

    const map: SupportBadgeMap = {};
    for (const d of donations) {
      const uid = d.userId;
      if (!uid) continue;

      const isMonthly =
        typeof d.comment === "string" && d.comment.includes("monthly_support");

      // “subscriber” старше “supporter”
      if (isMonthly) {
        map[uid] = "subscriber";
      } else if (!map[uid]) {
        map[uid] = "supporter";
      }
    }

    return map;
  } catch {
    return {};
  }
}


