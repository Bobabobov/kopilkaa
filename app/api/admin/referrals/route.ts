import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Совпадает с текстом при начислении в `app/api/admin/applications/[id]/route.ts` */
const REFERRAL_GRANT_COMMENT_SNIPPET = "Реферальная программа";

type SortKey = "registrations" | "clicks" | "bonuses";

export async function GET(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      100,
      Math.max(10, Number(searchParams.get("limit") || 25)),
    );
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const sortRaw = (searchParams.get("sort") || "registrations").toLowerCase();
    const sort: SortKey =
      sortRaw === "clicks" || sortRaw === "bonuses"
        ? sortRaw
        : "registrations";

    const [
      clickGroups,
      regGroups,
      bonusGrantedGroups,
      bonusSumGroups,
      totalClicks,
      totalRegistrations,
      bonusTotals,
    ] = await Promise.all([
      prisma.referralClick.groupBy({
        by: ["referrerUserId"],
        _count: { _all: true },
      }),
      prisma.referralRegistration.groupBy({
        by: ["referrerUserId"],
        _count: { _all: true },
      }),
      prisma.referralRegistration.groupBy({
        by: ["referrerUserId"],
        where: { bonusGrantedAt: { not: null } },
        _count: { _all: true },
      }),
      prisma.goodDeedBonusGrant.groupBy({
        by: ["userId"],
        where: {
          comment: { contains: REFERRAL_GRANT_COMMENT_SNIPPET },
        },
        _sum: { amountBonuses: true },
        _count: { _all: true },
      }),
      prisma.referralClick.count(),
      prisma.referralRegistration.count(),
      prisma.goodDeedBonusGrant.aggregate({
        where: {
          comment: { contains: REFERRAL_GRANT_COMMENT_SNIPPET },
        },
        _sum: { amountBonuses: true },
        _count: { _all: true },
      }),
    ]);

    const clicksMap = new Map<string, number>();
    for (const row of clickGroups) {
      clicksMap.set(row.referrerUserId, row._count._all);
    }
    const regsMap = new Map<string, number>();
    for (const row of regGroups) {
      regsMap.set(row.referrerUserId, row._count._all);
    }
    const bonusCountMap = new Map<string, number>();
    for (const row of bonusGrantedGroups) {
      bonusCountMap.set(row.referrerUserId, row._count._all);
    }
    const bonusSumMap = new Map<string, number>();
    for (const row of bonusSumGroups) {
      bonusSumMap.set(
        row.userId,
        row._sum.amountBonuses != null ? Number(row._sum.amountBonuses) : 0,
      );
    }

    const idSet = new Set<string>();
    for (const row of clickGroups) idSet.add(row.referrerUserId);
    for (const row of regGroups) idSet.add(row.referrerUserId);
    for (const row of bonusGrantedGroups) idSet.add(row.referrerUserId);
    for (const row of bonusSumGroups) idSet.add(row.userId);

    let rows = [...idSet].map((userId) => ({
      userId,
      clicksCount: clicksMap.get(userId) ?? 0,
      registrationsCount: regsMap.get(userId) ?? 0,
      bonusesGrantedCount: bonusCountMap.get(userId) ?? 0,
      bonusesGrantedSum: bonusSumMap.get(userId) ?? 0,
    }));

    rows = rows.filter(
      (r) =>
        r.clicksCount > 0 ||
        r.registrationsCount > 0 ||
        r.bonusesGrantedCount > 0 ||
        r.bonusesGrantedSum > 0,
    );

    const referrersCount = rows.length;

    const compare = (a: (typeof rows)[0], b: (typeof rows)[0]): number => {
      if (sort === "clicks") {
        const d = b.clicksCount - a.clicksCount;
        if (d !== 0) return d;
      } else if (sort === "bonuses") {
        const d = b.bonusesGrantedSum - a.bonusesGrantedSum;
        if (d !== 0) return d;
      } else {
        const d = b.registrationsCount - a.registrationsCount;
        if (d !== 0) return d;
      }
      const d2 = b.clicksCount - a.clicksCount;
      if (d2 !== 0) return d2;
      return b.registrationsCount - a.registrationsCount;
    };
    rows.sort(compare);

    if (q) {
      const allIds = rows.map((r) => r.userId);
      const matched =
        allIds.length === 0
          ? []
          : await prisma.user.findMany({
              where: {
                id: { in: allIds },
                OR: [
                  { email: { contains: q } },
                  { name: { contains: q } },
                  { username: { contains: q } },
                ],
              },
              select: { id: true },
            });
      const allowed = new Set(matched.map((u) => u.id));
      rows = rows.filter((r) => allowed.has(r.userId));
    }

    const totalFiltered = rows.length;
    const pages = Math.max(1, Math.ceil(totalFiltered / limit));
    const safePage = Math.min(page, pages);
    const skip = (safePage - 1) * limit;
    const pageRows = rows.slice(skip, skip + limit);
    const pageUserIds = pageRows.map((r) => r.userId);

    const users =
      pageUserIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: pageUserIds } },
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
              referralCode: true,
              createdAt: true,
            },
          })
        : [];

    const userMap = new Map(users.map((u) => [u.id, u]));

    const items = pageRows.map((r) => {
      const u = userMap.get(r.userId);
      const displayName =
        u?.name?.trim() ||
        (u?.username ? `@${u.username}` : null) ||
        u?.email?.split("@")[0] ||
        "—";
      return {
        userId: r.userId,
        displayName,
        email: u?.email ?? null,
        username: u?.username ?? null,
        referralCode: u?.referralCode ?? null,
        userCreatedAt: u?.createdAt?.toISOString() ?? null,
        clicksCount: r.clicksCount,
        registrationsCount: r.registrationsCount,
        bonusesGrantedCount: r.bonusesGrantedCount,
        bonusesGrantedSum: r.bonusesGrantedSum,
      };
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalClicks,
        totalRegistrations,
        referrersCount,
        totalBonusGrants: bonusTotals._count._all,
        totalBonusesSum:
          bonusTotals._sum.amountBonuses != null
            ? Number(bonusTotals._sum.amountBonuses)
            : 0,
      },
      items,
      page: safePage,
      limit,
      total: totalFiltered,
      pages,
      sort,
    });
  } catch (error) {
    console.error("[API Error] GET /api/admin/referrals:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статистику рефералов" },
      { status: 500 },
    );
  }
}
