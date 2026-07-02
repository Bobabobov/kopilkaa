"use client";

interface AdminCollapsiblePanelProps {
  title: string;
  /** Краткий статус в закрытом виде */
  badge: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Сворачиваемый блок в стиле админки (акценты как в «Добрые дела»). */
export function AdminCollapsiblePanel({
  title,
  badge,
  defaultOpen = false,
  children,
}: AdminCollapsiblePanelProps) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border-2 border-[#abd1c6]/20 bg-gradient-to-br from-[#004643]/90 to-[#001e1d]/95 shadow-md shadow-black/10 open:border-[#f9bc60]/30"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-transparent bg-[#001e1d]/30 px-3 py-2.5 transition-colors hover:bg-[#f9bc60]/8 group-open:border-[#f9bc60]/20 group-open:bg-[#f9bc60]/10 sm:px-4 sm:py-3 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-bold text-[#fffffe]">{title}</span>
        <span className="shrink-0">{badge}</span>
      </summary>
      <div className="border-t border-[#abd1c6]/10 px-3 py-3 sm:px-4 sm:py-4">
        {children}
      </div>
    </details>
  );
}

interface AdminRiskBadgeProps {
  count: number;
  cleanLabel?: string;
}

export function AdminRiskBadge({
  count,
  cleanLabel = "Чисто",
}: AdminRiskBadgeProps) {
  if (count > 0) {
    return (
      <span className="inline-flex items-center rounded-full border-2 border-amber-400/50 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-200">
        {count} повтор{count === 1 ? "" : count < 5 ? "а" : "ов"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
      {cleanLabel}
    </span>
  );
}
