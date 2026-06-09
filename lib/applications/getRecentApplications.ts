import { cache } from "react";
import { prisma } from "@/lib/db";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";

export type RecentApplicationItem = {
  id: string;
  title: string;
  summary: string;
  amount: number;
  createdAt: Date;
  images: Array<{ url: string; sort: number }>;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    markedAsDeceiver?: boolean;
  };
};

export const getRecentApplications = cache(
  async (limit = 3): Promise<RecentApplicationItem[]> => {
    const take = Math.min(10, Math.max(1, limit));

    try {
      return await prisma.application.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          title: true,
          summary: true,
          amount: true,
          createdAt: true,
          images: {
            select: { url: true, sort: true },
            orderBy: { sort: "asc" },
          },
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              ...USER_PUBLIC_BADGE_SELECT,
            },
          },
        },
      });
    } catch (error) {
      console.error("[getRecentApplications]", error);
      return [];
    }
  },
);
