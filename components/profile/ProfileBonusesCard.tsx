"use client";

import Link from "next/link";
import { Heart, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  BONUS_RUB_RATE,
  MIN_WITHDRAWAL_BONUSES,
} from "@/lib/goodDeeds";
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from "@/lib/admin/bonusWithdrawalBlock";
import { formatAmount, formatRub } from "@/lib/format";
import type { ProfileBonusWallet } from "@/hooks/profile/useProfileDashboard";

interface ProfileBonusesCardProps {
  wallet: ProfileBonusWallet;
}

const EARN_PATHS = [
  {
    href: "/good-deeds",
    label: "Добрые дела",
    icon: Heart,
  },
  {
    href: "/profile/referrals",
    label: "Рефералы",
    icon: UserPlus,
  },
] as const;

export function ProfileBonusesCard({ wallet }: ProfileBonusesCardProps) {
  const canWithdraw =
    wallet.availableBonuses >= MIN_WITHDRAWAL_BONUSES &&
    !wallet.hasPendingWithdrawal &&
    !wallet.withdrawalBlocked;
  const belowMinimum = wallet.availableBonuses < MIN_WITHDRAWAL_BONUSES;
  const remainingToWithdraw = Math.max(
    0,
    MIN_WITHDRAWAL_BONUSES - wallet.availableBonuses,
  );
  const withdrawalProgress = Math.min(
    100,
    Math.round((wallet.availableBonuses / MIN_WITHDRAWAL_BONUSES) * 100),
  );
  const rubEquivalent = wallet.availableBonuses * BONUS_RUB_RATE;

  const statusText = wallet.withdrawalBlocked
    ? "Вывод заблокирован"
    : wallet.hasPendingWithdrawal
      ? "Заявка на проверке"
      : canWithdraw
        ? "Можно вывести"
        : `Ещё ${formatAmount(remainingToWithdraw)} до вывода`;

  const ctaLabel = wallet.withdrawalBlocked
    ? "Подробнее о бонусах"
    : canWithdraw
      ? "Перейти к выводу"
      : "Как получить бонусы";

  return (
    <Card
      variant="darkGlass"
      padding="md"
      className="relative overflow-hidden border-white/10"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f9bc60]/12 blur-3xl" />

      <CardContent className="relative space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[#abd1c6]/80">
              Доступно
            </p>
            <p className="mt-0.5 text-4xl font-black leading-none tracking-tight text-[#fffffe] sm:text-5xl">
              {formatAmount(wallet.availableBonuses)}
              <span className="ml-2 align-baseline text-base font-semibold text-[#abd1c6] sm:text-lg">
                бонусов
              </span>
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#f9bc60]">
              ≈ {formatRub(rubEquivalent)}
            </p>
          </div>

          <BonusStatusBadge
            text={statusText}
            canWithdraw={canWithdraw}
            hasPendingWithdrawal={wallet.hasPendingWithdrawal}
            withdrawalBlocked={wallet.withdrawalBlocked}
          />
        </div>

        {belowMinimum && !wallet.withdrawalBlocked && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs text-[#abd1c6]">
              <span>До минимального вывода</span>
              <span className="font-semibold tabular-nums text-[#fffffe]">
                {formatAmount(wallet.availableBonuses)} /{" "}
                {formatAmount(MIN_WITHDRAWAL_BONUSES)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/25">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] to-[#abd1c6] transition-[width] duration-500"
                style={{ width: `${withdrawalProgress}%` }}
              />
            </div>
          </div>
        )}

        {canWithdraw && (
          <p className="text-xs text-[#abd1c6]/90">
            Порог в {formatAmount(MIN_WITHDRAWAL_BONUSES)} бонусов пройден — можно
            оформить вывод на карту.
          </p>
        )}

        {wallet.hasPendingWithdrawal && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
            На проверке:{" "}
            <span className="font-semibold tabular-nums">
              {formatAmount(wallet.pendingWithdrawalBonuses)} бонусов
            </span>
          </p>
        )}

        {wallet.withdrawalBlocked && (
          <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/8 pt-3 text-sm text-[#94a1b2]">
          <span>
            Начислено{" "}
            <strong className="font-semibold tabular-nums text-[#abd1c6]">
              {formatAmount(wallet.totalEarnedBonuses)}
            </strong>
          </span>
          {wallet.withdrawnBonuses > 0 && (
            <>
              <span className="hidden text-white/20 sm:inline" aria-hidden>
                ·
              </span>
              <span>
                Выведено{" "}
                <strong className="font-semibold tabular-nums text-[#abd1c6]">
                  {formatAmount(wallet.withdrawnBonuses)}
                </strong>
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {EARN_PATHS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-[#abd1c6] transition-colors hover:border-[#f9bc60]/30 hover:bg-white/10 hover:text-[#fffffe]"
            >
              <Icon className="h-3.5 w-3.5 text-[#f9bc60]" aria-hidden />
              {label}
            </Link>
          ))}
          <Badge
            variant="secondary"
            className="h-auto rounded-xl border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-[#94a1b2]"
          >
            1 бонус = 1 ₽
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="relative !mt-4 border-white/10">
        <Button
          type="button"
          variant="default"
          className="h-11 w-full rounded-2xl border border-[#f9bc60]/40 bg-[#f9bc60] font-bold text-[#001e1d] shadow-[0_4px_16px_rgba(249,188,96,0.35)] hover:bg-[#f7b24a]"
          asChild
        >
          <Link href="/good-deeds">
            {ctaLabel}
            <LucideIcons.ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function BonusStatusBadge({
  text,
  canWithdraw,
  hasPendingWithdrawal,
  withdrawalBlocked = false,
}: {
  text: string;
  canWithdraw: boolean;
  hasPendingWithdrawal: boolean;
  withdrawalBlocked?: boolean;
}) {
  const Icon = canWithdraw
    ? LucideIcons.CheckCircle2
    : withdrawalBlocked
      ? LucideIcons.Lock
      : hasPendingWithdrawal
        ? LucideIcons.Clock
        : LucideIcons.Coins;

  const tone = canWithdraw
    ? "border-[#abd1c6]/35 bg-[#abd1c6]/12 text-[#fffffe]"
    : hasPendingWithdrawal
      ? "border-amber-500/35 bg-amber-500/10 text-amber-100"
      : withdrawalBlocked
        ? "border-rose-400/35 bg-rose-500/10 text-rose-100"
        : "border-white/12 bg-white/8 text-[#fffffe]";

  return (
    <div
      className={`flex w-fit shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${tone}`}
    >
      <Icon className="h-4 w-4 shrink-0 text-[#f9bc60]" aria-hidden />
      {text}
    </div>
  );
}
