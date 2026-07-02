"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import { getMessageFromApiJson, throwIfApiFailed } from "@/lib/api/parseApiError";
import { ADMIN_LEVEL_RESET_STARTER_BONUSES } from "@/lib/admin/bonusWithdrawalBlock";
import { MAX_ACTIVE_PROFILE_LEVEL } from "@/lib/level-config/shared";
import { formatExperience } from "@/lib/format";
import { toDisplayExperience } from "@/lib/userLevel/economy";
import { getUserLevelProgress } from "@/lib/userLevel";
import {
  AdminPanel,
  AdminStatGrid,
  adminFieldClass,
} from "@/app/admin/_components/admin-ui";
import type { AdminUserDetail } from "../types";

interface AdminUserEconomyControlsProps {
  user: AdminUserDetail;
  onUserUpdated: () => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
  disabled?: boolean;
}

type BusyKind = "level" | "bonus" | "withdraw" | "heroes" | null;

export function AdminUserEconomyControls({
  user,
  onUserUpdated,
  showToast,
  disabled = false,
}: AdminUserEconomyControlsProps) {
  const { confirm } = useBeautifulNotifications();
  const [busy, setBusy] = useState<BusyKind>(null);
  const [amount, setAmount] = useState("10");
  const [levelTarget, setLevelTarget] = useState(String(user.level));

  useEffect(() => {
    if (busy !== "level") {
      setLevelTarget(String(user.level));
    }
  }, [user.level, user.id, busy]);

  const displayXp = toDisplayExperience(user.experience);
  const progress = getUserLevelProgress(displayXp);
  const withdrawalBlocked =
    user.bonusWithdrawalBlocked || user.wallet.withdrawalBlocked;

  const patchLevelReset = async () => {
    const agreed = await confirm(
      `Сброс до 1 уровня: опыт обнуляется, баланс сбрасывается, выдаётся ${ADMIN_LEVEL_RESET_STARTER_BONUSES} бонусов и новый цикл заявок.`,
      "Сброс уровня",
    );
    if (!agreed) return;

    setBusy("level");
    try {
      const res = await fetch(`/api/admin/bonuses/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelAction: "reset" }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось обновить уровень");
      const snapshot = json?.data?.level as { level?: number } | undefined;
      showToast(
        "success",
        "Уровень сброшен",
        snapshot?.level != null ? `Сейчас ур. ${snapshot.level}` : undefined,
      );
      setLevelTarget("1");
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось обновить уровень",
      );
    } finally {
      setBusy(null);
    }
  };

  const applyLevelTarget = async (direction: "up" | "down") => {
    const target = parseInt(levelTarget, 10);
    if (
      !Number.isFinite(target) ||
      target < 1 ||
      target > MAX_ACTIVE_PROFILE_LEVEL
    ) {
      showToast(
        "error",
        "Некорректный уровень",
        `Укажите число от 1 до ${MAX_ACTIVE_PROFILE_LEVEL}`,
      );
      return;
    }

    if (direction === "up" && target <= user.level) {
      showToast(
        "error",
        "Повышение невозможно",
        `Сейчас ур. ${user.level}. Выберите уровень выше.`,
      );
      return;
    }

    if (direction === "down" && target >= user.level) {
      showToast(
        "error",
        "Понижение невозможно",
        `Сейчас ур. ${user.level}. Выберите уровень ниже.`,
      );
      return;
    }

    setBusy("level");
    try {
      const res = await fetch(`/api/admin/bonuses/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLevel: target }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось обновить уровень");
      const snapshot = json?.data?.level as { level?: number } | undefined;
      showToast(
        "success",
        direction === "up" ? "Уровень повышен" : "Уровень понижен",
        snapshot?.level != null ? `Сейчас ур. ${snapshot.level}` : undefined,
      );
      if (snapshot?.level != null) {
        setLevelTarget(String(snapshot.level));
      }
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось обновить уровень",
      );
    } finally {
      setBusy(null);
    }
  };

  const changeBonuses = async (
    action: "grant" | "deduct",
    amountOverride?: number,
  ) => {
    const parsed =
      amountOverride ?? parseInt(amount, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      showToast("error", "Укажите сумму", "Введите число больше 0");
      return;
    }

    if (action === "deduct" && parsed > user.wallet.availableBonuses) {
      showToast(
        "error",
        "Мало бонусов",
        `Доступно только ${user.wallet.availableBonuses}`,
      );
      return;
    }

    setBusy("bonus");
    try {
      const res = await fetch("/api/admin/good-deeds/bonuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amountBonuses: parsed,
          action,
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось изменить бонусы");
      const available = json?.data?.availableBonuses;
      showToast(
        "success",
        action === "grant" ? "Начислено" : "Списано",
        available != null ? `Доступно: ${available}` : undefined,
      );
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось изменить бонусы",
      );
    } finally {
      setBusy(null);
    }
  };

  const toggleWithdrawalBlock = async () => {
    const nextBlocked = !withdrawalBlocked;
    if (nextBlocked) {
      const agreed = await confirm(
        "Пользователь не сможет выводить бонусы, пока вы не разблокируете.",
        "Заблокировать вывод?",
      );
      if (!agreed) return;
    }

    setBusy("withdraw");
    try {
      const res = await fetch(`/api/admin/bonuses/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalBlocked: nextBlocked }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось обновить");
      showToast("success", nextBlocked ? "Вывод заблокирован" : "Вывод открыт");
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось обновить",
      );
    } finally {
      setBusy(null);
    }
  };

  const toggleHideFromHeroes = async () => {
    const nextHide = !user.hideFromHeroes;
    setBusy("heroes");
    try {
      const res = await fetch("/api/admin/heroes/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: user.id, hide: nextHide }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(getMessageFromApiJson(json, "Не удалось обновить"));
      }
      showToast("success", nextHide ? "Скрыт из героев" : "Снова в героях");
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось обновить",
      );
    } finally {
      setBusy(null);
    }
  };

  const isBusy = busy !== null;
  const controlsDisabled = disabled || isBusy;

  return (
    <AdminPanel
      title="Экономика"
      subtitle="Уровень, бонусы и ограничения"
      accent="gold"
      className="shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-3 flex justify-end">
        <Link href="/admin/bonuses" className="text-xs font-medium text-[#f9bc60] hover:underline">
          Все бонусы →
        </Link>
      </div>

      {disabled ? (
        <p className="text-sm text-[#abd1c6]/60">
          Для администраторов экономику не меняем.
        </p>
      ) : (
        <>
          {/* Главное — сразу видно */}
          <AdminStatGrid
            className="mb-3"
            columns={2}
            items={[
              {
                label: "Уровень",
                value: user.level,
                tone: "pending",
              },
              {
                label: "На балансе",
                value: user.wallet.availableBonuses,
                tone: "pending",
                highlight: user.wallet.availableBonuses > 0,
              },
            ]}
          />
          <p className="mb-3 text-center text-[10px] text-[#abd1c6]/70 sm:text-left">
            {formatExperience(displayXp)} XP · {progress.progressPercent}% до след. уровня
          </p>

          {(withdrawalBlocked || user.hideFromHeroes || user.adminEconomyResetAt) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {withdrawalBlocked ? (
                <StatusChip tone="warn">Вывод закрыт</StatusChip>
              ) : null}
              {user.hideFromHeroes ? (
                <StatusChip tone="muted">Скрыт в героях</StatusChip>
              ) : null}
              {user.adminEconomyResetAt ? (
                <StatusChip tone="muted">Цикл сброшен</StatusChip>
              ) : null}
            </div>
          )}

          {/* Быстрые действия */}
          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              disabled={controlsDisabled}
              className="h-9 w-full bg-[#10B981] hover:bg-[#059669] text-white text-xs"
              onClick={() => changeBonuses("grant", 10)}
            >
              +10 бонусов
            </Button>
          </div>

          {/* Подробные настройки — по клику */}
          <details className="group mt-3 overflow-hidden rounded-xl border-2 border-[#f9bc60]/20 bg-[#001e1d]/30">
            <summary className="cursor-pointer list-none border-b border-transparent bg-[#f9bc60]/5 px-3 py-2.5 text-xs font-bold text-[#f9bc60] hover:bg-[#f9bc60]/10 [&::-webkit-details-marker]:hidden">
              Подробные настройки
            </summary>
            <div className="space-y-4 border-t border-[#abd1c6]/10 px-3 py-3">
              <div>
                <p className="mb-2 text-[11px] text-[#abd1c6]/70">
                  Начислить или списать бонусы
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={amount}
                    disabled={controlsDisabled}
                    onChange={(e) => setAmount(e.target.value)}
                    className={adminFieldClass}
                  />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={controlsDisabled || busy === "bonus"}
                    className="h-8 text-xs bg-[#10B981] hover:bg-[#059669] text-white"
                    onClick={() => changeBonuses("grant")}
                  >
                    Начислить
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={controlsDisabled || busy === "bonus"}
                    className="h-8 text-xs border-rose-400/35 text-rose-200"
                    onClick={() => changeBonuses("deduct")}
                  >
                    Списать
                  </Button>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-[11px]">
                <Stat label="Всего начислено" value={user.wallet.totalEarnedBonuses} />
                <Stat
                  label="Вложено в опыт"
                  value={user.wallet.bonusesInvestedInExperience}
                />
                <Stat label="Выведено" value={user.wallet.withdrawnBonuses} />
                <Stat
                  label="В ожидании вывода"
                  value={user.wallet.pendingWithdrawalBonuses}
                />
              </dl>

              <div className="space-y-2">
                <p className="text-[11px] text-[#abd1c6]/70">
                  Уровень (сейчас {user.level})
                </p>
                <input
                  type="number"
                  min={1}
                  max={MAX_ACTIVE_PROFILE_LEVEL}
                  value={levelTarget}
                  disabled={controlsDisabled}
                  onChange={(e) => setLevelTarget(e.target.value)}
                  className={adminFieldClass}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      controlsDisabled ||
                      busy === "level" ||
                      parseInt(levelTarget, 10) <= user.level
                    }
                    className="h-8 text-xs bg-[#10B981] hover:bg-[#059669] text-white"
                    onClick={() => applyLevelTarget("up")}
                  >
                    Повысить до
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={
                      controlsDisabled ||
                      busy === "level" ||
                      parseInt(levelTarget, 10) >= user.level ||
                      user.level <= 1
                    }
                    className="h-8 text-xs border-amber-400/35 text-amber-200"
                    onClick={() => applyLevelTarget("down")}
                  >
                    Понизить до
                  </Button>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={controlsDisabled || user.level <= 1}
                  className="h-8 w-full border-rose-400/35 text-xs text-rose-200"
                  onClick={patchLevelReset}
                >
                  Сбросить до 1 уровня
                </Button>
                <p className="text-[10px] leading-snug text-[#abd1c6]/50">
                  Повышение и понижение меняют только уровень и опыт. Сброс
                  обнуляет баланс, выдаёт {ADMIN_LEVEL_RESET_STARTER_BONUSES}{" "}
                  бонусов и новый цикл заявок.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-[#abd1c6]/70">Ограничения</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={controlsDisabled}
                  className={`h-8 w-full text-xs ${
                    withdrawalBlocked
                      ? "border-emerald-400/40 text-emerald-200"
                      : "border-rose-400/35 text-rose-200"
                  }`}
                  onClick={toggleWithdrawalBlock}
                >
                  {withdrawalBlocked ? "Открыть вывод бонусов" : "Закрыть вывод бонусов"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={controlsDisabled}
                  className="h-8 w-full border-[#abd1c6]/30 text-xs text-[#abd1c6]"
                  onClick={toggleHideFromHeroes}
                >
                  {user.hideFromHeroes
                    ? "Показать в разделе «Герои»"
                    : "Скрыть из раздела «Герои»"}
                </Button>
              </div>
            </div>
          </details>
        </>
      )}
    </AdminPanel>
  );
}

function StatusChip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "warn" | "muted";
}) {
  const cls =
    tone === "warn"
      ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
      : "border-[#abd1c6]/25 bg-[#abd1c6]/5 text-[#abd1c6]/80";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#001e1d]/40 px-2 py-1.5">
      <dt className="text-[#abd1c6]/55">{label}</dt>
      <dd className="font-semibold tabular-nums text-[#fffffe]">{value}</dd>
    </div>
  );
}
