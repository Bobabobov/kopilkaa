import { GoodDeedWithdrawalStatus } from '@prisma/client';

import { digitsFingerprint } from '@/lib/admin/requisitesFingerprint';
import {
  getMinWithdrawalBonuses,
  MIN_WITHDRAWAL_PROFILE_LEVEL,
} from '@/lib/bonusWithdrawals/constants';
import type { BonusWithdrawalBody } from '@/lib/bonusWithdrawals/validateWithdrawalInput';
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from '@/lib/admin/bonusWithdrawalBlock';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';

export class BonusWithdrawalValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BonusWithdrawalValidationError';
  }
}

export class BonusWithdrawalPendingError extends Error {
  constructor() {
    super('У вас уже есть запрос на вывод гонорара на проверке');
    this.name = 'BonusWithdrawalPendingError';
  }
}

export async function createBonusWithdrawalRequest(
  userId: string,
  input: BonusWithdrawalBody,
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { bonusWithdrawalBlocked: true, level: true, experience: true },
    });

    if (!user) {
      throw new BonusWithdrawalValidationError('Пользователь не найден');
    }

    const profileLevel = resolveUserProfileLevel(user);

    if (user.bonusWithdrawalBlocked) {
      throw new BonusWithdrawalValidationError(BONUS_WITHDRAWAL_BLOCKED_MESSAGE);
    }

    if (profileLevel < MIN_WITHDRAWAL_PROFILE_LEVEL) {
      throw new BonusWithdrawalValidationError(
        `Вывод гонорара доступен с ${MIN_WITHDRAWAL_PROFILE_LEVEL} уровня профиля`,
      );
    }

    const minWithdrawalBonuses = getMinWithdrawalBonuses(profileLevel);
    if (input.amountBonuses < minWithdrawalBonuses) {
      throw new BonusWithdrawalValidationError(
        `Минимальная сумма вывода — ${minWithdrawalBonuses} бонусов`,
      );
    }

    const pending = await tx.goodDeedWithdrawalRequest.findFirst({
      where: {
        userId,
        status: GoodDeedWithdrawalStatus.PENDING,
      },
      select: { id: true },
    });

    if (pending) {
      throw new BonusWithdrawalPendingError();
    }

    const wallet = await computeGoodDeedBonusWalletInTx(tx, userId);

    if (wallet.withdrawalsDisabled) {
      throw new BonusWithdrawalValidationError(
        'Вывод гонорара временно недоступен',
      );
    }

    if (input.amountBonuses > wallet.availableBonuses) {
      throw new BonusWithdrawalValidationError(
        `Недостаточно бонусов. Доступно: ${wallet.availableBonuses}`,
      );
    }

    const bankName = input.bankName.trim();
    const details = input.details.trim();

    const created = await tx.goodDeedWithdrawalRequest.create({
      data: {
        userId,
        amountBonuses: input.amountBonuses,
        bankName,
        details,
        detailsFingerprint: digitsFingerprint(details),
        status: GoodDeedWithdrawalStatus.PENDING,
      },
      select: {
        id: true,
        amountBonuses: true,
        status: true,
        createdAt: true,
      },
    });

    return created;
  });
}
