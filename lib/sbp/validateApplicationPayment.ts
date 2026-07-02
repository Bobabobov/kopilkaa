import { getSbpBankErrorForPhone } from '@/lib/sbp/sbpBanks';
import { parseSbpPayment } from '@/lib/sbp/formatPayment';
import {
  formatSbpPhone,
  isValidSbpPhone,
} from '@/lib/sbp/validatePhone';

export function validateApplicationSbpPayment(
  payment: string,
  bankName?: string | null,
): string | null {
  const parsed = parseSbpPayment(payment, bankName);
  const phone = parsed.phone ?? payment;

  const bankError = getSbpBankErrorForPhone(parsed.bankName ?? '', phone);
  if (bankError) {
    return bankError;
  }

  if (!isValidSbpPhone(phone)) {
    return 'Укажите мобильный номер для трансграничного СБП';
  }

  return null;
}

export function normalizeApplicationSbpPayment(
  payment: string,
  bankName?: string | null,
): string {
  const parsed = parseSbpPayment(payment, bankName);
  const bank = parsed.bankName?.trim() ?? '';
  const phone = formatSbpPhone(parsed.phone ?? payment);
  return `Банк: ${bank}\nСБП: ${phone}`;
}
