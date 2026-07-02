import { MIN_WITHDRAWAL_REDUCED_FROM_LEVEL } from '@/lib/bonusWithdrawals/constants';

/** Комиссия на 3 уровне. */
export const WITHDRAWAL_COMMISSION_RATE_LEVEL_3 = 0.1;
/** Комиссия с 4 уровня и выше. */
export const WITHDRAWAL_COMMISSION_RATE_LEVEL_4_PLUS = 0.08;

export type WithdrawalPayoutBreakdown = {
  /** Сумма заявки — списывается с баланса бонусов. */
  amountBonuses: number;
  /** Удержание комиссии в рублях (1 бонус номинально = 1 ₽). */
  commissionRubles: number;
  /** Сумма перевода на СБП. */
  payoutRubles: number;
};

export function getWithdrawalCommissionRate(profileLevel: number): number {
  return profileLevel >= MIN_WITHDRAWAL_REDUCED_FROM_LEVEL
    ? WITHDRAWAL_COMMISSION_RATE_LEVEL_4_PLUS
    : WITHDRAWAL_COMMISSION_RATE_LEVEL_3;
}

export function getWithdrawalCommissionPercent(profileLevel: number): number {
  return Math.round(getWithdrawalCommissionRate(profileLevel) * 100);
}

export function calculateWithdrawalPayout(
  amountBonuses: number,
  profileLevel: number,
): WithdrawalPayoutBreakdown {
  const safeAmount = Math.max(0, Math.floor(amountBonuses));
  const commissionRate = getWithdrawalCommissionRate(profileLevel);
  const payoutRubles = Math.floor(safeAmount * (1 - commissionRate));
  const commissionRubles = safeAmount - payoutRubles;

  return {
    amountBonuses: safeAmount,
    commissionRubles,
    payoutRubles,
  };
}

/** Перк вехи 3: комиссия на вывод. */
export function formatWithdrawalCommissionPerk(): string {
  const payoutFromHundred = calculateWithdrawalPayout(100, 3).payoutRubles;
  return `Комиссия на вывод — ${getWithdrawalCommissionPercent(3)}% (100 бон. → ${payoutFromHundred} ₽ на СБП)`;
}

export function formatLevelWithdrawalPerk(
  minWithdrawalBonuses: number,
  profileLevel: number,
): string {
  return `Вывод на СБП от ${minWithdrawalBonuses} бон. · комиссия ${getWithdrawalCommissionPercent(profileLevel)}%`;
}

/** Краткая подсказка для карточки вывода. */
export function formatWithdrawalCommissionHint(profileLevel: number): string {
  return `Комиссия ${getWithdrawalCommissionPercent(profileLevel)}%.`;
}

/** Отдельный перк для 4 уровня: снижение комиссии. */
export function formatReducedCommissionPerk(): string {
  return `Комиссия на вывод: ${getWithdrawalCommissionPercent(4)}% (на 3 уровне — ${getWithdrawalCommissionPercent(3)}%)`;
}
