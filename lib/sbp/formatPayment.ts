import { formatSbpPhone } from '@/lib/sbp/validatePhone';

/** Строка реквизитов для заявки / вывода: банк + телефон СБП. */
export function buildSbpPaymentPayload(bankName: string, phone: string): string {
  const bank = bankName.trim();
  const formattedPhone = formatSbpPhone(phone);
  return `Банк: ${bank}\nСБП: ${formattedPhone}`;
}

export interface ParsedSbpPayment {
  bankName?: string;
  phone?: string;
  /** Остаток строки, если формат не распознан */
  raw?: string;
}

/** Разбор сохранённой строки реквизитов (новый и старый формат). */
export function parseSbpPayment(
  raw: string,
  bankNameField?: string | null,
): ParsedSbpPayment {
  if (bankNameField?.trim()) {
    const phoneFromRaw = extractSbpPhone(raw);
    return {
      bankName: bankNameField.trim(),
      phone: phoneFromRaw ?? (raw.trim() || undefined),
      raw: raw.trim() || undefined,
    };
  }

  const lines = (raw || '').split(/\n/).map((line) => line.trim()).filter(Boolean);
  let bankName: string | undefined;
  let phone: string | undefined;
  const rest: string[] = [];

  for (const line of lines) {
    if (/^банк:/i.test(line)) {
      bankName = line.replace(/^банк:\s*/i, '').trim() || undefined;
      continue;
    }
    if (/^сбп:/i.test(line)) {
      phone = line.replace(/^сбп:\s*/i, '').trim() || undefined;
      continue;
    }
    rest.push(line);
  }

  if (!phone && rest.length > 0) {
    phone = rest.join('\n');
  }

  return {
    bankName,
    phone,
    raw: raw.trim() || undefined,
  };
}

function extractSbpPhone(raw: string): string | null {
  const match = (raw || '').match(/^сбп:\s*(.+)$/im);
  return match?.[1]?.trim() ?? null;
}
