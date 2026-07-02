/**
 * Страны, доступные для трансграничных переводов по СБП из России.
 * Форматы мобильных номеров — по национальным правилам (упрощённая проверка).
 */
export type SbpPhoneCountryId =
  | 'RU'
  | 'BY'
  | 'KZ'
  | 'UZ'
  | 'KG'
  | 'TJ'
  | 'AM'
  | 'AB'
  | 'MD'
  | 'LA';

export interface SbpPhoneCountry {
  id: SbpPhoneCountryId;
  name: string;
  dialCode: string;
  dialDisplay: string;
  /** Максимум цифр: код страны + национальный номер */
  totalDigitLimit: number;
  nationalLength: number;
  placeholder: string;
  nationalPattern: RegExp;
  formatPartial: (allDigits: string) => string;
  formatFull: (allDigits: string) => string;
}

function formatRuKzPartial(dialDisplay: string, allDigits: string): string {
  const national = allDigits.startsWith('7') ? allDigits.slice(1) : allDigits;
  if (national.length === 0) return '';

  const area = national.slice(0, 3);
  const block1 = national.slice(3, 6);
  const block2 = national.slice(6, 8);
  const block3 = national.slice(8, 10);

  if (national.length < 3) return `${dialDisplay} (${area}`;
  if (national.length === 3) return `${dialDisplay} (${area})`;
  if (national.length <= 6) return `${dialDisplay} (${area}) ${block1}`;
  if (national.length <= 8) return `${dialDisplay} (${area}) ${block1}-${block2}`;
  return `${dialDisplay} (${area}) ${block1}-${block2}-${block3}`;
}

function formatByPartial(allDigits: string): string {
  const national = allDigits.startsWith('375') ? allDigits.slice(3) : allDigits;
  if (national.length === 0) {
    return allDigits.length > 0 ? '+375' : '';
  }

  const op = national.slice(0, 2);
  const block1 = national.slice(2, 5);
  const block2 = national.slice(5, 7);
  const block3 = national.slice(7, 9);

  if (national.length <= 2) return `+375 (${op}`;
  if (national.length <= 5) return `+375 (${op}) ${block1}`;
  if (national.length <= 7) return `+375 (${op}) ${block1}-${block2}`;
  return `+375 (${op}) ${block1}-${block2}-${block3}`;
}

function formatTripleBlockPartial(
  dialDisplay: string,
  dialCode: string,
  allDigits: string,
  blocks: [number, number, number],
): string {
  const national = allDigits.startsWith(dialCode)
    ? allDigits.slice(dialCode.length)
    : allDigits;
  if (national.length === 0) {
    return allDigits.length > 0 ? dialDisplay : '';
  }

  const [b1, b2, b3] = blocks;
  const p1 = national.slice(0, b1);
  const p2 = national.slice(b1, b1 + b2);
  const p3 = national.slice(b1 + b2, b1 + b2 + b3);

  if (national.length <= b1) return `${dialDisplay} ${p1}`;
  if (national.length <= b1 + b2) return `${dialDisplay} ${p1} ${p2}`;
  return `${dialDisplay} ${p1} ${p2} ${p3}`;
}

function formatUzTjPartial(dialDisplay: string, dialCode: string, allDigits: string): string {
  const national = allDigits.startsWith(dialCode)
    ? allDigits.slice(dialCode.length)
    : allDigits;
  if (national.length === 0) {
    return allDigits.length > 0 ? dialDisplay : '';
  }

  const op = national.slice(0, 2);
  const block1 = national.slice(2, 5);
  const block2 = national.slice(5, 7);
  const block3 = national.slice(7, 9);

  if (national.length <= 2) return `${dialDisplay} ${op}`;
  if (national.length <= 5) return `${dialDisplay} ${op} ${block1}`;
  if (national.length <= 7) return `${dialDisplay} ${op} ${block1} ${block2}`;
  return `${dialDisplay} ${op} ${block1} ${block2} ${block3}`;
}

export const SBP_PHONE_COUNTRIES: SbpPhoneCountry[] = [
  {
    id: 'RU',
    name: 'Россия',
    dialCode: '7',
    dialDisplay: '+7',
    totalDigitLimit: 11,
    nationalLength: 10,
    placeholder: '+7 (900) 123-45-67',
    nationalPattern: /^9\d{9}$/,
    formatPartial: (digits) => formatRuKzPartial('+7', digits),
    formatFull: (digits) => formatRuKzPartial('+7', digits),
  },
  {
    id: 'BY',
    name: 'Беларусь',
    dialCode: '375',
    dialDisplay: '+375',
    totalDigitLimit: 12,
    nationalLength: 9,
    placeholder: '+375 (29) 123-45-67',
    nationalPattern: /^(29|33|44|25)\d{7}$/,
    formatPartial: formatByPartial,
    formatFull: formatByPartial,
  },
  {
    id: 'KZ',
    name: 'Казахстан',
    dialCode: '7',
    dialDisplay: '+7',
    totalDigitLimit: 11,
    nationalLength: 10,
    placeholder: '+7 (701) 123-45-67',
    nationalPattern: /^7\d{9}$/,
    formatPartial: (digits) => formatRuKzPartial('+7', digits),
    formatFull: (digits) => formatRuKzPartial('+7', digits),
  },
  {
    id: 'UZ',
    name: 'Узбекистан',
    dialCode: '998',
    dialDisplay: '+998',
    totalDigitLimit: 12,
    nationalLength: 9,
    placeholder: '+998 90 123 45 67',
    nationalPattern: /^9\d{8}$/,
    formatPartial: (digits) => formatUzTjPartial('+998', '998', digits),
    formatFull: (digits) => formatUzTjPartial('+998', '998', digits),
  },
  {
    id: 'KG',
    name: 'Кыргызстан',
    dialCode: '996',
    dialDisplay: '+996',
    totalDigitLimit: 12,
    nationalLength: 9,
    placeholder: '+996 700 123 456',
    nationalPattern: /^(5\d|7\d)\d{7}$/,
    formatPartial: (digits) => formatTripleBlockPartial('+996', '996', digits, [3, 3, 3]),
    formatFull: (digits) => formatTripleBlockPartial('+996', '996', digits, [3, 3, 3]),
  },
  {
    id: 'TJ',
    name: 'Таджикистан',
    dialCode: '992',
    dialDisplay: '+992',
    totalDigitLimit: 12,
    nationalLength: 9,
    placeholder: '+992 90 123 4567',
    nationalPattern: /^9\d{8}$/,
    formatPartial: (digits) => formatUzTjPartial('+992', '992', digits),
    formatFull: (digits) => formatUzTjPartial('+992', '992', digits),
  },
  {
    id: 'AM',
    name: 'Армения',
    dialCode: '374',
    dialDisplay: '+374',
    totalDigitLimit: 11,
    nationalLength: 8,
    placeholder: '+374 91 234 567',
    nationalPattern: /^(9\d|4\d|3\d|5\d)\d{6}$/,
    formatPartial: (digits) => formatTripleBlockPartial('+374', '374', digits, [2, 3, 3]),
    formatFull: (digits) => formatTripleBlockPartial('+374', '374', digits, [2, 3, 3]),
  },
  {
    id: 'AB',
    name: 'Абхазия',
    dialCode: '7',
    dialDisplay: '+7',
    totalDigitLimit: 11,
    nationalLength: 10,
    placeholder: '+7 (940) 123-45-67',
    nationalPattern: /^940\d{7}$/,
    formatPartial: (digits) => formatRuKzPartial('+7', digits),
    formatFull: (digits) => formatRuKzPartial('+7', digits),
  },
  {
    id: 'MD',
    name: 'Молдова',
    dialCode: '373',
    dialDisplay: '+373',
    totalDigitLimit: 11,
    nationalLength: 8,
    placeholder: '+373 69 123 456',
    nationalPattern: /^(6\d|7\d)\d{6}$/,
    formatPartial: (digits) => formatTripleBlockPartial('+373', '373', digits, [2, 3, 3]),
    formatFull: (digits) => formatTripleBlockPartial('+373', '373', digits, [2, 3, 3]),
  },
  {
    id: 'LA',
    name: 'Лаос',
    dialCode: '856',
    dialDisplay: '+856',
    totalDigitLimit: 13,
    nationalLength: 10,
    placeholder: '+856 20 1234 5678',
    nationalPattern: /^20\d{8}$/,
    formatPartial: (digits) => formatTripleBlockPartial('+856', '856', digits, [2, 4, 4]),
    formatFull: (digits) => formatTripleBlockPartial('+856', '856', digits, [2, 4, 4]),
  },
];

export const DEFAULT_SBP_PHONE_COUNTRY: SbpPhoneCountryId = 'RU';

/** Страны трансграничного СБП из России (без РФ), порядок — как в справочнике НСПК. */
export const SBP_CROSS_BORDER_COUNTRY_NAMES = SBP_PHONE_COUNTRIES.filter(
  (c) => c.id !== 'RU',
).map((c) => c.name);

const countryById = new Map(SBP_PHONE_COUNTRIES.map((c) => [c.id, c]));

export function getSbpPhoneCountry(id: SbpPhoneCountryId): SbpPhoneCountry {
  return countryById.get(id) ?? countryById.get(DEFAULT_SBP_PHONE_COUNTRY)!;
}

export function normalizeSbpDigits(
  countryId: SbpPhoneCountryId,
  raw: string,
): string {
  let digits = String(raw ?? '').replace(/\D/g, '');
  const country = getSbpPhoneCountry(countryId);

  if (countryId === 'RU' && digits.startsWith('8') && digits.length <= 11) {
    digits = `7${digits.slice(1)}`;
  }

  if (
    country.dialCode !== '7' &&
    !digits.startsWith(country.dialCode) &&
    digits.length > 0 &&
    digits.length <= country.nationalLength &&
    // Не подставлять +373/+375 к российской национальной части (9…) или полному +7…
    !digits.startsWith('9') &&
    !(digits.startsWith('7') && digits.length > country.nationalLength)
  ) {
    digits = `${country.dialCode}${digits}`;
  }

  if (
    country.dialCode === '7' &&
    digits.length > 0 &&
    !digits.startsWith('7') &&
    !digits.startsWith('375') &&
    !digits.startsWith('374') &&
    !digits.startsWith('996') &&
    !digits.startsWith('998') &&
    !digits.startsWith('992') &&
    !digits.startsWith('373') &&
    !digits.startsWith('856')
  ) {
    digits = `7${digits}`;
  }

  return digits.slice(0, country.totalDigitLimit);
}

export function getSbpNationalDigits(
  countryId: SbpPhoneCountryId,
  allDigits: string,
): string {
  const country = getSbpPhoneCountry(countryId);
  if (allDigits.startsWith(country.dialCode)) {
    return allDigits.slice(country.dialCode.length);
  }
  return allDigits;
}

export function detectSbpPhoneCountry(
  input: string,
  preferred: SbpPhoneCountryId = DEFAULT_SBP_PHONE_COUNTRY,
): SbpPhoneCountryId {
  const digits = String(input ?? '').replace(/\D/g, '');
  if (!digits) return preferred;

  const foreignPrefixes: ReadonlyArray<readonly [string, SbpPhoneCountryId]> = [
    ['375', 'BY'],
    ['374', 'AM'],
    ['996', 'KG'],
    ['998', 'UZ'],
    ['992', 'TJ'],
    ['373', 'MD'],
    ['856', 'LA'],
  ];

  for (const [prefix, countryId] of foreignPrefixes) {
    if (digits.startsWith(prefix)) return countryId;
  }

  const withSeven =
    digits.startsWith('8') && digits.length <= 11 ? `7${digits.slice(1)}` : digits;

  if (withSeven.startsWith('7')) {
    if (withSeven.length === 11) {
      const national = withSeven.slice(1);
      if (/^940\d{7}$/.test(national)) return 'AB';
      if (/^7\d{9}$/.test(national)) return 'KZ';
      if (/^9\d{9}$/.test(national)) return 'RU';
    }

    if (preferred === 'RU' || preferred === 'KZ' || preferred === 'AB') {
      return preferred;
    }
    return 'RU';
  }

  return preferred;
}
