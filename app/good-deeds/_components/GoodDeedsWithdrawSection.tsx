"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { GlassModal } from "@/components/ui/GlassModal";
import type { ToastType } from "@/components/ui/BeautifulToast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MIN_WITHDRAWAL_BONUSES,
  MAX_WITHDRAWAL_BANK_LEN,
  MAX_WITHDRAWAL_DETAILS_LEN,
} from "@/lib/goodDeeds";
import type { GoodDeedsResponse } from "../types";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from "@/lib/admin/bonusWithdrawalBlock";

type Stats = Pick<
  GoodDeedsResponse["stats"],
  | "totalEarnedBonuses"
  | "availableBonuses"
  | "pendingWithdrawalBonuses"
  | "withdrawnBonuses"
  | "hasPendingWithdrawal"
  | "withdrawalBlocked"
>;

type Props = {
  stats: Stats;
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  onSuccess?: () => void;
};

export function GoodDeedsWithdrawSection({
  stats,
  showToast,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amountBonuses, setAmountBonuses] = useState("");
  const [bankName, setBankName] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmountBonuses(
      stats.availableBonuses >= MIN_WITHDRAWAL_BONUSES
        ? String(stats.availableBonuses)
        : "",
    );
    setBankName("");
    setDetails("");
  }, [open, stats.availableBonuses]);

  const canOpen =
    stats.availableBonuses >= MIN_WITHDRAWAL_BONUSES &&
    !stats.hasPendingWithdrawal &&
    !stats.withdrawalBlocked;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountBonuses, 10);
    if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL_BONUSES) {
      showToast(
        "warning",
        "Сумма",
        `Укажите не менее ${MIN_WITHDRAWAL_BONUSES} бонусов`,
      );
      return;
    }
    if (amount > stats.availableBonuses) {
      showToast("warning", "Сумма", "Недостаточно доступных бонусов");
      return;
    }
    const bank = bankName.trim();
    const det = details.trim();
    if (!bank || bank.length > MAX_WITHDRAWAL_BANK_LEN) {
      showToast("warning", "Банк", "Укажите название банка");
      return;
    }
    if (!det || det.length > MAX_WITHDRAWAL_DETAILS_LEN) {
      showToast(
        "warning",
        "Реквизиты",
        `Укажите реквизиты для перевода (до ${MAX_WITHDRAWAL_DETAILS_LEN} символов)`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/good-deeds/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountBonuses: amount,
          bankName: bank,
          details: det,
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось отправить заявку на вывод");
      showToast(
        "success",
        "Заявка отправлена",
        "После проверки выполним перевод по указанным реквизитам",
      );
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      showToast(
        "error",
        "Не отправлено",
        err instanceof Error ? err.message : "Попробуйте позже",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const withdrawModal = (
    <GlassModal
      open={open}
      onClose={() => setOpen(false)}
      size="lg"
      zIndex={9400}
      title="Вывод бонусов"
      icon={<Wallet className="h-4 w-4 text-[#f9bc60]" />}
      subtitle={
        <>
          1 бонус = 1 ₽. Минимальный вывод — {MIN_WITHDRAWAL_BONUSES} бонусов.
          Укажите банк и реквизиты (номер карты, счёт, телефон для СБП и т.д.).
        </>
      }
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-[#abd1c6]/35"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="good-deeds-withdraw-form"
            disabled={submitting}
            className="rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
          >
            {submitting ? "Отправка…" : "Отправить заявку"}
          </Button>
        </div>
      }
    >
      <form id="good-deeds-withdraw-form" className="space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="wd-amount" className="text-[#abd1c6]">
                Сумма (бонусы)
              </Label>
              <input
                id="wd-amount"
                type="number"
                min={MIN_WITHDRAWAL_BONUSES}
                max={stats.availableBonuses}
                value={amountBonuses}
                onChange={(e) => setAmountBonuses(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 px-3 py-2.5 text-[#fffffe] outline-none focus:border-[#f9bc60]/50"
                required
              />
              <p className="mt-1 text-xs text-[#94a1b2]">
                Доступно: {stats.availableBonuses} бонусов
              </p>
            </div>
            <div>
              <Label htmlFor="wd-bank" className="text-[#abd1c6]">
                Банк
              </Label>
              <input
                id="wd-bank"
                type="text"
                maxLength={MAX_WITHDRAWAL_BANK_LEN}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Например: Сбербанк, Тинькофф"
                className="mt-1.5 w-full rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 px-3 py-2.5 text-[#fffffe] outline-none focus:border-[#f9bc60]/50"
                required
              />
            </div>
            <div>
              <Label htmlFor="wd-details" className="text-[#abd1c6]">
                Реквизиты
              </Label>
              <textarea
                id="wd-details"
                rows={4}
                maxLength={MAX_WITHDRAWAL_DETAILS_LEN}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Номер карты / счёт / телефон для СБП"
                className="mt-1.5 w-full resize-y rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 px-3 py-2.5 text-sm text-[#fffffe] outline-none focus:border-[#f9bc60]/50"
                required
              />
              <p className="mt-1 text-xs text-[#94a1b2]">
                {details.length} / {MAX_WITHDRAWAL_DETAILS_LEN}
              </p>
            </div>

      </form>
    </GlassModal>
  );

  return (
    <>
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/[0.12] bg-[#001e1d]/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md sm:min-w-[260px]">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/15 text-[#f9bc60]">
            <Wallet className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
              Бонусы
            </p>
            <p className="text-2xl font-bold tabular-nums text-[#fffffe]">
              {stats.availableBonuses}{" "}
              <span className="text-base font-semibold text-[#abd1c6]">
                доступно
              </span>
            </p>
            <p className="text-xs text-[#94a1b2]">
              Начислено всего:{" "}
              <span className="font-semibold text-[#abd1c6]">
                {stats.totalEarnedBonuses}
              </span>
              {stats.withdrawnBonuses > 0 && (
                <>
                  {" "}
                  · Выведено:{" "}
                  <span className="font-semibold text-[#abd1c6]">
                    {stats.withdrawnBonuses}
                  </span>
                </>
              )}
            </p>
            {stats.pendingWithdrawalBonuses > 0 && (
              <p className="text-xs text-amber-200/95">
                В заявке на вывод: {stats.pendingWithdrawalBonuses} бонусов
              </p>
            )}
          </div>
        </div>

        {stats.hasPendingWithdrawal && (
          <Badge className="w-fit border-amber-500/40 bg-amber-500/15 text-amber-100">
            Заявка на вывод на проверке
          </Badge>
        )}

        {stats.withdrawalBlocked && (
          <Badge className="w-fit border-rose-500/40 bg-rose-500/15 text-rose-100">
            {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
          </Badge>
        )}

        <Button
          type="button"
          disabled={!canOpen}
          onClick={() => setOpen(true)}
          className="h-11 w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] shadow-lg shadow-[#f9bc60]/15 hover:bg-[#f7b24a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {stats.withdrawalBlocked
            ? "Вывод заблокирован"
            : stats.hasPendingWithdrawal
              ? "Ожидайте решения по заявке"
              : stats.availableBonuses < MIN_WITHDRAWAL_BONUSES
                ? `Вывод от ${MIN_WITHDRAWAL_BONUSES} бонусов`
                : "Вывести бонусы"}
        </Button>
      </div>

      {withdrawModal}
    </>
  );
}
