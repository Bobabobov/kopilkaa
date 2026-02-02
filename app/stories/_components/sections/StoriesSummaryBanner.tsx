import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";

interface StoriesSummaryBannerProps {
  totalPaid: number;
}

export function StoriesSummaryBanner({ totalPaid }: StoriesSummaryBannerProps) {
  const formattedSum = formatAmount(totalPaid);
  const ariaLabel = `Проект помог на сумму ${formattedSum} рублей`;

  return (
    <section
      className="container mx-auto px-4 pb-6 flex justify-center"
      aria-label={ariaLabel}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#f9bc60]/40 bg-gradient-to-r from-[#004643]/50 via-[#f9bc60]/15 to-[#abd1c6]/15 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(249,188,96,0.25),0_0_0_1px_rgba(249,188,96,0.1)]">
        {/* Декоративная полоска сверху */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent" />
        {/* Фоновые блики */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#f9bc60]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#abd1c6]/15 blur-2xl" />
        {/* Тонкий узор */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] rounded-2xl"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f9bc60 1px, transparent 0)`,
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9bc60]/40 to-[#e8a545]/30 border border-[#f9bc60]/50 text-[#001e1d] shadow-[0_4px_16px_rgba(249,188,96,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]"
            aria-hidden
          >
            <LucideIcons.Ruble size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#abd1c6]/90">
              Проект помог на сумму
            </p>
            <p className="mt-0.5 text-xl sm:text-2xl font-black tabular-nums text-[#f9bc60] drop-shadow-[0_0_20px_rgba(249,188,96,0.2)]">
              {formattedSum}
              <span className="ml-1 font-black text-[#f9bc60]/90">₽</span>
            </p>
          </div>
          {/* Декоративная иконка справа */}
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#e8a545]/15 border border-[#f9bc60]/30 text-[#f9bc60]/90 shadow-[0_0_16px_rgba(249,188,96,0.15)]"
            aria-hidden
          >
            <LucideIcons.Coin size="sm" />
          </span>
        </div>
      </div>
    </section>
  );
}
