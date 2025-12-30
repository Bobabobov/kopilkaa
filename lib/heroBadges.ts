import { prisma } from "@/lib/db";

export type HeroBadge =
  | "observer"
  | "member"
  | "active"
  | "hero"
  | "honor"
  | "legend"
  | "custom";

export type HeroBadgeMap = Record<string, HeroBadge>;

function badgeByMaxPaid(maxPaid: number | null | undefined): HeroBadge | null {
  const v = typeof maxPaid === "number" ? maxPaid : 0;
  if (v < 100) return null;
  if (v < 300) return "observer";
  if (v < 500) return "member";
  if (v < 1000) return "active";
  if (v < 2000) return "hero";
  if (v < 5000) return "honor";
  return "legend";
}

/**
 * Hero badge reflects paid digital placement (Donation.type = SUPPORT).
 *
 * Rules:
 * - Based on MAX single payment amount (not count, not comment).
 * - If there are no payments => null
 *
 * NOTE about > 5000:
 * - Unique "custom" badges should be set manually (override) later.
 * - We do NOT auto-assign "custom" based on amount.
 */
export async function getHeroBadgeForUser(userId: string): Promise<HeroBadge | null> {
  try {
    const max = await prisma.donation.findFirst({
      where: { userId, type: "SUPPORT" },
      orderBy: { amount: "desc" },
      select: { amount: true },
    });
    const maxPaid = max?.amount ?? 0;
    const base = badgeByMaxPaid(maxPaid);
    if (!base) return null;

    // Manual override for unique badge (only for > 5000)
    if (maxPaid > 5000) {
      try {
        const u = await prisma.user.findUnique({
          where: { id: userId },
          select: { heroBadgeOverride: true },
        });
        if (u?.heroBadgeOverride) return "custom";
      } catch {
        // If DB is not migrated yet, fall back to computed badge.
      }
    }

    return base;
  } catch {
    return null;
  }
}

/**
 * Batch version (for friends/search/lists) without N+1.
 */
export async function getHeroBadgesForUsers(userIds: string[]): Promise<HeroBadgeMap> {
  const ids = Array.from(new Set(userIds.filter(Boolean)));
  if (ids.length === 0) return {};

  const limitedIds = ids.slice(0, 500);

  try {
    const grouped = await prisma.donation.groupBy({
      by: ["userId"],
      where: {
        userId: { in: limitedIds },
        type: "SUPPORT",
      },
      _max: { amount: true },
    });

    const map: HeroBadgeMap = {};
    const needsOverrideCheck: string[] = [];
    for (const g of grouped) {
      if (!g.userId) continue;
      const maxPaid = g._max.amount ?? 0;
      if (maxPaid > 5000) needsOverrideCheck.push(g.userId);
      const badge = badgeByMaxPaid(maxPaid);
      if (badge) map[g.userId] = badge;
    }

    // Unique "custom" badge is NOT auto-assigned: only when heroBadgeOverride is set.
    if (needsOverrideCheck.length > 0) {
      try {
        const overrides = await prisma.user.findMany({
          where: { id: { in: needsOverrideCheck } },
          select: { id: true, heroBadgeOverride: true },
        });
        for (const u of overrides) {
          if (u.heroBadgeOverride) map[u.id] = "custom";
        }
      } catch {
        // If DB is not migrated yet, ignore overrides and keep computed tiers.
      }
    }

    return map;
  } catch {
    return {};
  }
}


