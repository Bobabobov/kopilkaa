import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  DAILY_BONUS_AMOUNT,
  DAILY_BONUS_GRANT_COMMENT,
  DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX,
} from "@/lib/dailyBonus/constants";
import { toUtcDayKey } from "@/lib/dailyBonus/dayKey";
import {
  buildDailyBonusStatus,
  canClaimDailyBonus,
  computeNextStreakOnClaim,
  getMilestoneBonusForStreak,
  getStreakAfterClaim,
  type DailyBonusStatus,
} from "@/lib/dailyBonus/streakLogic";

export type DailyBonusClaimResult = DailyBonusStatus & {
  grantedDaily: number;
  grantedMilestone: number;
  totalGranted: number;
};

export class DailyBonusAlreadyClaimedError extends Error {
  constructor() {
    super("Сегодняшний бонус уже получен");
    this.name = "DailyBonusAlreadyClaimedError";
  }
}

async function getOrCreateState(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  return tx.dailyBonusState.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

type DailyBonusUserOptions = {
  isAdmin?: boolean;
};

export async function getDailyBonusStatusForUser(
  userId: string,
  now = new Date(),
  options: DailyBonusUserOptions = {},
): Promise<DailyBonusStatus> {
  const state = await prisma.dailyBonusState.findUnique({
    where: { userId },
  });

  const storedState = {
    currentStreak: state?.currentStreak ?? 0,
    lastClaimDate: state?.lastClaimDate ?? null,
    lastClaimAt: state?.lastClaimAt ?? null,
  };

  return buildDailyBonusStatus(
    storedState,
    toUtcDayKey(now),
    now.getTime(),
    options.isAdmin,
  );
}

export async function claimDailyBonusForUser(
  userId: string,
  now = new Date(),
  options: DailyBonusUserOptions = {},
): Promise<DailyBonusClaimResult> {
  const isAdmin = options.isAdmin ?? false;
  const todayKey = toUtcDayKey(now);
  const nowMs = now.getTime();
  const claimDateKey = isAdmin ? `${todayKey}#${nowMs}` : todayKey;

  try {
    return await prisma.$transaction(async (tx) => {
      const state = await getOrCreateState(tx, userId);

      if (!canClaimDailyBonus(state, todayKey, nowMs, isAdmin)) {
        throw new DailyBonusAlreadyClaimedError();
      }

      const newStreak = computeNextStreakOnClaim(state, todayKey, isAdmin);
      const milestoneBonus = getMilestoneBonusForStreak(newStreak);
      const streakAfter = getStreakAfterClaim(newStreak);
      const totalGranted = DAILY_BONUS_AMOUNT + milestoneBonus;

      await tx.dailyBonusClaim.create({
        data: {
          userId,
          claimDate: claimDateKey,
          dailyBonus: DAILY_BONUS_AMOUNT,
          milestoneBonus,
          streakAfter,
        },
      });

      await tx.dailyBonusState.update({
        where: { userId },
        data: {
          currentStreak: streakAfter,
          lastClaimDate: todayKey,
          lastClaimAt: now,
        },
      });

      await tx.goodDeedBonusGrant.create({
        data: {
          userId,
          amountBonuses: DAILY_BONUS_AMOUNT,
          comment: DAILY_BONUS_GRANT_COMMENT,
        },
      });

      if (milestoneBonus > 0) {
        await tx.goodDeedBonusGrant.create({
          data: {
            userId,
            amountBonuses: milestoneBonus,
            comment: `${DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX}${newStreak}`,
          },
        });
      }

      const status = buildDailyBonusStatus(
        {
          currentStreak: streakAfter,
          lastClaimDate: todayKey,
          lastClaimAt: now,
        },
        todayKey,
        nowMs,
        isAdmin,
      );

      return {
        ...status,
        grantedDaily: DAILY_BONUS_AMOUNT,
        grantedMilestone: milestoneBonus,
        totalGranted,
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DailyBonusAlreadyClaimedError();
    }
    throw error;
  }
}
