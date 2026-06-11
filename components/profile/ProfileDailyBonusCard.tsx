"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ProfileImageIcon } from "@/components/profile/ProfileImageIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
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
import { cn } from "@/lib/utils";

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

function InfoPill({
  icon,
  title,
  value,
  subtitle,
  accent = false,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-3 rounded-2xl border p-3.5 sm:p-4",
        accent
          ? "border-[#f9bc60]/25 bg-gradient-to-br from-[#f9bc60]/12 via-[#f9bc60]/6 to-transparent"
          : "border-white/10 bg-white/[0.04]",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
          accent
            ? "border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60]"
            : "border-white/10 bg-white/5 text-[#abd1c6]",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#abd1c6]/90">
          {title}
        </p>
        <p
          className={cn(
            "mt-0.5 text-base font-bold sm:text-lg",
            accent ? "text-[#f9bc60]" : "text-[#fffffe]",
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs leading-snug text-[#abd1c6]">{subtitle}</p>
      </div>
    </div>
  );
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
      <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
        <Skeleton className="mb-4 h-28 w-full rounded-2xl bg-white/5" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
          <Skeleton className="h-24 rounded-2xl bg-white/5" />
        </div>
        <Skeleton className="mt-4 h-16 w-full rounded-2xl bg-white/5" />
        <Skeleton className="mt-4 h-11 w-full rounded-xl bg-white/5" />
      </Card>
    );
  }

  if (!data || error) {
    return (
      <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
        <p className="text-sm text-[#abd1c6]">
          {error || "Не удалось загрузить данные"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            setLoading(true);
            void fetchStatus();
          }}
        >
          Повторить
        </Button>
      </Card>
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        variant="darkGlass"
        padding="md"
        className="relative overflow-hidden border-white/[0.08]"
      >
        <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#f9bc60]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-[#e16162]/10 blur-3xl" />

        <CardContent className="relative space-y-4 !p-0">
          {riskResult ? (
            <div
              className={cn(
                "rounded-2xl border px-4 py-3.5 sm:px-5",
                riskResult.won
                  ? "border-[#f9bc60]/35 bg-gradient-to-br from-[#f9bc60]/16 via-[#f9bc60]/8 to-transparent"
                  : "border-[#e16162]/35 bg-gradient-to-br from-[#e16162]/16 via-[#e16162]/8 to-transparent",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    riskResult.won
                      ? "border-[#f9bc60]/35 bg-[#f9bc60]/15 text-[#f9bc60]"
                      : "border-[#e16162]/35 bg-[#e16162]/15 text-[#e16162]",
                  )}
                >
                  {riskResult.won ? (
                    <LucideIcons.Trophy className="h-5 w-5" />
                  ) : (
                    <LucideIcons.XCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      riskResult.won ? "text-[#f9bc60]" : "text-[#e16162]",
                    )}
                  >
                    {riskResult.won ? "Вы выиграли риск!" : "Вы проиграли риск"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#abd1c6]">
                    {riskResult.won
                      ? `+${formatBonuses(riskResult.totalGranted)} бонусов на баланс.`
                      : riskResult.lostBonuses > 0
                        ? `Списано ${formatBonuses(riskResult.lostBonuses)} бонусов.`
                        : "Бонусов для списания не было."}{" "}
                    Серия сброшена.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Герой: серия */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-4 sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,188,96,0.12),transparent_55%)]" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl border shadow-[0_8px_24px_rgba(0,0,0,0.2)]",
                      streakActive
                        ? "border-[#f9bc60]/35 bg-gradient-to-br from-[#f9bc60]/20 to-[#e16162]/10 text-[#f9bc60]"
                        : "border-white/15 bg-white/5 text-[#abd1c6]",
                    )}
                  >
                    <LucideIcons.Flame className="h-6 w-6" />
                  </div>
                  <ProfileImageIcon
                    src="/icon/pig8.png"
                    alt=""
                    size="xs"
                    className="absolute -bottom-1 -right-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#abd1c6]">
                    Серия посещений
                  </p>
                  <p className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-4xl font-black leading-none tracking-tight text-[#fffffe] sm:text-5xl">
                      {formatBonuses(data.currentStreak)}
                    </span>
                    <span className="text-sm font-medium text-[#abd1c6]">
                      {data.currentStreak > 0
                        ? getStreakLabel(data.currentStreak)
                        : "дней"}
                      {data.currentStreak > 0 ? " подряд" : " — начните сегодня"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                {data.isAdminTestMode ? (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 border-[#e16162]/30 bg-[#e16162]/15 text-[#fffffe]"
                  >
                    <LucideIcons.TestTube className="h-3.5 w-3.5" />
                    Тест
                  </Badge>
                ) : null}
                <Badge
                  variant={data.canClaim ? "success" : "secondary"}
                  className={cn(
                    "gap-1.5 font-semibold",
                    data.canClaim
                      ? "border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60]"
                      : "border-white/15 bg-white/10 text-[#abd1c6]",
                  )}
                >
                  {data.canClaim ? (
                    <LucideIcons.Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <LucideIcons.Check className="h-3.5 w-3.5" />
                  )}
                  {data.canClaim ? "Бонус доступен" : "Сегодня получено"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPill
              icon={<LucideIcons.Coins className="h-5 w-5" />}
              title="За сегодня"
              value={
                data.claimedToday
                  ? "Получено"
                  : `+${formatBonuses(data.dailyBonus)}`
              }
              subtitle={
                data.claimedToday
                  ? "Завтра снова можно забрать бонус"
                  : "Нажмите кнопку ниже, чтобы забрать"
              }
              accent={!data.claimedToday}
            />
            <InfoPill
              icon={<LucideIcons.Gift className="h-5 w-5" />}
              title="Следующая награда"
              value={
                data.nextMilestone
                  ? `+${formatBonuses(data.nextMilestone.bonus)}`
                  : "Цикл пройден"
              }
              subtitle={
                data.nextMilestone
                  ? `Через ${formatBonuses(data.daysUntilNextMilestone)} ${getStreakLabel(data.daysUntilNextMilestone)} · за ${data.nextMilestone.days} ${getStreakLabel(data.nextMilestone.days)}`
                  : "Все награды серии уже получены"
              }
              accent={Boolean(data.nextMilestone)}
            />
          </div>

          {data.nextMilestone ? (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <ProfileImageIcon src="/icon/pig14.png" alt="" size="xs" />
                  <p className="text-sm font-medium text-[#fffffe]">
                    Путь к награде +{formatBonuses(data.nextMilestone.bonus)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#f9bc60]">
                  {formatBonuses(data.currentStreak)} /{" "}
                  {formatBonuses(data.nextMilestone.days)}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-black/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] via-[#ffd27d] to-[#e8a545] shadow-[0_0_16px_rgba(249,188,96,0.35)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                {STREAK_MILESTONES.map((milestone) => {
                  const reached = data.currentStreak >= milestone.days;
                  const isNext = data.nextMilestone?.days === milestone.days;

                  return (
                    <div
                      key={milestone.days}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
                        reached
                          ? "border-[#abd1c6]/30 bg-[#abd1c6]/10 text-[#abd1c6]"
                          : isNext
                            ? "border-[#f9bc60]/40 bg-[#f9bc60]/12 text-[#f9bc60]"
                            : "border-white/10 bg-white/[0.03] text-[#667a73]",
                      )}
                    >
                      <span className="font-semibold">{milestone.days} дн.</span>
                      <span className="opacity-80">
                        +{formatBonuses(milestone.bonus)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs leading-relaxed text-[#667a73]">
                Каждый день — +{formatBonuses(data.dailyBonus)} бонусов. Пропуск
                сбрасывает серию.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-[#abd1c6]/20 bg-[#abd1c6]/8 px-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#abd1c6]/25 bg-[#abd1c6]/10 text-[#abd1c6]">
                <LucideIcons.Trophy className="h-5 w-5" />
              </div>
              <p className="text-sm leading-relaxed text-[#abd1c6]">
                Вы прошли весь цикл наград. Новая серия начнётся с первого дня.
              </p>
            </div>
          )}

          {statusMessage ? (
            <>
              <Separator className="bg-white/10" />
              <p className="rounded-xl border border-[#abd1c6]/20 bg-[#abd1c6]/8 px-3.5 py-2.5 text-sm text-[#abd1c6]">
                {statusMessage}
              </p>
            </>
          ) : null}
        </CardContent>

        <CardFooter className="relative !mt-4 border-[#abd1c6]/10 !p-0">
          {data.canClaim ? (
            <div className="grid w-full gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="default"
                disabled={claiming || claimingRisk}
                onClick={handleClaim}
                className="h-11 gap-2 rounded-xl border border-[#f9bc60]/45 bg-[#f9bc60]/90 font-semibold text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all hover:bg-[#f7b24a]"
              >
                {claiming ? (
                  <>
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                    Получаем...
                  </>
                ) : (
                  <>
                    <LucideIcons.Coins className="h-4 w-4" />
                    Забрать +{formatBonuses(data.dailyBonus)}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={claiming || claimingRisk}
                onClick={handleRiskClaim}
                className="h-11 gap-2 rounded-xl border-[#e16162]/45 bg-[#e16162]/12 font-semibold text-[#fffffe] transition-all hover:border-[#e16162]/60 hover:bg-[#e16162]/20"
              >
                {claimingRisk ? (
                  <>
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                    Рискуем...
                  </>
                ) : (
                  <>
                    <LucideIcons.Zap className="h-4 w-4 text-[#e16162]" />
                    Риск: +{formatBonuses(DAILY_BONUS_RISK_WIN_AMOUNT)} или всё
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="default"
              disabled
              className="h-11 w-full gap-2 rounded-xl border border-white/15 bg-white/10 font-semibold text-[#abd1c6]"
            >
              <LucideIcons.CalendarCheck className="h-4 w-4" />
              Приходите завтра
            </Button>
          )}
          {data.canClaim ? (
            <p className="mt-2 w-full text-center text-[11px] leading-relaxed text-[#667a73]">
              Риск: шанс +{formatBonuses(DAILY_BONUS_RISK_WIN_AMOUNT)} — 1 из{" "}
              {formatBonuses(DAILY_BONUS_RISK_WIN_ODDS)}. Серия сбрасывается.
            </p>
          ) : null}
        </CardFooter>
      </Card>
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
