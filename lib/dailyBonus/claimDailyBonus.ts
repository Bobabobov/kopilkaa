import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  DAILY_BONUS_AMOUNT,
  DAILY_BONUS_GRANT_COMMENT,
  DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX,
  DAILY_BONUS_RISK_LOSS_GRANT_COMMENT,
  DAILY_BONUS_RISK_WIN_AMOUNT,
  DAILY_BONUS_RISK_WIN_GRANT_COMMENT,
} from "@/lib/dailyBonus/constants";
import { toUtcDayKey } from "@/lib/dailyBonus/dayKey";
import { rollDailyBonusRiskWin } from "@/lib/dailyBonus/riskRoll";
import {
  buildDailyBonusStatus,
  canClaimDailyBonus,
  computeNextStreakOnClaim,
  getMilestoneBonusForStreak,
  getStreakAfterClaim,
  type DailyBonusStatus,
} from "@/lib/dailyBonus/streakLogic";
import { computeGoodDeedBonusWalletInTx } from "@/lib/goodDeedBonusWallet";

export type DailyBonusClaimResult = DailyBonusStatus & {
  grantedDaily: number;
  grantedMilestone: number;
  totalGranted: number;
  claimMode?: "safe";
};

export type DailyBonusRiskClaimResult = DailyBonusStatus & {
  claimMode: "risk";
  riskWon: boolean;
  grantedDaily: number;
  grantedMilestone: number;
  totalGranted: number;
  lostBonuses: number;
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
      const grantedDaily = DAILY_BONUS_AMOUNT;
      const totalGranted = grantedDaily + milestoneBonus;

      await tx.dailyBonusClaim.create({
        data: {
          userId,
          claimDate: claimDateKey,
          dailyBonus: grantedDaily,
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
          amountBonuses: grantedDaily,
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
        claimMode: "safe",
        grantedDaily,
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

export async function claimDailyBonusRiskForUser(
  userId: string,
  now = new Date(),
  options: DailyBonusUserOptions = {},
): Promise<DailyBonusRiskClaimResult> {
  const isAdmin = options.isAdmin ?? false;
  const todayKey = toUtcDayKey(now);
  const nowMs = now.getTime();
  const claimDateKey = isAdmin ? `${todayKey}#${nowMs}` : todayKey;
  const riskWon = rollDailyBonusRiskWin();

  try {
    return await prisma.$transaction(async (tx) => {
      const state = await getOrCreateState(tx, userId);

      if (!canClaimDailyBonus(state, todayKey, nowMs, isAdmin)) {
        throw new DailyBonusAlreadyClaimedError();
      }

      const streakAfter = 0;
      let grantedDaily = 0;
      let lostBonuses = 0;

      if (riskWon) {
        grantedDaily = DAILY_BONUS_RISK_WIN_AMOUNT;
        await tx.goodDeedBonusGrant.create({
          data: {
            userId,
            amountBonuses: DAILY_BONUS_RISK_WIN_AMOUNT,
            comment: DAILY_BONUS_RISK_WIN_GRANT_COMMENT,
          },
        });
      } else {
        const wallet = await computeGoodDeedBonusWalletInTx(tx, userId);
        lostBonuses = wallet.availableBonuses;
        if (lostBonuses > 0) {
          await tx.goodDeedBonusGrant.create({
            data: {
              userId,
              amountBonuses: -lostBonuses,
              comment: DAILY_BONUS_RISK_LOSS_GRANT_COMMENT,
            },
          });
        }
      }

      await tx.dailyBonusClaim.create({
        data: {
          userId,
          claimDate: claimDateKey,
          dailyBonus: riskWon ? DAILY_BONUS_RISK_WIN_AMOUNT : -lostBonuses,
          milestoneBonus: 0,
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

      const totalGranted = grantedDaily - lostBonuses;

      return {
        ...status,
        claimMode: "risk",
        riskWon,
        grantedDaily,
        grantedMilestone: 0,
        totalGranted,
        lostBonuses,
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
