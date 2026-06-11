import { prisma } from "@/lib/db";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/definitions";

let catalogEnsurePromise: Promise<void> | null = null;

/** Идемпотентно синхронизирует каталог ачивок с кодом. */
export async function ensureAchievementCatalog(): Promise<void> {
  if (catalogEnsurePromise) {
    await catalogEnsurePromise;
    return;
  }

  catalogEnsurePromise = (async () => {
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      await prisma.achievement.upsert({
        where: { slug: def.slug },
        create: {
          slug: def.slug,
          name: def.name,
          description: def.description,
          hint: def.hint,
          icon: def.icon,
          rarity: def.rarity,
          targetValue: def.targetValue,
          sortOrder: def.sortOrder,
          isActive: true,
        },
        update: {
          name: def.name,
          description: def.description,
          hint: def.hint,
          icon: def.icon,
          rarity: def.rarity,
          targetValue: def.targetValue,
          sortOrder: def.sortOrder,
          isActive: true,
        },
      });
    }
  })();

  try {
    await catalogEnsurePromise;
  } finally {
    catalogEnsurePromise = null;
  }
}
