"use client";

import { Gift, LogIn, Users, Zap } from "lucide-react";
import {
  AdminPanel,
  AdminSectionLabel,
  AdminStatGrid,
} from "@/app/admin/_components/admin-ui";
import { BONUS_SOURCE_LABELS, BonusSourceCategory } from "@/lib/admin/bonusGrantCategory";
import type { BonusReportSummary } from "./types";

const SOURCE_ORDER: BonusSourceCategory[] = [
  "goodDeeds",
  "referrals",
  "dailyBonus",
  "dailyChest",
  "adminManual",
  "other",
];

interface BonusesOverviewSectionProps {
  summary: BonusReportSummary;
  onOpenWithdrawals: () => void;
}

export function BonusesOverviewSection({
  summary,
  onOpenWithdrawals,
}: BonusesOverviewSectionProps) {
  const sourceItems = SOURCE_ORDER.map((source) => ({
    label: BONUS_SOURCE_LABELS[source],
    value: summary.bySource[source],
    tone:
      source === "goodDeeds"
        ? ("success" as const)
        : source === "adminManual"
          ? ("pending" as const)
          : ("default" as const),
  }));

  return (
    <div className="space-y-5">
      <AdminStatGrid
        items={[
          {
            label: "Всего начислено",
            value: summary.totalEarned,
            tone: "pending",
          },
          {
            label: "На балансах",
            value: summary.totalAvailable,
            tone: "success",
          },
          {
            label: "В заявках на вывод",
            value: summary.totalPendingWithdrawals,
            tone: "pending",
            highlight: summary.pendingWithdrawalsCount > 0,
          },
          {
            label: "Выведено",
            value: summary.totalWithdrawn,
            tone: "danger",
          },
        ]}
      />

      <p className="text-sm text-[#abd1c6]/85">
        {summary.usersWithBonuses} пользователей с бонусами ·{" "}
        {summary.dailyClaimsTotal} бонусов за вход
      </p>

      {summary.pendingWithdrawalsCount > 0 ? (
        <button
          type="button"
          onClick={onOpenWithdrawals}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-[#f9bc60]/35 bg-gradient-to-r from-[#f9bc60]/15 to-[#f9bc60]/5 p-4 text-left transition hover:border-[#f9bc60]/55 hover:from-[#f9bc60]/20"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f9bc60]">
            <Zap className="h-5 w-5 text-[#001e1d]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-[#f9bc60]">
              Требуют решения
            </span>
            <span className="block text-base font-bold text-[#fffffe]">
              {summary.pendingWithdrawalsCount} заявок на вывод
            </span>
          </span>
          <span className="text-sm font-bold text-[#f9bc60]">Открыть →</span>
        </button>
      ) : (
        <div className="rounded-xl border-2 border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#abd1c6]">
          Очередь выводов пуста.
        </div>
      )}

      <AdminPanel
        title="Начисления по источникам"
        accent="gold"
      >
        <AdminStatGrid columns={3} items={sourceItems} />
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#abd1c6]/70">
          <span className="inline-flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-emerald-300" />
            Добрые дела
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-sky-300" />
            Рефералы
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5 text-violet-300" />
            Бонус за вход
          </span>
        </div>
      </AdminPanel>

      <AdminPanel
        title="Баланс оборота"
        subtitle="Начислено минус выведено и зарезервировано в заявках"
        accent="neutral"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-2 border-[#f9bc60]/25 bg-[#f9bc60]/8 p-3 text-center">
            <p className="text-xs text-[#abd1c6]">Начислено</p>
            <p className="text-xl font-black text-[#f9bc60]">
              +{summary.totalEarned}
            </p>
          </div>
          <div className="rounded-xl border-2 border-rose-400/25 bg-rose-500/10 p-3 text-center">
            <p className="text-xs text-[#abd1c6]">Выведено</p>
            <p className="text-xl font-black text-rose-300">
              −{summary.totalWithdrawn}
            </p>
          </div>
          <div className="rounded-xl border-2 border-amber-400/25 bg-amber-500/10 p-3 text-center">
            <p className="text-xs text-[#abd1c6]">В заявках</p>
            <p className="text-xl font-black text-amber-200">
              −{summary.totalPendingWithdrawals}
            </p>
          </div>
        </div>
      </AdminPanel>

      <AdminSectionLabel accent="gold">
        Управление пользователями — во вкладке «Пользователи» или в досье
      </AdminSectionLabel>
    </div>
  );
}
