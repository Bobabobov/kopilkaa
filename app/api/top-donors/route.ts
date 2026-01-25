// app/api/top-donors/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSafeExternalUrl } from "@/lib/safeExternalUrl";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Топ считаем агрегацией в БД (не грузим все донаты/пользователей целиком)
    const aggregates = await prisma.donation
      .groupBy({
        by: ["userId"],
        where: { type: "SUPPORT" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      })
      .catch(() => []);

    const topAggs = aggregates
      .filter((a: any) => typeof a.userId === "string" && a.userId.length > 0)
      .slice(0, 3) as { userId: string; _sum: { amount: number | null } }[];

    if (!topAggs.length) {
      return NextResponse.json(
        { success: true, donors: [] },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );
    }

    const userIds = topAggs.map((a) => a.userId);
    const heroBadges = await getHeroBadgesForUsers(userIds);
    const users = await prisma.user
      .findMany({
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
        },
      })
      .catch(() => []);
    const byId = new Map(users.map((u) => [u.id, u]));

    const donors = topAggs
      .map((agg) => {
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
          email: user.email || "",
          avatar: user.avatar,
          vkLink: getSafeExternalUrl(user.vkLink),
          telegramLink: getSafeExternalUrl(user.telegramLink),
          youtubeLink: getSafeExternalUrl(user.youtubeLink),
          heroBadge: heroBadges[user.id] ?? null,
          totalAmount,
        };
      })
      .filter(Boolean) as any[];

    return NextResponse.json(
      {
        success: true,
        donors: donors.map((donor, index) => ({
          ...donor,
          position: index + 1,
          isTop: index === 0,
          amount: donor.totalAmount.toLocaleString("ru-RU"),
        })),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return NextResponse.json({
      success: true,
      donors: [],
    });
  }
}
