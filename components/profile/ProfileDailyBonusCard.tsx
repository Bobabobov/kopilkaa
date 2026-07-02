"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DailyBonusRiskConfirmModal,
  type DailyBonusRiskModalPhase,
  type DailyBonusRiskResult,
} from "@/components/profile/DailyBonusRiskConfirmModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  DAILY_BONUS_RISK_WIN_AMOUNT,
  DAILY_BONUS_RISK_WIN_ODDS,
  STREAK_MILESTONES,
} from "@/lib/dailyBonus/constants";
import { invalidateProfileCache } from "@/hooks/profile/useProfileDashboard";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import { dispatchDailyBonusClaimed } from "@/lib/dailyBonus/events";
import { cn } from "@/lib/utils";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import { PROFILE_EMERALD_PANEL } from "@/components/profile/profileEmerald";

type DailyBonusMilestone = {
  days: number;
  bonus: number;
};

type DailyBonusStatus = {
  currentStreak: number;
  canClaim: boolean;
  claimedToday: boolean;
  dailyBonus: number;
  nextMilestone: DailyBonusMilestone | null;
  daysUntilNextMilestone: number;
  progressToNextMilestone: number;
  lastClaimAt: string | null;
  isAdminTestMode?: boolean;
};

type DailyBonusResponse = {
  success: boolean;
  data: DailyBonusStatus;
};

type ProfileDailyBonusCardProps = {
  onBonusClaimed?: () => void;
};

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

function getStreakLabel(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return "дня";
  }
  return "дней";
}

export function ProfileDailyBonusCard({
  onBonusClaimed,
}: ProfileDailyBonusCardProps) {
  const [data, setData] = useState<DailyBonusStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimingRisk, setClaimingRisk] = useState(false);
  const [riskConfirmOpen, setRiskConfirmOpen] = useState(false);
  const [riskModalPhase, setRiskModalPhase] =
    useState<DailyBonusRiskModalPhase>("confirm");
  const [riskResult, setRiskResult] = useState<DailyBonusRiskResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/profile/daily-bonus", {
        method: "GET",
        cache: "no-store",
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(raw, "Не удалось загрузить ежедневный бонус"),
        );
      }
      setData((raw as DailyBonusResponse).data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  const submitClaim = async (mode: "safe" | "risk") => {
    if (!data?.canClaim || claiming || claimingRisk) return;

    const setBusy = mode === "risk" ? setClaimingRisk : setClaiming;

    try {
      setBusy(true);
      setClaimMessage(null);
      setError(null);
      if (mode === "risk") {
        setRiskModalPhase("loading");
      }

      const res = await fetch("/api/profile/daily-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const raw = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(raw, "Не удалось получить бонус"),
        );
      }

      const result = raw as DailyBonusResponse & {
        data: DailyBonusStatus & {
          claimMode?: "safe" | "risk";
          riskWon?: boolean;
          totalGranted?: number;
          grantedMilestone?: number;
          lostBonuses?: number;
        };
      };

      setData(result.data);

      const milestoneGranted = result.data.grantedMilestone ?? 0;

      if (mode === "risk") {
        const riskWon =
          result.data.riskWon ??
          (result.data.totalGranted ?? 0) >= DAILY_BONUS_RISK_WIN_AMOUNT;
        const totalGranted =
          result.data.totalGranted ??
          (riskWon ? DAILY_BONUS_RISK_WIN_AMOUNT : 0);
        const lost = result.data.lostBonuses ?? 0;
        const riskOutcome: DailyBonusRiskResult = {
          won: riskWon,
          totalGranted,
          lostBonuses: lost,
        };
        setRiskResult(riskOutcome);
        setRiskModalPhase("result");
        setRiskConfirmOpen(true);
        setClaimMessage(
          riskOutcome.won
            ? `Риск: выигрыш +${formatBonuses(totalGranted)} бонусов. Серия сброшена.`
            : lost > 0
              ? `Риск: проигрыш — списано ${formatBonuses(lost)} бонусов. Серия сброшена.`
              : "Риск: проигрыш. Серия сброшена — завтра начнёте с нуля.",
        );
      } else {
        const totalGranted = result.data.totalGranted ?? result.data.dailyBonus;
        setClaimMessage(
          milestoneGranted > 0
            ? `На баланс зачислено +${formatBonuses(totalGranted)} бонусов, включая награду за серию.`
            : `На баланс зачислено +${formatBonuses(totalGranted)} бонусов.`,
        );
      }

      invalidateProfileCache();
      dispatchDailyBonusClaimed();
      if (mode === "risk") {
        // Обновление кошелька — после закрытия модалки с результатом.
      } else {
        onBonusClaimed?.();
        setRiskConfirmOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setRiskConfirmOpen(false);
      setRiskModalPhase("confirm");
    } finally {
      setBusy(false);
    }
  };

  const handleClaim = () => {
    void submitClaim("safe");
  };

  const handleRiskClaim = () => {
    setRiskModalPhase("confirm");
    setRiskResult(null);
    setRiskConfirmOpen(true);
  };

  const handleRiskConfirm = () => {
    void submitClaim("risk");
  };

  const handleRiskCancel = () => {
    if (claimingRisk) return;
    setRiskConfirmOpen(false);
    setRiskModalPhase("confirm");
    setRiskResult(null);
  };

  const handleRiskResultClose = () => {
    setRiskConfirmOpen(false);
    setRiskModalPhase("confirm");
    invalidateProfileCache();
    onBonusClaimed?.();
  };

  if (loading) {
    return (
      <article className={PROFILE_EMERALD_PANEL}>
        <Skeleton className="mb-3 h-5 w-40 rounded bg-emerald-950/50" />
        <Skeleton className="h-16 w-full rounded-xl bg-emerald-950/50" />
        <Skeleton className="mt-3 h-9 w-full rounded-lg bg-emerald-950/50" />
      </article>
    );
  }

  if (!data || error) {
    return (
      <article className={PROFILE_EMERALD_PANEL}>
        <p className="text-sm text-zinc-400">
          {error || "Не удалось загрузить данные"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 border-emerald-500/20 text-emerald-400"
          onClick={() => {
            setLoading(true);
            void fetchStatus();
          }}
        >
          Повторить
        </Button>
      </article>
    );
  }

  const progressPercent = Math.round(data.progressToNextMilestone * 100);
  const streakActive = data.currentStreak > 0;

  const statusMessage =
    claimMessage ??
    (data.claimedToday
      ? "Бонус за сегодня уже на балансе. Зайдите завтра, чтобы продлить серию."
      : null);

  return (
    <>
    <motion.div
      id="profile-daily-bonus"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <article className={cn(PROFILE_EMERALD_PANEL, "relative overflow-hidden !p-3.5 sm:!p-4", data.canClaim && !data.claimedToday && "ring-2 ring-[#f9bc60]/40 shadow-[0_0_24px_rgba(249,188,96,0.12)]")}>
        {data.canClaim && !data.claimedToday ? (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-3 py-2 text-xs font-medium text-[#f9bc60]">
            <LucideIcons.Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Бонус за сегодня доступен — заберите ниже
          </div>
        ) : null}
        <ProfileSectionTitle
          imageSrc="/icon/pig8.png"
          imageAlt="Ежедневный бонус"
          title="Ежедневный бонус"
          className="mb-3"
        />

        <div className="relative space-y-3">
          {riskResult ? (
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                riskResult.won
                  ? "border-[#f9bc60]/35 bg-[#f9bc60]/10 text-[#abd1c6]"
                  : "border-[#e16162]/35 bg-[#e16162]/10 text-[#abd1c6]",
              )}
            >
              <span
                className={cn(
                  "font-semibold",
                  riskResult.won ? "text-[#f9bc60]" : "text-[#e16162]",
                )}
              >
                {riskResult.won ? "Выигрыш риска" : "Проигрыш риска"}:
              </span>{" "}
              {riskResult.won
                ? `+${formatBonuses(riskResult.totalGranted)} бонусов`
                : riskResult.lostBonuses > 0
                  ? `−${formatBonuses(riskResult.lostBonuses)} бонусов`
                  : "без списания"}
              . Серия сброшена.
            </div>
          ) : null}

          {/* Серия и награды в одной строке */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-emerald-500/10 bg-emerald-950/30 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                  streakActive
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-400"
                    : "border-emerald-500/15 bg-emerald-950/40 text-zinc-500",
                )}
              >
                <LucideIcons.Flame className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                  Серия
                </p>
                <p className="text-lg font-bold leading-tight text-emerald-400">
                  {formatBonuses(data.currentStreak)}{" "}
                  <span className="text-xs font-medium text-zinc-400">
                    {data.currentStreak > 0
                      ? getStreakLabel(data.currentStreak)
                      : "дней"}
                  </span>
                </p>
              </div>
            </div>

            <div className="hidden h-6 w-px bg-emerald-500/15 sm:block" aria-hidden />

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                Сегодня
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  data.claimedToday ? "text-zinc-400" : "text-[#f9bc60]",
                )}
              >
                {data.claimedToday
                  ? "Получено"
                  : `+${formatBonuses(data.dailyBonus)}`}
              </p>
            </div>

            {data.nextMilestone ? (
              <>
                <div className="hidden h-6 w-px bg-emerald-500/15 sm:block" aria-hidden />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                    Следующая
                  </p>
                  <p className="text-sm font-bold text-[#f9bc60]">
                    +{formatBonuses(data.nextMilestone.bonus)}
                    <span className="ml-1 text-xs font-medium text-zinc-500">
                      через {formatBonuses(data.daysUntilNextMilestone)}{" "}
                      {getStreakLabel(data.daysUntilNextMilestone)}
                    </span>
                  </p>
                </div>
              </>
            ) : null}
          </div>

          {data.nextMilestone ? (
            <div className="space-y-2 rounded-lg border border-emerald-500/10 bg-emerald-950/30 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-zinc-300">
                  До +{formatBonuses(data.nextMilestone.bonus)}
                </span>
                <span className="font-mono font-bold tabular-nums text-emerald-400">
                  {formatBonuses(data.currentStreak)}/
                  {formatBonuses(data.nextMilestone.days)}
                </span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-zinc-950/50">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {STREAK_MILESTONES.map((milestone) => {
                  const reached = data.currentStreak >= milestone.days;
                  const isNext = data.nextMilestone?.days === milestone.days;

                  return (
                    <span
                      key={milestone.days}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        reached
                          ? "border-[#abd1c6]/30 bg-[#abd1c6]/10 text-[#abd1c6]"
                          : isNext
                            ? "border-[#f9bc60]/40 bg-[#f9bc60]/12 text-[#f9bc60]"
                            : "border-white/10 bg-white/[0.03] text-[#667a73]",
                      )}
                    >
                      {milestone.days}д +{formatBonuses(milestone.bonus)}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 rounded-lg border border-[#abd1c6]/20 bg-[#abd1c6]/8 px-3 py-2 text-xs text-[#abd1c6]">
              <LucideIcons.Trophy className="h-3.5 w-3.5 shrink-0" />
              Цикл наград пройден — серия начнётся заново.
            </p>
          )}

          {statusMessage ? (
            <p className="text-xs leading-snug text-zinc-400">{statusMessage}</p>
          ) : null}
        </div>

        <div className="relative mt-3 border-t border-emerald-500/10 pt-3">
          {data.canClaim ? (
            <div className="grid w-full gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="default"
                disabled={claiming || claimingRisk}
                onClick={handleClaim}
                className="h-9 gap-1.5 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                {claiming ? (
                  <>
                    <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Получаем...
                  </>
                ) : (
                  <>
                    <LucideIcons.Coins className="h-3.5 w-3.5" />
                    Забрать +{formatBonuses(data.dailyBonus)}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={claiming || claimingRisk}
                onClick={handleRiskClaim}
                className="h-9 gap-1.5 rounded-lg border border-red-500/20 bg-red-950/40 text-sm font-semibold text-red-400 hover:bg-red-900/30"
              >
                {claimingRisk ? (
                  <>
                    <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Рискуем...
                  </>
                ) : (
                  <>
                    <LucideIcons.Zap className="h-3.5 w-3.5" />
                    Риск +{formatBonuses(DAILY_BONUS_RISK_WIN_AMOUNT)}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="default"
              disabled
              className="h-9 w-full gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-950/40 text-sm font-semibold text-zinc-500"
            >
              <LucideIcons.CalendarCheck className="h-3.5 w-3.5" />
              Приходите завтра
            </Button>
          )}
          {data.canClaim ? (
            <p className="mt-1.5 text-center text-[10px] text-zinc-500">
              Риск: 1 из {formatBonuses(DAILY_BONUS_RISK_WIN_ODDS)}, серия
              сбрасывается
            </p>
          ) : null}
        </div>
      </article>
    </motion.div>

    <DailyBonusRiskConfirmModal
      isOpen={riskConfirmOpen}
      phase={riskModalPhase}
      result={riskResult}
      onCancel={handleRiskCancel}
      onResultClose={handleRiskResultClose}
      onConfirm={handleRiskConfirm}
    />
    </>
  );
}
