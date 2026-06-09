import { cache } from "react";
import { prisma } from "@/lib/db";
import { getSafeExternalUrl } from "@/lib/safeExternalUrl";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";

export type TopDonorItem = {
  id: string;
  name: string;
  avatar: string | null;
  vkLink: string | null;
  telegramLink: string | null;
  youtubeLink: string | null;
  markedAsDeceiver: boolean;
  position: number;
  isTop: boolean;
  amount: string;
};

type SupportAggRow = {
  userId: string;
  _sum: { amount: number | null };
};

export const getTopDonors = cache(
  async (limit = 3): Promise<TopDonorItem[]> => {
    const take = Math.min(10, Math.max(1, limit));

    try {
      const aggregates = await prisma.donation.groupBy({
        by: ["userId"],
        where: { type: "SUPPORT" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      });

      const topAggs = aggregates
        .filter((a) => typeof a.userId === "string" && a.userId.length > 0)
        .slice(0, take) as SupportAggRow[];

      if (!topAggs.length) return [];

      const userIds = topAggs.map((a) => a.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
          hideEmail: true,
          avatar: true,
          vkLink: true,
          telegramLink: true,
          youtubeLink: true,
          ...USER_PUBLIC_BADGE_SELECT,
        },
      });
      const byId = new Map(users.map((u) => [u.id, u]));

      return topAggs
        .map((agg, index) => {
          const user = byId.get(agg.userId);
          if (!user) return null;

          const totalAmount = agg._sum.amount ?? 0;
          const fallbackName =
            !user.hideEmail && user.email
              ? user.email.split("@")[0]
              : "Пользователь";

          return {
            id: user.id,
            name: user.name || fallbackName,
            avatar: user.avatar,
            vkLink: getSafeExternalUrl(user.vkLink),
            telegramLink: getSafeExternalUrl(user.telegramLink),
            youtubeLink: getSafeExternalUrl(user.youtubeLink),
            markedAsDeceiver: user.markedAsDeceiver,
            position: index + 1,
            isTop: index === 0,
            amount: totalAmount.toLocaleString("ru-RU"),
          };
        })
        .filter((row): row is TopDonorItem => row !== null);
    } catch (error) {
      console.error("[getTopDonors]", error);
      return [];
    }
  },
);
