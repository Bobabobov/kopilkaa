import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { formatAmount } from "@/lib/format";

interface StoriesSummaryBannerProps {
  totalPaid: number;
}

export function StoriesSummaryBanner({ totalPaid }: StoriesSummaryBannerProps) {
  const formattedSum = formatAmount(totalPaid);
  const ariaLabel = `Проект помог на сумму ${formattedSum} рублей`;

  return (
    <section className="container mx-auto px-4 pb-6 flex justify-center" aria-label={ariaLabel}>
      <Card
        variant="darkGlass"
        padding="none"
        className="relative w-full max-w-md overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent" aria-hidden />
        <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#f9bc60]/15 blur-2xl pointer-events-none" aria-hidden />
        <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#abd1c6]/10 blur-2xl pointer-events-none" aria-hidden />
        <CardContent className="relative flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9bc60]/40 to-[#e8a545]/30 border border-[#f9bc60]/50 text-[#001e1d]" aria-hidden>
            <LucideIcons.Ruble size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#abd1c6]/90">Проект помог на сумму</p>
            <p className="mt-0.5 text-xl sm:text-2xl font-black tabular-nums text-[#f9bc60]">
              {formattedSum}
              <span className="ml-1 font-black text-[#f9bc60]/90">₽</span>
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/20 border border-[#f9bc60]/30 text-[#f9bc60]/90" aria-hidden>
            <LucideIcons.Coin size="sm" />
          </span>
        </CardContent>
      </Card>
    </section>
  );
}
