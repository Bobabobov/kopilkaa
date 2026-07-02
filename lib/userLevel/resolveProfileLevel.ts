import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getLevelFromExperience } from '@/lib/userLevel/calculate';
import { toDisplayExperience } from '@/lib/userLevel/economy';

type DbClient = Prisma.TransactionClient | typeof prisma;

/** Уровень профиля по опыту — единый источник правды для лимитов и привилегий. */
export function resolveUserProfileLevel(user: {
  level?: number | null;
  experience?: number | null;
}): number {
  return getLevelFromExperience(toDisplayExperience(user.experience ?? 0));
}

/** Выравнивает поле user.level с опытом, если админка или старые данные разошлись. */
export async function syncUserProfileLevelIfStale(
  userId: string,
  user: { level?: number | null; experience?: number | null },
  db: DbClient = prisma,
): Promise<number> {
  const resolvedLevel = resolveUserProfileLevel(user);
  if ((user.level ?? 1) !== resolvedLevel) {
    await db.user.update({
      where: { id: userId },
      data: { level: resolvedLevel },
    });
  }
  return resolvedLevel;
}
