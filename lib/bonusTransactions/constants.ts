/** Типы операций с бонусами */
export const BONUS_TRANSACTION_TYPES = {
  APPLICATION_SUBMIT_FEE: 'APPLICATION_SUBMIT_FEE',
} as const;

export type BonusTransactionType =
  (typeof BONUS_TRANSACTION_TYPES)[keyof typeof BONUS_TRANSACTION_TYPES];

export const BONUS_TRANSACTION_DESCRIPTIONS = {
  APPLICATION_SUBMIT_FEE: 'Списание бонусов за публикацию истории',
  FIRST_APPLICATION_FREE: 'Первая история бесплатно',
} as const;
