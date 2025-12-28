import { prisma } from "@/lib/db";

export type SupportBadge = "supporter" | "subscriber";

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


