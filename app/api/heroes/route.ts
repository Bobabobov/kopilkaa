// app/api/heroes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSafeExternalUrl } from "@/lib/safeExternalUrl";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 24)));
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const sortBy = (searchParams.get("sortBy") || "total") as "total" | "count" | "date";

    // Агрегируем оплаты услуги размещения в разделе «Герои» (DonationType.SUPPORT)
    // ВАЖНО: это оплата цифровой услуги размещения профиля (не благотворительность).
    const aggregates = await prisma.donation
      .groupBy({
        by: ["userId"],
        where: { type: "SUPPORT" },
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: { _sum: { amount: "desc" } },
      })
      .catch(() => []);

    // Важно: groupBy вернёт запись и для userId = null (анонимные оплаты).
    // Если передать null в `id: { in: [...] }`, Prisma может упасть, и мы получим пустой список героев.
    const userIds = aggregates
      .map((a) => a.userId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (!userIds.length) {
      return NextResponse.json(
        {
          heroes: [],
          topThree: [],
          items: [],
          total: 0,
          listTotal: 0,
          filteredTotal: 0,
          page: 1,
          limit,
          pages: 0,
          stats: {
            totalHeroes: 0,
            totalDonated: 0,
            subscribersCount: 0,
            averageDonation: 0,
          },
          message: "Пока нет размещённых профилей в разделе «Герои». Разместите свой профиль первым.",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        },
      );
    }

    const userSelect = {
      id: true,
      name: true,
      email: true,
      hideEmail: true,
      avatar: true,
      createdAt: true,
      vkLink: true,
      telegramLink: true,
      youtubeLink: true,
    } as const;

    // ВАЖНО: hideFromHeroes добавлен позже миграцией. Если на окружении миграция ещё не применена,
    // Prisma упадёт на where: { hideFromHeroes: false }. Чтобы /heroes не становилась пустой,
    // делаем fallback запрос без фильтра.
    let users: any[] = [];
    try {
      users = await prisma.user.findMany({
        where: { id: { in: userIds }, hideFromHeroes: false },
        select: userSelect,
      });
    } catch {
      users = await prisma.user
        .findMany({
          where: { id: { in: userIds } },
          select: userSelect,
        })
        .catch(() => []);
    }

    const heroBadges = await getHeroBadgesForUsers(userIds);

    const byId = new Map(users.map((u) => [u.id, u]));

    const heroesRawAll = aggregates
      .map((agg) => {
        // Prisma groupBy может вернуть userId = null (анонимные оплаты)
        if (!agg.userId) return null;
        const user = byId.get(agg.userId);
        if (!user) return null;

        const totalPaid = agg._sum.amount || 0;
        const paymentsCount = agg._count._all || 0;

        const fallbackName =
          !user.hideEmail && user.email ? user.email.split("@")[0] : "Пользователь";

        return {
          id: user.id,
          name: user.name || fallbackName,
          avatar: user.avatar,
          heroBadge: heroBadges[user.id] ?? null,
          totalDonated: totalPaid, // backward-compatible field name
          donationCount: paymentsCount, // backward-compatible field name
          joinedAt: user.createdAt,
          // Раньше это называлось isSubscriber. Теперь это нейтральное “расширенное размещение”.
          // Логику оставляем прежней (>= 3 оплат), меняем только смысл.
          hasExtendedPlacement: paymentsCount >= 3,
          isSubscriber: paymentsCount >= 3, // backward-compatible alias (семантика изменена)
          vkLink: getSafeExternalUrl(user.vkLink),
          telegramLink: getSafeExternalUrl(user.telegramLink),
          youtubeLink: getSafeExternalUrl(user.youtubeLink),
        };
      })
      .filter(Boolean) as any[];

    // Global ranks always by total donated
    const heroesByTotal = [...heroesRawAll].sort(
      (a, b) => b.totalDonated - a.totalDonated,
    );
    const rankById = new Map<string, number>();
    heroesByTotal.forEach((h, idx) => rankById.set(h.id, idx + 1));

    const heroesAll = heroesRawAll.map((hero) => ({
      ...hero,
      rank: rankById.get(hero.id) || 0,
    }));

    const totalHeroes = heroesAll.length;
    const totalDonated = heroesAll.reduce((sum, h) => sum + (h.totalDonated || 0), 0);
    const activeParticipantsCount = heroesAll.filter(
      (h) => !!h.hasExtendedPlacement || !!h.isSubscriber,
    ).length;
    const averageDonation = totalHeroes > 0 ? Math.round(totalDonated / totalHeroes) : 0;

    // Top 3 всегда по totalDonated
    const topThree = heroesByTotal.slice(0, 3).map((h) => ({
      ...h,
      rank: rankById.get(h.id) || 0,
    }));
    const topIds = new Set(topThree.map((h) => h.id));

    // Filter (search) applies to list only
    let list = heroesAll;
    if (q) {
      list = list.filter((h) => (h.name || "").toLowerCase().includes(q));
    }

    // Exclude topThree from list to avoid duplicates
    list = list.filter((h) => !topIds.has(h.id));

    // Sort list (server-driven)
    list.sort((a, b) => {
      switch (sortBy) {
        case "count":
          return b.donationCount - a.donationCount;
        case "date":
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case "total":
        default:
          return b.totalDonated - a.totalDonated;
      }
    });

    const filteredTotal = list.length;
    const pages = Math.ceil(filteredTotal / limit);
    const skip = (page - 1) * limit;
    const items = list.slice(skip, skip + limit);

    return NextResponse.json(
      {
        // backward-compatible fields
        heroes: heroesAll,
        total: totalHeroes,

        // new fields for paginated UI
        topThree,
        items,
        listTotal: filteredTotal,
        filteredTotal,
        page,
        limit,
        pages,
        stats: {
          totalHeroes,
          totalDonated,
          subscribersCount: activeParticipantsCount, // backward-compatible field name
          averageDonation,
        },
        message:
          totalHeroes === 0
            ? "Пока нет размещённых профилей в разделе «Герои». Разместите свой профиль первым."
            : null,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка при получении героев:", error);
    // Возвращаем пустой список вместо падения страницы
    return NextResponse.json(
      {
        heroes: [],
        topThree: [],
        items: [],
        total: 0,
        listTotal: 0,
        filteredTotal: 0,
        page: 1,
        limit: 24,
        pages: 0,
        stats: {
          totalHeroes: 0,
          totalDonated: 0,
          subscribersCount: 0,
          averageDonation: 0,
        },
        message: "Пока нет размещённых профилей в разделе «Герои». Разместите свой профиль первым.",
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      },
    );
  }
}
