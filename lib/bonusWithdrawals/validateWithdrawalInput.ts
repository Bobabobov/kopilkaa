import { z } from 'zod';

import {
  WITHDRAWAL_BANK_MAX_LEN,
  WITHDRAWAL_PHONE_MAX_LEN,
} from '@/lib/bonusWithdrawals/constants';
import { getSbpBankErrorForPhone } from '@/lib/sbp/sbpBanks';
import {
  formatSbpPhone,
  getSbpPhoneError,
  isValidSbpPhone,
} from '@/lib/sbp/validatePhone';
import { textContainsLink } from '@/lib/text/noLinks';

function fieldNoLinks(value: string): boolean {
  return !textContainsLink(value);
}

export const bonusWithdrawalBodySchema = z
  .object({
    amountBonuses: z
      .number()
      .int('Сумма должна быть целым числом')
      .positive('Укажите сумму больше нуля'),
    bankName: z
      .string()
      .trim()
      .min(1, 'Выберите банк')
      .max(
        WITHDRAWAL_BANK_MAX_LEN,
        `Название банка: не более ${WITHDRAWAL_BANK_MAX_LEN} символов`,
      )
      .refine(
        (value) => fieldNoLinks(value),
        'В названии банка нельзя указывать ссылки',
      ),
    details: z
      .string()
      .trim()
      .min(1, 'Укажите номер телефона для СБП')
      .max(
        WITHDRAWAL_PHONE_MAX_LEN,
        `Номер телефона: не более ${WITHDRAWAL_PHONE_MAX_LEN} символов`,
      )
      .refine(
        (value) => fieldNoLinks(value),
        'В номере телефона нельзя указывать ссылки',
      )
      .refine(
        (value) => isValidSbpPhone(value),
        'Укажите мобильный номер для трансграничного СБП',
      )
      .transform((value) => formatSbpPhone(value)),
  })
  .superRefine((data, ctx) => {
    const bankError = getSbpBankErrorForPhone(data.bankName, data.details);
    if (bankError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: bankError,
        path: ['bankName'],
      });
    }
  });

export type BonusWithdrawalBody = z.infer<typeof bonusWithdrawalBodySchema>;

export function parseBonusWithdrawalBody(
  body: unknown,
):
  | { ok: true; data: BonusWithdrawalBody }
  | { ok: false; error: string } {
  const parsed = bonusWithdrawalBodySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? 'Некорректные данные' };
  }
  return { ok: true, data: parsed.data };
}

export function getBonusWithdrawalPhoneError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Укажите номер телефона для СБП';
  if (getSbpPhoneError(trimmed)) {
    return getSbpPhoneError(trimmed);
  }
  if (textContainsLink(trimmed)) {
    return 'В номере телефона нельзя указывать ссылки';
  }
  return null;
}

export function getBonusWithdrawalBankError(
  bankName: string,
  phone: string,
): string | null {
  const bankError = getSbpBankErrorForPhone(bankName, phone);
  if (bankError) return bankError;
  if (textContainsLink(bankName)) {
    return 'В названии банка нельзя указывать ссылки';
  }
  return null;
}
