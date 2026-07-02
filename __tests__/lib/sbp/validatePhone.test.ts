import { describe, expect, it } from 'vitest';
import {
  countRussianMobilePhoneDigits,
  detectSbpPhoneCountry,
  formatRussianMobilePhone,
  formatRussianMobilePhonePartial,
  formatSbpPhone,
  isValidRussianMobilePhone,
  isValidSbpPhone,
  normalizeRussianMobilePhone,
} from '@/lib/sbp/validatePhone';
import { normalizeSbpDigits } from '@/lib/sbp/sbpPhoneCountries';

describe('formatRussianMobilePhonePartial', () => {
  it('должно форматировать номер по мере ввода цифр', () => {
    expect(formatRussianMobilePhonePartial('9')).toBe('+7 (9');
    expect(formatRussianMobilePhonePartial('91')).toBe('+7 (91');
    expect(formatRussianMobilePhonePartial('912')).toBe('+7 (912)');
    expect(formatRussianMobilePhonePartial('9122')).toBe('+7 (912) 2');
    expect(formatRussianMobilePhonePartial('912262')).toBe('+7 (912) 262');
    expect(formatRussianMobilePhonePartial('91226294')).toBe('+7 (912) 262-94');
    expect(formatRussianMobilePhonePartial('9122629404')).toBe('+7 (912) 262-94-04');
  });

  it('должно принять номер с ведущей 7 или 8', () => {
    expect(formatRussianMobilePhonePartial('79122629404')).toBe('+7 (912) 262-94-04');
    expect(formatRussianMobilePhonePartial('89122629404')).toBe('+7 (912) 262-94-04');
  });

  it('должно очищаться до пустой строки без застревания на +7', () => {
    expect(formatRussianMobilePhonePartial('')).toBe('');
    expect(formatRussianMobilePhonePartial('+')).toBe('');
    expect(formatRussianMobilePhonePartial('+7')).toBe('');
    expect(formatRussianMobilePhonePartial('7')).toBe('');
    expect(formatRussianMobilePhonePartial('8')).toBe('');
    expect(formatRussianMobilePhonePartial('+7 ')).toBe('');
  });

  it('должно ограничивать ввод 11 цифрами', () => {
    expect(formatRussianMobilePhonePartial('791226294041234')).toBe('+7 (912) 262-94-04');
    expect(countRussianMobilePhoneDigits('791226294041234')).toBe(11);
  });
});

describe('formatRussianMobilePhone', () => {
  it('должно совпадать с полной маской после ввода', () => {
    const partial = formatRussianMobilePhonePartial('9122629404');
    const full = formatRussianMobilePhone('9122629404');
    expect(partial).toBe(full);
    expect(full).toBe('+7 (912) 262-94-04');
  });
});

describe('normalizeRussianMobilePhone', () => {
  it('должно принять отформатированный номер', () => {
    expect(normalizeRussianMobilePhone('+7 (912) 262-94-04')).toBe('9122629404');
    expect(isValidRussianMobilePhone('+7 (912) 262-94-04')).toBe(true);
  });
});

describe('countRussianMobilePhoneDigits', () => {
  it('должно считать только цифры, без скобок и дефисов', () => {
    expect(countRussianMobilePhoneDigits('+7 (912) 262-94-04')).toBe(11);
    expect(countRussianMobilePhoneDigits('9122629404')).toBe(10);
  });
});

describe('isValidSbpPhone', () => {
  it('должно принять казахстанский номер +7 7xx', () => {
    expect(isValidSbpPhone('+7 (701) 123-45-67')).toBe(true);
    expect(formatSbpPhone('+7 (701) 123-45-67')).toBe('+7 (701) 123-45-67');
  });

  it('должно принять белорусский номер +375', () => {
    expect(isValidSbpPhone('+375 (29) 123-45-67')).toBe(true);
    expect(formatSbpPhone('+375 (29) 123-45-67')).toBe('+375 (29) 123-45-67');
  });

  it('должно принять лаосский номер +856', () => {
    expect(isValidSbpPhone('+856 20 1234 5678')).toBe(true);
    expect(formatSbpPhone('+856 20 1234 5678')).toBe('+856 20 1234 5678');
  });
});

describe('detectSbpPhoneCountry', () => {
  it('должно оставлять Россию при неполном +7 и выбранной RU', () => {
    expect(detectSbpPhoneCountry('+7 (912) 262', 'RU')).toBe('RU');
    expect(detectSbpPhoneCountry('79122629', 'RU')).toBe('RU');
  });

  it('должно не путать российский номер с Молдовой', () => {
    expect(detectSbpPhoneCountry('+7 (912) 262-94-04', 'RU')).toBe('RU');
    expect(detectSbpPhoneCountry('79122629404', 'RU')).toBe('RU');
    expect(detectSbpPhoneCountry('79122629404', 'MD')).toBe('RU');
  });

  it('должно определять Молдову только по коду +373', () => {
    expect(detectSbpPhoneCountry('+373 69 123 456', 'RU')).toBe('MD');
  });
});

describe('normalizeSbpDigits', () => {
  it('не должно подставлять +373 к российской национальной части 9…', () => {
    expect(normalizeSbpDigits('MD', '9122629404')).toBe('9122629404');
  });
});
