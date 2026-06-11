import { prisma } from "@/lib/db";
import { ensureAchievementCatalog } from "@/lib/achievements/ensureCatalog";
import {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_SLUGS,
  type AchievementSlug,
} from "@/lib/achievements/definitions";
import { getAchievementProgress } from "@/lib/achievements/progress";
import { computeLoginStreakOnVisit } from "@/lib/achievements/loginStreak";
import { toUtcDayKey } from "@/lib/dailyBonus/dayKey";

export type UnlockedAchievementPayload = {
  slug: AchievementSlug;
  name: string;
  description: string;
  icon: string;
};

/** Выдаёт ачивку, если её ещё нет у пользователя. */
export async function grantAchievement(
  userId: string,
  slug: AchievementSlug,
  progress?: number,
): Promise<UnlockedAchievementPayload | null> {
  await ensureAchievementCatalog();

  const achievement = await prisma.achievement.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      icon: true,
      targetValue: true,
    },
  });

  if (!achievement) return null;

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
    select: { id: true },
  });

  if (existing) return null;

  try {
    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
        progress: progress ?? achievement.targetValue,
      },
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return null;
    }
    throw error;
  }

  return {
    slug: achievement.slug as AchievementSlug,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
  };
}

export async function grantWelcomeAchievement(
  userId: string,
): Promise<UnlockedAchievementPayload | null> {
  return grantAchievement(userId, ACHIEVEMENT_SLUGS.WELCOME, 1);
}

/** Проверяет прогресс и выдаёт ачивку при достижении цели. */
export async function checkAndUnlockAchievement(
  userId: string,
  slug: AchievementSlug,
): Promise<UnlockedAchievementPayload | null> {
  await ensureAchievementCatalog();

  const def = ACHIEVEMENT_DEFINITIONS.find((item) => item.slug === slug);
  if (!def) return null;

  const achievement = await prisma.achievement.findUnique({
    where: { slug },
    select: { id: true, targetValue: true },
  });
  if (!achievement) return null;

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
    select: { id: true },
  });
  if (existing) return null;

  const progress = await getAchievementProgress(userId, slug);
  if (progress < achievement.targetValue) return null;

  return grantAchievement(userId, slug, progress);
}

/** Обновляет серию визитов и при необходимости выдаёт ачивку за 7 дней. */
export async function trackLoginVisit(
  userId: string,
): Promise<UnlockedAchievementPayload | null> {
  const todayKey = toUtcDayKey(new Date());

  const state = await prisma.loginStreakState.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak: 1,
      maxStreak: 1,
      lastVisitDate: todayKey,
    },
    update: {},
    select: {
      currentStreak: true,
      maxStreak: true,
      lastVisitDate: true,
    },
  });

  const next = computeLoginStreakOnVisit(state, todayKey);

  if (!next.alreadyVisitedToday) {
    await prisma.loginStreakState.update({
      where: { userId },
      data: {
        currentStreak: next.currentStreak,
        maxStreak: next.maxStreak,
        lastVisitDate: todayKey,
      },
    });
  }

  const loginStreakTarget =
    ACHIEVEMENT_DEFINITIONS.find(
      (item) => item.slug === ACHIEVEMENT_SLUGS.LOGIN_STREAK_7,
    )?.targetValue ?? 7;

  if (next.currentStreak >= loginStreakTarget) {
    return checkAndUnlockAchievement(userId, ACHIEVEMENT_SLUGS.LOGIN_STREAK_7);
  }

  return null;
}

export async function syncProgressAchievements(
  userId: string,
  slugs: AchievementSlug[],
): Promise<UnlockedAchievementPayload[]> {
  const unlocked: UnlockedAchievementPayload[] = [];

  for (const slug of slugs) {
    const result = await checkAndUnlockAchievement(userId, slug);
    if (result) unlocked.push(result);
  }

  return unlocked;
}

/** Синхронизирует все ачивки по фактическому прогрессу (в т.ч. для старых пользователей). */
export async function syncAllEligibleAchievements(
  userId: string,
): Promise<UnlockedAchievementPayload[]> {
  const slugs = ACHIEVEMENT_DEFINITIONS.map((item) => item.slug);
  return syncProgressAchievements(userId, slugs);
}
