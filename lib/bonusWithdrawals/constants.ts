/** Минимальная сумма вывода на 3 уровне (номинал 1 бонус = 1 ₽; комиссия: 10% на 3 ур., 8% с 4 ур.). */
export const MIN_WITHDRAWAL_BONUSES_LEVEL_3 = 100;

/** Минимальная сумма вывода с 4 уровня. */
export const MIN_WITHDRAWAL_BONUSES_LEVEL_4_PLUS = 50;

/** Уровень, с которого снижается минимум вывода. */
export const MIN_WITHDRAWAL_REDUCED_FROM_LEVEL = 4;

/** @deprecated Используйте getMinWithdrawalBonuses(profileLevel) */
export const MIN_WITHDRAWAL_BONUSES = MIN_WITHDRAWAL_BONUSES_LEVEL_3;

/** Минимальный уровень профиля для вывода бонусов. */
export const MIN_WITHDRAWAL_PROFILE_LEVEL = 3;

export function getMinWithdrawalBonuses(profileLevel: number): number {
  return profileLevel >= MIN_WITHDRAWAL_REDUCED_FROM_LEVEL
    ? MIN_WITHDRAWAL_BONUSES_LEVEL_4_PLUS
    : MIN_WITHDRAWAL_BONUSES_LEVEL_3;
}

/** Максимальная длина названия банка из справочника СБП. */
export const WITHDRAWAL_BANK_MAX_LEN = 120;

/** В details хранится номер телефона для СБП. */
export const WITHDRAWAL_PHONE_MAX_LEN = 40;
