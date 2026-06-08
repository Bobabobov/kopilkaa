"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { MIN_WITHDRAWAL_BONUSES } from "@/lib/goodDeeds";
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from "@/lib/admin/bonusWithdrawalBlock";
import type { ProfileBonusWallet } from "@/hooks/profile/useProfileDashboard";

interface ProfileBonusesCardProps {
  wallet: ProfileBonusWallet;
}

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

export function ProfileBonusesCard({ wallet }: ProfileBonusesCardProps) {
  const canWithdraw =
    wallet.availableBonuses >= MIN_WITHDRAWAL_BONUSES &&
    !wallet.hasPendingWithdrawal &&
    !wallet.withdrawalBlocked;
  const remainingToWithdraw = Math.max(
    0,
    MIN_WITHDRAWAL_BONUSES - wallet.availableBonuses,
  );
  const withdrawalProgress = Math.min(
    100,
    Math.round((wallet.availableBonuses / MIN_WITHDRAWAL_BONUSES) * 100),
  );
  const statusText = wallet.withdrawalBlocked
    ? "Вывод заблокирован"
    : wallet.hasPendingWithdrawal
      ? "Заявка на проверке"
      : canWithdraw
        ? "Доступен вывод"
        : `До вывода ${formatBonuses(remainingToWithdraw)}`;

  return (
    <Card
      variant="darkGlass"
      padding="md"
      className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.03] shadow-lg backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[#abd1c6]/14 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-[#f9bc60]/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-[#004643]/35 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_42%,transparent_62%)] opacity-60" />

      <CardContent className="relative space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#f9bc60] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <LucideIcons.Coins className="h-5 w-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f9bc60]">
                Бонусный баланс
              </p>
              <h3 className="text-xl font-black text-[#fffffe] sm:text-2xl">
                Копите за активность
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-[#abd1c6]">
                Бонусы начисляются за добрые дела, рефералов и другие
                активности, которые скоро появятся в Копилке.
              </p>
            </div>
          </div>
          <Badge
            variant={canWithdraw ? "success" : "secondary"}
            className="w-fit shrink-0 border-white/15 bg-white/10 text-[#f9bc60] backdrop-blur-md"
          >
            1 бонус = 1 ₽
          </Badge>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#f9bc60]/18 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-[#abd1c6]/12 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/25" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#f9bc60]">
                Доступно сейчас
              </p>
              <p className="mt-1 text-4xl font-black leading-none tracking-tight text-[#fffffe] sm:text-5xl">
                {formatBonuses(wallet.availableBonuses)}
                <span className="ml-2 align-baseline text-base font-semibold text-[#abd1c6] sm:text-lg">
                  бонусов
                </span>
              </p>
            </div>
            <BonusStatusBadge
              text={statusText}
              canWithdraw={canWithdraw}
              hasPendingWithdrawal={wallet.hasPendingWithdrawal}
              withdrawalBlocked={wallet.withdrawalBlocked}
            />
          </div>

          {wallet.withdrawalBlocked && (
            <p className="relative mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
            </p>
          )}

          <div className="relative mt-5 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs text-[#abd1c6]">
              <span>Прогресс до минимального вывода</span>
              <span className="font-semibold text-[#fffffe]">
                {formatBonuses(wallet.availableBonuses)} /{" "}
                {formatBonuses(MIN_WITHDRAWAL_BONUSES)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] via-[#ffd27d] to-[#abd1c6] shadow-[0_0_18px_rgba(249,188,96,0.35)]"
                style={{ width: `${withdrawalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <BonusStat
            label="Всего начислено"
            value={wallet.totalEarnedBonuses}
            icon="TrendingUp"
          />
          <BonusStat
            label="Выведено"
            value={wallet.withdrawnBonuses}
            icon="Ruble"
          />
          <BonusStat
            label="На проверке"
            value={wallet.pendingWithdrawalBonuses}
            icon="Clock"
            highlight={wallet.pendingWithdrawalBonuses > 0}
          />
        </dl>
      </CardContent>

      <CardFooter className="relative !mt-5 border-white/10">
        <Button
          type="button"
          variant="default"
          className="h-11 w-full rounded-2xl border border-[#f9bc60]/45 bg-[#f9bc60]/90 font-bold text-[#001e1d] shadow-lg shadow-[#f9bc60]/15 backdrop-blur-md hover:bg-[#f7b24a]"
          asChild
        >
          <Link href="/good-deeds">
            {wallet.withdrawalBlocked
              ? "Подробнее о бонусах"
              : canWithdraw
                ? "Перейти к выводу"
                : "Как получить бонусы"}
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

  if (canWithdraw) {
    return (
      <div className="relative w-fit overflow-hidden rounded-2xl border border-[#abd1c6]/30 bg-gradient-to-r from-[#abd1c6]/18 via-[#f9bc60]/18 to-[#abd1c6]/12 px-3.5 py-2 text-sm font-bold text-[#fffffe] shadow-[0_0_28px_rgba(171,209,198,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.18)_45%,transparent_65%)] animate-pulse" />
        <span className="relative flex items-center gap-2">
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#abd1c6]/20 text-[#abd1c6]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#abd1c6]/30 opacity-60 animate-ping" />
            <Icon className="relative h-3.5 w-3.5" />
          </span>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="w-fit rounded-2xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-semibold text-[#fffffe] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#f9bc60]" />
        {text}
      </span>
    </div>
  );
}

function BonusStat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: keyof typeof LucideIcons;
  highlight?: boolean;
}) {
  const Icon = LucideIcons[icon];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
      <dt className="flex items-center gap-2 text-[11px] font-medium text-[#94a1b2]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-[#abd1c6]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        {label}
      </dt>
      <dd
        className={
          highlight
            ? "mt-2 text-lg font-black tabular-nums text-amber-200"
            : "mt-2 text-lg font-black tabular-nums text-[#fffffe]"
        }
      >
        {formatBonuses(value)}
      </dd>
    </div>
  );
}
