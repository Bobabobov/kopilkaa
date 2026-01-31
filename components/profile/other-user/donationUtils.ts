// Реэкспорт из единой утилиты форматирования
export { formatRub as formatAmount } from "@/lib/format";

import { formatRelativeDate } from "@/lib/time";

export function formatDonationDate(dateString: string): string {
  return formatRelativeDate(dateString);
}

export function formatServiceLabel(comment?: string | null): string | null {
  if (!comment) return null;
  const v = comment.trim();
  if (!v) return null;
  if (v === "heroes_placement") return "Размещение в «Героях»";
  return v;
}
