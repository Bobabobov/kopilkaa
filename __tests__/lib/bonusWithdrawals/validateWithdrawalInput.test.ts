import { describe, expect, it } from 'vitest';

import { parseBonusWithdrawalBody } from '@/lib/bonusWithdrawals/validateWithdrawalInput';

describe('parseBonusWithdrawalBody', () => {
  it('должно принять валидные данные СБП без ссылок', () => {
    const result = parseBonusWithdrawalBody({
      amountBonuses: 100,
      bankName: 'Сбербанк',
      details: '+7 (900) 123-45-67',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.details).toBe('+7 (900) 123-45-67');
    }
  });

  it('должно отклонить ссылку в названии банка', () => {
    const result = parseBonusWithdrawalBody({
      amountBonuses: 100,
      bankName: 't.me/bank',
      details: '+7 (900) 123-45-67',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('ссыл');
    }
  });

  it('должно отклонить банк не из списка', () => {
    const result = parseBonusWithdrawalBody({
      amountBonuses: 100,
      bankName: 'Несуществующий банк XYZ',
      details: '+7 (900) 123-45-67',
    });
    expect(result.ok).toBe(false);
  });

  it('должно принять казахстанский банк с номером KZ', () => {
    const result = parseBonusWithdrawalBody({
      amountBonuses: 100,
      bankName: 'Kaspi Bank',
      details: '+7 (701) 123-45-67',
    });
    expect(result.ok).toBe(true);
  });
});
