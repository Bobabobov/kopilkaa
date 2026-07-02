import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { getLevelFromExperience } from '@/lib/userLevel/calculate';
import { toDisplayExperience } from '@/lib/userLevel/economy';

export interface SyncedUserLevel {
  level: number;
  experience: number;
  bonusesInLevel: number;
}

type DbClient = Prisma.TransactionClient | typeof prisma;

/**
 * @deprecated Автовложение отключено. Только выравнивает level по experience.
 */
export async function syncUserLevelFromBonuses(
  userId: string,
  db: DbClient = prisma,
): Promise<SyncedUserLevel> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { experience: true, level: true },
  });

  if (!user) {
    return { level: 1, experience: 0, bonusesInLevel: 0 };
  }

  const displayExperience = toDisplayExperience(user.experience);
  const level = getLevelFromExperience(displayExperience);
  if (level !== user.level) {
    await db.user.update({
      where: { id: userId },
      data: { level },
    });
  }

  const wallet = await computeGoodDeedBonusWalletInTx(db, userId);

  return {
    level,
    experience: displayExperience,
    bonusesInLevel: wallet.availableBonuses,
  };
}
