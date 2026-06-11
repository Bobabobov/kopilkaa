import { prisma } from "@/lib/db";
import { ensureAchievementCatalog } from "@/lib/achievements/ensureCatalog";
import type { AchievementSlug } from "@/lib/achievements/definitions";
import { getAchievementProgress } from "@/lib/achievements/progress";
import { getPinnedSlugsForUser } from "@/lib/achievements/pins";
import { syncAllEligibleAchievements } from "@/lib/achievements/unlock";

export type UserAchievementItem = {
  slug: AchievementSlug;
  name: string;
  description: string;
  hint: string | null;
  icon: string;
  rarity: string;
  targetValue: number;
  progress: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type UserAchievementsPayload = {
  items: UserAchievementItem[];
  unlockedCount: number;
  totalCount: number;
  pinnedSlugs: string[];
};

export async function getUserAchievements(
  userId: string,
): Promise<UserAchievementsPayload> {
  await ensureAchievementCatalog();
  await syncAllEligibleAchievements(userId);

  const [catalog, unlockedRows] = await Promise.all([
    prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        hint: true,
        icon: true,
        rarity: true,
        targetValue: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      select: {
        achievementId: true,
        progress: true,
        unlockedAt: true,
      },
    }),
  ]);

  const unlockedByAchievementId = new Map(
    unlockedRows.map((row) => [row.achievementId, row]),
  );

  const items: UserAchievementItem[] = [];

  for (const achievement of catalog) {
    const unlocked = unlockedByAchievementId.get(achievement.id);
    const progress = unlocked
      ? Math.max(unlocked.progress, achievement.targetValue)
      : await getAchievementProgress(userId, achievement.slug as AchievementSlug);

    items.push({
      slug: achievement.slug as AchievementSlug,
      name: achievement.name,
      description: achievement.description,
      hint: achievement.hint,
      icon: achievement.icon,
      rarity: achievement.rarity,
      targetValue: achievement.targetValue,
      progress: Math.min(progress, achievement.targetValue),
      unlocked: Boolean(unlocked),
      unlockedAt: unlocked?.unlockedAt.toISOString() ?? null,
    });
  }

  const unlockedCount = items.filter((item) => item.unlocked).length;
  const pinnedSlugs = await getPinnedSlugsForUser(userId);

  return {
    items,
    unlockedCount,
    totalCount: items.length,
    pinnedSlugs,
  };
}

/** Публичный просмотр ачивок другого пользователя — только полученные, без синхронизации. */
export async function getUserAchievementsForViewer(
  userId: string,
): Promise<{
  items: UserAchievementItem[];
  unlockedCount: number;
  totalCount: number;
}> {
  await ensureAchievementCatalog();

  const [catalog, unlockedRows] = await Promise.all([
    prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        rarity: true,
        targetValue: true,
      },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      select: {
        achievementId: true,
        progress: true,
        unlockedAt: true,
      },
    }),
  ]);

  const unlockedByAchievementId = new Map(
    unlockedRows.map((row) => [row.achievementId, row]),
  );

  const items: UserAchievementItem[] = [];

  for (const achievement of catalog) {
    const unlocked = unlockedByAchievementId.get(achievement.id);
    if (!unlocked) continue;

    items.push({
      slug: achievement.slug as AchievementSlug,
      name: achievement.name,
      description: achievement.description,
      hint: null,
      icon: achievement.icon,
      rarity: achievement.rarity,
      targetValue: achievement.targetValue,
      progress: Math.max(unlocked.progress, achievement.targetValue),
      unlocked: true,
      unlockedAt: unlocked.unlockedAt.toISOString(),
    });
  }

  return {
    items,
    unlockedCount: items.length,
    totalCount: catalog.length,
  };
}
