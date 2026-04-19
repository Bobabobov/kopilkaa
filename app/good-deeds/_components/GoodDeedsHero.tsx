import Link from "next/link";
import type { ToastType } from "@/components/ui/BeautifulToast";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#004643]/90 via-[#003533]/80 to-[#001e1d]/90 p-6 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#f9bc60]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#abd1c6]/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#f9bc60]/40 bg-[#f9bc60]/15 text-[#f9bc60]">
              <Sparkles className="mr-1 h-3.5 w-3.5" />С модерацией
            </Badge>
            <Badge
              variant="outline"
              className="border-[#abd1c6]/35 bg-[#001e1d]/40 text-[#abd1c6]"
            >
              1 бонус = 1 ₽
            </Badge>
          </div>
          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-black tracking-tight text-[#fffffe] sm:text-4xl md:text-5xl">
              Добрые дела
            </h1>
            <p className="text-pretty text-base leading-relaxed text-[#abd1c6]/95 sm:text-lg">
              Мир меняется с тебя — с одного простого доброго шага. Помоги сегодня:
              завтра забота может вернуться к тебе. Ниже — задания недели и истории
              тех, кто уже поделился своим делом.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[#94a1b2]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
              <HeartHandshake className="h-4 w-4 text-[#f9bc60]" />
              Бонусы начисляются после проверки
            </span>
          </div>
        </div>

        {isAuthenticated && withdrawStats && showToast ? (
          <GoodDeedsWithdrawSection
            stats={withdrawStats}
            showToast={showToast}
            onSuccess={onWithdrawSuccess}
          />
        ) : null}

        {!isAuthenticated && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              className="h-11 rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 hover:bg-[#f7b24a]"
            >
              <Link href="/login">
                Войти, чтобы участвовать
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
