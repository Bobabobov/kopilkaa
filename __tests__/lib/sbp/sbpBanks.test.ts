import { describe, expect, it } from 'vitest';
import {
  filterSbpBanks,
  getSbpBankErrorForPhone,
} from '@/lib/sbp/sbpBanks';
import { normalizeBankSearchKey } from '@/lib/sbp/russianBanks';

describe('filterSbpBanks', () => {
  it('должно находить Kaspi Bank для Казахстана', () => {
    expect(filterSbpBanks('kaspi', 'KZ')[0]).toBe('Kaspi Bank');
  });

  it('должно возвращать белорусские банки', () => {
    const banks = filterSbpBanks('беларус', 'BY');
    expect(banks[0]).toBe('Беларусбанк');
  });

  it('должно находить Т-Банк по запросу «тбанк»', () => {
    expect(filterSbpBanks('тбанк', 'RU')[0]).toBe('Т-Банк');
  });

  it('должно находить Сбербанк по «сбер»', () => {
    expect(filterSbpBanks('сбер', 'RU')[0]).toBe('Сбербанк');
  });

  it('должно находить Вайлдберриз Банк по «вайлдберриз»', () => {
    expect(filterSbpBanks('вайлдберриз', 'RU')[0]).toBe('Вайлдберриз Банк');
  });

  it('должно возвращать полный список RU без запроса', () => {
    const all = filterSbpBanks('', 'RU');
    expect(all.length).toBeGreaterThan(100);
    expect(all).toContain('Вайлдберриз Банк');
  });

  it('должно нормализовать название без дефисов', () => {
    expect(normalizeBankSearchKey('Т-Банк')).toBe('тбанк');
  });
});

describe('getSbpBankErrorForPhone', () => {
  it('должно принять российский банк', () => {
    expect(
      getSbpBankErrorForPhone('Сбербанк', '+7 (900) 123-45-67'),
    ).toBeNull();
  });
});
