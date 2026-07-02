import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  DAILY_CHEST_CLAIM_COOLDOWN_MS,
  DAILY_CHEST_GRANT_COMMENT,
  DAILY_CHEST_MAX,
  DAILY_CHEST_MIN,
} from "@/lib/dailyChest/constants";
import { toUtcDayKey } from "@/lib/dailyBonus/dayKey";
import { rollDailyChestAmount } from "@/lib/dailyChest/rollDailyChest";

export type DailyChestStatus = {
  canClaim: boolean;
  claimedToday: boolean;
  chestMin: number;
  chestMax: number;
  lastClaimAt: string | null;
  isAdminTestMode?: boolean;
};

export type DailyChestClaimResult = DailyChestStatus & {
  amount: number;
};

export class DailyChestAlreadyClaimedError extends Error {
  constructor() {
    super("Сегодняшний сундук уже открыт");
    this.name = "DailyChestAlreadyClaimedError";
  }
}

type DailyChestStoredState = {
  lastClaimDate: string | null;
  lastClaimAt: Date | null;
};

type DailyChestUserOptions = {
  isAdmin?: boolean;
};

function canClaimDailyChest(
  state: DailyChestStoredState,
  todayKey: string,
  nowMs: number,
  isAdmin = false,
): boolean {
  if (isAdmin) return true;
  if (state.lastClaimDate === todayKey) return false;
  if (
    state.lastClaimAt &&
    nowMs - state.lastClaimAt.getTime() < DAILY_CHEST_CLAIM_COOLDOWN_MS
  ) {
    return false;
  }
  return true;
}

function buildDailyChestStatus(
  state: DailyChestStoredState,
  todayKey: string,
  nowMs: number,
  isAdmin = false,
): DailyChestStatus {
  const claimedToday = state.lastClaimDate === todayKey;
  const canClaim = canClaimDailyChest(state, todayKey, nowMs, isAdmin);

  return {
    canClaim,
    claimedToday,
    chestMin: DAILY_CHEST_MIN,
    chestMax: DAILY_CHEST_MAX,
    lastClaimAt: state.lastClaimAt?.toISOString() ?? null,
    ...(isAdmin ? { isAdminTestMode: true } : {}),
  };
}

async function getOrCreateState(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  return tx.dailyChestState.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getDailyChestStatusForUser(
  userId: string,
  now = new Date(),
  options: DailyChestUserOptions = {},
): Promise<DailyChestStatus> {
  const state = await prisma.dailyChestState.findUnique({
    where: { userId },
  });

  return buildDailyChestStatus(
    {
      lastClaimDate: state?.lastClaimDate ?? null,
      lastClaimAt: state?.lastClaimAt ?? null,
    },
    toUtcDayKey(now),
    now.getTime(),
    options.isAdmin,
  );
}

export async function claimDailyChestForUser(
  userId: string,
  now = new Date(),
  options: DailyChestUserOptions = {},
): Promise<DailyChestClaimResult> {
  const isAdmin = options.isAdmin ?? false;
  const todayKey = toUtcDayKey(now);
  const nowMs = now.getTime();
  const claimDateKey = isAdmin ? `${todayKey}#${nowMs}` : todayKey;

  try {
    return await prisma.$transaction(async (tx) => {
      const state = await getOrCreateState(tx, userId);

      if (!canClaimDailyChest(state, todayKey, nowMs, isAdmin)) {
        throw new DailyChestAlreadyClaimedError();
      }

      const amount = rollDailyChestAmount();

      await tx.dailyChestClaim.create({
        data: {
          userId,
          claimDate: claimDateKey,
          amount,
        },
      });

      await tx.dailyChestState.update({
        where: { userId },
        data: {
          lastClaimDate: todayKey,
          lastClaimAt: now,
        },
      });

      if (amount > 0) {
        await tx.goodDeedBonusGrant.create({
          data: {
            userId,
            amountBonuses: amount,
            comment: DAILY_CHEST_GRANT_COMMENT,
          },
        });
      }

      const status = buildDailyChestStatus(
        {
          lastClaimDate: todayKey,
          lastClaimAt: now,
        },
        todayKey,
        nowMs,
        isAdmin,
      );

      return {
        ...status,
        amount,
      };
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DailyChestAlreadyClaimedError();
    }
    throw error;
  }
}
