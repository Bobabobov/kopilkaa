export function formatAmount(amount: number): string {
  const n = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\u00A0/g, " ");
  return `${n} ₽`;
}

export function formatDonationDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatServiceLabel(comment?: string | null): string | null {
  if (!comment) return null;
  const v = comment.trim();
  if (!v) return null;
  if (v === "heroes_placement") return "Размещение в «Героях»";
  return v;
}
