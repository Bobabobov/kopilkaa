import { prisma } from "@/lib/db";

export type HeroBadge =
  | "observer"
  | "member"
  | "active"
  | "hero"
  | "honor"
  | "legend"
  | "tester"
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
 * - Manual override via heroBadgeOverride takes priority over computed badge
 */
export async function getHeroBadgeForUser(
  userId: string,
): Promise<HeroBadge | null> {
  try {
    // Check for manual override first (admin-assigned badges)
    try {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { heroBadgeOverride: true },
      });
      if (u?.heroBadgeOverride) {
        // Validate that override is a valid badge
        const validBadges: HeroBadge[] = [
          "observer",
          "member",
          "active",
          "hero",
          "honor",
          "legend",
          "tester",
          "custom",
        ];
        if (validBadges.includes(u.heroBadgeOverride as HeroBadge)) {
          return u.heroBadgeOverride as HeroBadge;
        }
      }
    } catch {
      // If DB is not migrated yet, continue to computed badge.
    }

    // Compute badge based on max payment
    const max = await prisma.donation.findFirst({
      where: { userId, type: "SUPPORT" },
      orderBy: { amount: "desc" },
      select: { amount: true },
    });
    const maxPaid = max?.amount ?? 0;
    const base = badgeByMaxPaid(maxPaid);
    return base;
  } catch {
    return null;
  }
}

/**
 * Batch version (for friends/search/lists) without N+1.
 */
export async function getHeroBadgesForUsers(
  userIds: string[],
): Promise<HeroBadgeMap> {
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

    // Check for manual overrides (admin-assigned badges) for all users
    try {
      const overrides = await prisma.user.findMany({
        where: { id: { in: limitedIds } },
        select: { id: true, heroBadgeOverride: true },
      });
      const validBadges: HeroBadge[] = [
        "observer",
        "member",
        "active",
        "hero",
        "honor",
        "legend",
        "tester",
        "custom",
      ];
      for (const u of overrides) {
        if (
          u.heroBadgeOverride &&
          validBadges.includes(u.heroBadgeOverride as HeroBadge)
        ) {
          map[u.id] = u.heroBadgeOverride as HeroBadge;
        }
      }
    } catch {
      // If DB is not migrated yet, ignore overrides and use computed badges.
    }

    // Compute badges based on max payment for users without override
    for (const g of grouped) {
      if (!g.userId) continue;
      // Skip if already has override
      if (map[g.userId]) continue;
      const maxPaid = g._max.amount ?? 0;
      const badge = badgeByMaxPaid(maxPaid);
      if (badge) map[g.userId] = badge;
    }

    return map;
  } catch {
    return {};
  }
}
