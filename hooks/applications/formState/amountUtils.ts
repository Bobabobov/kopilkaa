"use client";

export function formatAmountRu(digits: string): string {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return digits;
  return n.toLocaleString("ru-RU");
}

export function countDigits(s: string): number {
  return (s.match(/\d/g) || []).length;
}

export function caretPosForDigitIndex(
  formatted: string,
  digitIndex: number,
): number {
  if (digitIndex <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen >= digitIndex) return i + 1;
    }
  }
  return formatted.length;
}

export function createHandleAmountInputChange(
  setAmount: (value: string) => void,
  isAdmin: boolean,
  trustLimitsMax: number,
  amountInputRef: React.RefObject<HTMLInputElement | null>,
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitsBeforeCaret = countDigits(raw.slice(0, caret));
    const nextDigits = raw.replace(/[^\d]/g, "");
    let clampedDigits = "";
    if (nextDigits.length > 0) {
      const numeric = parseInt(nextDigits, 10);
      if (Number.isFinite(numeric)) {
        clampedDigits = (
          isAdmin ? numeric : Math.min(numeric, trustLimitsMax)
        ).toString();
      }
    }
    setAmount(clampedDigits);
    requestAnimationFrame(() => {
      const el = amountInputRef.current;
      if (!el) return;
      const nextFormatted = formatAmountRu(clampedDigits);
      const safeDigitsBefore = Math.min(
        digitsBeforeCaret,
        countDigits(nextFormatted),
      );
      const nextCaret = caretPosForDigitIndex(nextFormatted, safeDigitsBefore);
      try {
        el.setSelectionRange(nextCaret, nextCaret);
      } catch {
        // ignore
      }
    });
  };
}
