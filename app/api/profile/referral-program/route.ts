import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ensureReferralCodeForUser,
  getReferralMinActiveDays,
} from "@/lib/referralProgram";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(dayKey: string): string {
  const d = new Date(`${dayKey}T00:00:00.000Z`);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.uid;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, createdAt: true, referralCode: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const minActiveDays = getReferralMinActiveDays();
    const availableAtMs =
      user.createdAt.getTime() + minActiveDays * 24 * 60 * 60 * 1000;
    const nowMs = Date.now();
    const available = nowMs >= availableAtMs;

    const referralCode = user.referralCode
      ? user.referralCode
      : await ensureReferralCodeForUser(userId);

    const [transitionsCount, registrationsCount, registrations] =
      await Promise.all([
        prisma.referralClick.count({ where: { referrerUserId: userId } }),
        prisma.referralRegistration.count({
          where: { referrerUserId: userId },
        }),
        prisma.referralRegistration.findMany({
          where: { referrerUserId: userId },
          select: {
            referredUserId: true,
            createdAt: true,
            bonusGrantedAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
      ]);

    const referredUserIds = registrations.map((r) => r.referredUserId);
    const referredUsers = referredUserIds.length
      ? await prisma.user.findMany({
          where: { id: { in: referredUserIds } },
          select: { id: true, name: true, username: true, avatar: true },
        })
      : [];

    const referredUserMap = new Map(referredUsers.map((u) => [u.id, u]));

    const items = await Promise.all(
      registrations.map(async (reg) => {
        const referredUser = referredUserMap.get(reg.referredUserId);
        if (!referredUser) return null;

        const baseWhere = {
          userId: reg.referredUserId,
          createdAt: { gte: reg.createdAt },
        };

        const [submissionsCount, approvedCount, rejectedCount] =
          await Promise.all([
            prisma.application.count({ where: baseWhere }),
            prisma.application.count({
              where: { ...baseWhere, status: "APPROVED" },
            }),
            prisma.application.count({
              where: { ...baseWhere, status: "REJECTED" },
            }),
          ]);

        const displayName = referredUser.name?.trim()
          ? referredUser.name
          : referredUser.username
            ? `@${referredUser.username}`
            : "Пользователь";

        return {
          referredUserId: reg.referredUserId,
          registeredAt: reg.createdAt,
          bonusGrantedAt: reg.bonusGrantedAt,
          displayName,
          avatar: referredUser.avatar,
          submissionsCount,
          approvedCount,
          rejectedCount,
        };
      }),
    );

    const filteredItems = items.filter(
      (v): v is NonNullable<typeof v> => v !== null,
    );

    const totals = filteredItems.reduce(
      (acc, it) => {
        acc.submissions += it.submissionsCount;
        acc.approved += it.approvedCount;
        acc.rejected += it.rejectedCount;
        return acc;
      },
      { submissions: 0, approved: 0, rejected: 0 },
    );

    const sinceDate = new Date(Date.now() - 29 * DAY_MS);
    const [recentClicks, recentRegistrations] = await Promise.all([
      prisma.referralClick.findMany({
        where: {
          referrerUserId: userId,
          createdAt: { gte: sinceDate },
        },
        select: { createdAt: true },
      }),
      prisma.referralRegistration.findMany({
        where: {
          referrerUserId: userId,
          createdAt: { gte: sinceDate },
        },
        select: { createdAt: true },
      }),
    ]);

    const dayMap = new Map<
      string,
      {
        dayKey: string;
        dayLabel: string;
        clicks: number;
        registrations: number;
      }
    >();

    for (let i = 29; i >= 0; i -= 1) {
      const day = new Date(Date.now() - i * DAY_MS);
      const dayKey = toDayKey(day);
      dayMap.set(dayKey, {
        dayKey,
        dayLabel: formatDayLabel(dayKey),
        clicks: 0,
        registrations: 0,
      });
    }

    for (const click of recentClicks) {
      const key = toDayKey(click.createdAt);
      const row = dayMap.get(key);
      if (row) row.clicks += 1;
    }

    for (const reg of recentRegistrations) {
      const key = toDayKey(reg.createdAt);
      const row = dayMap.get(key);
      if (row) row.registrations += 1;
    }

    const timeline = Array.from(dayMap.values());

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru";
    const base = siteUrl.replace(/\/+$/, "");
    const referralUrl = `${base}/ref/${referralCode}`;

    return NextResponse.json({
      ok: true,
      referralUrl,
      availability: {
        available,
        availableAtMs,
      },
      stats: {
        transitionsCount,
        registrationsCount,
        submissionsCount: totals.submissions,
        approvedCount: totals.approved,
        rejectedCount: totals.rejected,
      },
      referred: {
        items: filteredItems,
        limitedTo: 20,
      },
      timeline: {
        last30Days: timeline,
      },
      meta: {
        minActiveDays,
      },
    });
  } catch (error) {
    console.error("[referral-program] GET error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить реферальную программу" },
      { status: 500 },
    );
  }
}
