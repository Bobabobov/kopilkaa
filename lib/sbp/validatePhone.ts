import {
  DEFAULT_SBP_PHONE_COUNTRY,
  detectSbpPhoneCountry,
  getSbpNationalDigits,
  getSbpPhoneCountry,
  normalizeSbpDigits,
  type SbpPhoneCountryId,
} from '@/lib/sbp/sbpPhoneCountries';

/** Максимум значимых цифр: код страны 7 + 10 цифр номера (Россия). */
export const RUSSIAN_MOBILE_PHONE_DIGIT_LIMIT = 11;

/** @deprecated Используйте getSbpPhoneDigitLimit */
export { RUSSIAN_MOBILE_PHONE_DIGIT_LIMIT as SBP_PHONE_MAX_DIGITS_RU };

export function getSbpPhoneDigitLimit(countryId: SbpPhoneCountryId): number {
  return getSbpPhoneCountry(countryId).totalDigitLimit;
}

/** Оставляет в строке только цифры с учётом страны. */
export function sanitizePhoneInput(
  raw: string,
  countryId: SbpPhoneCountryId = DEFAULT_SBP_PHONE_COUNTRY,
): string {
  const trimmed = String(raw ?? '');
  const startsWithPlus = trimmed.trimStart().startsWith('+');
  const digits = normalizeSbpDigits(countryId, trimmed);
  return startsWithPlus || digits.length > 0 ? `+${digits.replace(/^\+/, '')}` : digits;
}

/** Убирает форматирование для редактирования: только + и цифры. */
export function toEditablePhoneInput(value: string): string {
  const countryId = detectSbpPhoneCountry(value);
  return sanitizePhoneInput(value, countryId);
}

export function countSbpPhoneDigits(
  input: string,
  countryId?: SbpPhoneCountryId,
): number {
  const resolved = countryId ?? detectSbpPhoneCountry(input);
  const country = getSbpPhoneCountry(resolved);
  let digits = String(input ?? '').replace(/\D/g, '');

  if (resolved === 'RU' && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }

  return Math.min(digits.length, country.totalDigitLimit);
}

/** @deprecated Используйте countSbpPhoneDigits */
export function countRussianMobilePhoneDigits(input: string): number {
  return countSbpPhoneDigits(input, 'RU');
}

/** Локальная часть российского номера (9XXXXXXXXX), до 10 цифр. */
export function extractRussianMobileLocalDigits(raw: string): string {
  let digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.length > RUSSIAN_MOBILE_PHONE_DIGIT_LIMIT) {
    digits = digits.slice(0, RUSSIAN_MOBILE_PHONE_DIGIT_LIMIT);
  }
  if (digits.length >= 11 && (digits[0] === '7' || digits[0] === '8')) {
    return digits.slice(1, 11);
  }
  if (digits.startsWith('7') || digits.startsWith('8')) {
    return digits.slice(1);
  }
  return digits.slice(0, 10);
}

export function formatSbpPhonePartial(
  countryId: SbpPhoneCountryId,
  raw: string,
): string {
  const country = getSbpPhoneCountry(countryId);
  const digits = normalizeSbpDigits(countryId, raw);
  if (!digits) return '';
  return country.formatPartial(digits);
}

/**
 * Маска при вводе: +7 (9XX) XXX-XX-XX (Россия).
 * @deprecated Используйте formatSbpPhonePartial('RU', raw)
 */
export function formatRussianMobilePhonePartial(raw: string): string {
  return formatSbpPhonePartial('RU', raw);
}

export function normalizeSbpPhone(
  input: string,
  countryId?: SbpPhoneCountryId,
): string | null {
  const resolved = countryId ?? detectSbpPhoneCountry(input);
  const country = getSbpPhoneCountry(resolved);
  const digits = normalizeSbpDigits(resolved, input);
  const national = getSbpNationalDigits(resolved, digits);

  if (digits.length !== country.totalDigitLimit) return null;
  if (!country.nationalPattern.test(national)) return null;

  return digits;
}

/** Нормализует российский мобильный номер до 10 цифр (9XXXXXXXXX). */
export function normalizeRussianMobilePhone(input: string): string | null {
  const digits = normalizeSbpPhone(input, 'RU');
  if (!digits) return null;
  return digits.slice(1);
}

export function isValidSbpPhone(
  input: string,
  countryId?: SbpPhoneCountryId,
): boolean {
  return normalizeSbpPhone(input, countryId) !== null;
}

export function isValidRussianMobilePhone(input: string): boolean {
  return isValidSbpPhone(input, 'RU');
}

export function formatSbpPhone(
  input: string,
  countryId?: SbpPhoneCountryId,
): string {
  const resolved = countryId ?? detectSbpPhoneCountry(input);
  const digits = normalizeSbpPhone(input, resolved);
  if (!digits) return input.trim();
  return getSbpPhoneCountry(resolved).formatFull(digits);
}

/** Формат для отображения и хранения: +7 (9XX) XXX-XX-XX */
export function formatRussianMobilePhone(input: string): string {
  return formatSbpPhone(input, 'RU');
}

export function getSbpPhoneError(
  input: string,
  countryId?: SbpPhoneCountryId,
): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return 'Укажите номер телефона для СБП';
  }

  const resolved = countryId ?? detectSbpPhoneCountry(trimmed);
  const country = getSbpPhoneCountry(resolved);
  const digits = normalizeSbpDigits(resolved, trimmed);
  const national = getSbpNationalDigits(resolved, digits);

  if (digits.length < country.totalDigitLimit) {
    return 'Введите полный номер телефона';
  }

  if (digits.length > country.totalDigitLimit) {
    return 'Слишком длинный номер телефона';
  }

  if (!country.nationalPattern.test(national)) {
    return `Укажите мобильный номер для ${country.name}`;
  }

  return null;
}

export function getRussianMobilePhoneError(input: string): string | null {
  return getSbpPhoneError(input, 'RU');
}

export {
  DEFAULT_SBP_PHONE_COUNTRY,
  detectSbpPhoneCountry,
  SBP_CROSS_BORDER_COUNTRY_NAMES,
  SBP_PHONE_COUNTRIES,
  type SbpPhoneCountryId,
} from '@/lib/sbp/sbpPhoneCountries';
