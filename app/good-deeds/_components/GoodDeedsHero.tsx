import Link from "next/link";
import type { ToastType } from "@/components/ui/BeautifulToast";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoodDeedsWithdrawSection } from "./GoodDeedsWithdrawSection";
import type { GoodDeedsResponse } from "../types";

type WithdrawStats = Pick<
  GoodDeedsResponse["stats"],
  | "totalEarnedBonuses"
  | "availableBonuses"
  | "pendingWithdrawalBonuses"
  | "withdrawnBonuses"
  | "hasPendingWithdrawal"
>;

type Props = {
  isAuthenticated: boolean;
  withdrawStats?: WithdrawStats;
  showToast?: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  onWithdrawSuccess?: () => void;
};

export function GoodDeedsHero({
  isAuthenticated,
  withdrawStats,
  showToast,
  onWithdrawSuccess,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#004643]/95 via-[#00302f]/85 to-[#001e1d]/95 p-6 sm:p-9 md:p-10">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#f9bc60]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#abd1c6]/08 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
        <div className="max-w-2xl flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#abd1c6]/30 bg-black/20 text-[#abd1c6]"
            >
              1 бонус = 1 ₽
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-400/35 bg-amber-500/10 text-amber-200"
            >
              Тестовый режим
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
              Добрые дела
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-[#abd1c6] sm:text-base">
              Выбираете доброе дело на неделю, делаете его в жизни и
              отправляете короткий отчёт с фото или видео. После проверки
              бонусы приходят на баланс.
            </p>
            <div className="relative max-w-xl overflow-hidden rounded-2xl border border-amber-400/45 bg-gradient-to-r from-amber-500/14 via-amber-500/8 to-transparent px-4 py-3 shadow-[0_0_0_1px_rgba(249,188,96,0.12),0_10px_30px_rgba(0,0,0,0.25)]">
              <span
                aria-hidden
                className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-amber-300/15 blur-2xl animate-pulse"
              />
              <p className="relative flex items-start gap-2.5 text-sm font-medium leading-relaxed text-amber-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span>
                  Раздел работает в тестовом режиме: условия и награды могут
                  меняться по итогам обратной связи.
                </span>
              </p>
            </div>
          </div>
        </div>

        {isAuthenticated && withdrawStats && showToast ? (
          <div className="w-full shrink-0 lg:max-w-sm lg:self-start">
            <GoodDeedsWithdrawSection
              stats={withdrawStats}
              showToast={showToast}
              onSuccess={onWithdrawSuccess}
            />
          </div>
        ) : null}

        {!isAuthenticated && (
          <div className="flex shrink-0 flex-col justify-end gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              className="h-11 rounded-xl bg-[#f9bc60] px-5 font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
            >
              <Link href="/login">
                Войти
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
