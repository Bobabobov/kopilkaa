import { prisma } from "@/lib/db";
import { ensureAchievementCatalog } from "@/lib/achievements/ensureCatalog";
import type { AchievementSlug } from "@/lib/achievements/definitions";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/definitions";

export type ProfileAchievementShowcaseItem = {
  slug: AchievementSlug;
  name: string;
  icon: string;
};

const VALID_SLUGS = new Set(
  ACHIEVEMENT_DEFINITIONS.map((item) => item.slug),
);

export function normalizePinnedSlugs(raw: unknown): AchievementSlug[] {
  if (!Array.isArray(raw)) return [];

  const result: AchievementSlug[] = [];
  for (const entry of raw) {
    if (typeof entry !== "string") continue;
    const slug = entry.trim() as AchievementSlug;
    if (!VALID_SLUGS.has(slug)) continue;
    if (result.includes(slug)) continue;
    result.push(slug);
  }

  return result;
}

export async function getPinnedSlugsForUser(
  userId: string,
): Promise<AchievementSlug[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { profileAchievementPins: true },
  });

  return normalizePinnedSlugs(user?.profileAchievementPins);
}

export async function getProfileAchievementShowcase(
  userId: string,
): Promise<ProfileAchievementShowcaseItem[]> {
  await ensureAchievementCatalog();

  const [pinnedSlugs, unlockedRows] = await Promise.all([
    getPinnedSlugsForUser(userId),
    prisma.userAchievement.findMany({
      where: { userId },
      select: {
        achievement: {
          select: { slug: true, name: true, icon: true },
        },
      },
    }),
  ]);

  if (!pinnedSlugs.length) return [];

  const unlockedBySlug = new Map(
    unlockedRows.map((row) => [row.achievement.slug, row.achievement]),
  );

  const showcase: ProfileAchievementShowcaseItem[] = [];
  for (const slug of pinnedSlugs) {
    const achievement = unlockedBySlug.get(slug);
    if (!achievement) continue;
    showcase.push({
      slug: achievement.slug as AchievementSlug,
      name: achievement.name,
      icon: achievement.icon,
    });
  }

  return showcase;
}

export async function updateProfileAchievementPins(
  userId: string,
  requestedSlugs: unknown,
): Promise<AchievementSlug[]> {
  const slugs = normalizePinnedSlugs(requestedSlugs);
  if (!slugs.length) {
    await prisma.user.update({
      where: { id: userId },
      data: { profileAchievementPins: [] },
    });
    return [];
  }

  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievement: { select: { slug: true } } },
  });
  const unlockedSlugs = new Set(unlocked.map((row) => row.achievement.slug));

  const validSlugs = slugs.filter((slug) => unlockedSlugs.has(slug));
  if (validSlugs.length !== slugs.length) {
    throw new Error("INVALID_PINS");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { profileAchievementPins: validSlugs },
  });

  return validSlugs;
}
