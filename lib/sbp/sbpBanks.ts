import type { SbpPhoneCountryId } from '@/lib/sbp/sbpPhoneCountries';
import { detectSbpPhoneCountry } from '@/lib/sbp/sbpPhoneCountries';
import {
  FOREIGN_BANK_QUERY_ALIASES,
  FOREIGN_SBP_BANKS,
  POPULAR_FOREIGN_SBP_BANKS,
  type ForeignSbpCountryId,
} from '@/lib/sbp/foreignSbpBanks';
import {
  BANK_QUERY_ALIASES,
  normalizeBankSearchKey,
  POPULAR_RUSSIAN_BANKS,
  RUSSIAN_BANKS,
} from '@/lib/sbp/russianBanks';

const bankSetsByCountry = new Map<SbpPhoneCountryId, Set<string>>();

function getBankSet(countryId: SbpPhoneCountryId): Set<string> {
  const cached = bankSetsByCountry.get(countryId);
  if (cached) return cached;

  const banks =
    countryId === 'RU' ? RUSSIAN_BANKS : FOREIGN_SBP_BANKS[countryId as ForeignSbpCountryId];
  const set = new Set(banks);
  bankSetsByCountry.set(countryId, set);
  return set;
}

export function getSbpBanksForCountry(
  countryId: SbpPhoneCountryId,
): readonly string[] {
  if (countryId === 'RU') return RUSSIAN_BANKS;
  return FOREIGN_SBP_BANKS[countryId as ForeignSbpCountryId] ?? [];
}

export function getPopularSbpBanksForCountry(
  countryId: SbpPhoneCountryId,
): readonly string[] {
  if (countryId === 'RU') return POPULAR_RUSSIAN_BANKS;
  return POPULAR_FOREIGN_SBP_BANKS[countryId as ForeignSbpCountryId] ?? [];
}

export function getSbpBankCountryLabel(countryId: SbpPhoneCountryId): string {
  const labels: Record<SbpPhoneCountryId, string> = {
    RU: 'России',
    BY: 'Беларуси',
    KZ: 'Казахстана',
    UZ: 'Узбекистана',
    KG: 'Кыргызстана',
    TJ: 'Таджикистана',
    AM: 'Армении',
    AB: 'Абхазии',
    MD: 'Молдовы',
    LA: 'Лаоса',
  };
  return labels[countryId] ?? 'страны получателя';
}

function expandSearchKeys(query: string, countryId: SbpPhoneCountryId): string[] {
  const normalized = normalizeBankSearchKey(query);
  if (!normalized) return [];

  const aliases =
    countryId === 'RU' ? BANK_QUERY_ALIASES : FOREIGN_BANK_QUERY_ALIASES;
  const alias = aliases[normalized];
  const keys = alias && alias !== normalized ? [normalized, alias] : [normalized];
  return [...new Set(keys)];
}

function bankMatchesSearch(bank: string, searchKeys: string[]): boolean {
  const bankKey = normalizeBankSearchKey(bank);
  return searchKeys.some(
    (key) => bankKey.includes(key) || key.includes(bankKey),
  );
}

function bankSearchScore(bank: string, searchKeys: string[]): number {
  const bankKey = normalizeBankSearchKey(bank);
  let best = 0;

  for (const key of searchKeys) {
    if (bankKey === key) best = Math.max(best, 100);
    else if (bankKey.startsWith(key)) best = Math.max(best, 80);
    else if (bankKey.includes(key)) best = Math.max(best, 60);
    else if (key.includes(bankKey)) best = Math.max(best, 40);
  }

  return best;
}

export function isSbpBank(name: string, countryId: SbpPhoneCountryId): boolean {
  return getBankSet(countryId).has(name.trim());
}

export function getSbpBankError(
  bankName: string,
  countryId: SbpPhoneCountryId,
): string | null {
  const trimmed = bankName.trim();
  if (!trimmed) {
    return 'Выберите банк';
  }
  if (!isSbpBank(trimmed, countryId)) {
    return `Выберите банк из списка для ${getSbpBankCountryLabel(countryId)}`;
  }
  return null;
}

export function getSbpBankErrorForPhone(
  bankName: string,
  phone: string,
): string | null {
  const countryId = detectSbpPhoneCountry(phone);
  return getSbpBankError(bankName, countryId);
}

export function filterSbpBanks(
  query: string,
  countryId: SbpPhoneCountryId,
): string[] {
  const banks = getSbpBanksForCountry(countryId);
  const bankSet = getBankSet(countryId);
  const trimmed = query.trim();

  if (!trimmed) {
    const popular = getPopularSbpBanksForCountry(countryId).filter((bank) =>
      bankSet.has(bank),
    );
    const popularSet = new Set(popular);
    const rest = banks.filter((bank) => !popularSet.has(bank));
    return [...popular, ...rest];
  }

  const searchKeys = expandSearchKeys(trimmed, countryId);
  if (searchKeys.length === 0) {
    return [];
  }

  return banks
    .filter((bank) => bankMatchesSearch(bank, searchKeys))
    .sort((a, b) => bankSearchScore(b, searchKeys) - bankSearchScore(a, searchKeys));
}
