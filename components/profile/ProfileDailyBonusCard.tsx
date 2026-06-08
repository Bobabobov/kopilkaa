"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { invalidateProfileCache } from "@/hooks/profile/useProfileDashboard";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

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

type IconBadgeTone = "gold" | "flame" | "mint" | "gift" | "success";

const iconBadgeStyles: Record<
  IconBadgeTone,
  { box: string; icon: string; glow?: string }
> = {
  gold: {
    box: "border-white/15 bg-white/10 text-[#f9bc60] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_30px_rgba(0,0,0,0.18)]",
    icon: "text-[#f9bc60]",
  },
  flame: {
    box: "border-[#e16162]/30 bg-[#e16162]/15 text-[#e16162] shadow-[0_0_24px_rgba(225,97,98,0.18)]",
    icon: "text-[#f9bc60]",
    glow: "bg-[#e16162]/25",
  },
  mint: {
    box: "border-[#abd1c6]/25 bg-[#abd1c6]/10 text-[#abd1c6]",
    icon: "text-[#abd1c6]",
  },
  gift: {
    box: "border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.15)]",
    icon: "text-[#f9bc60]",
  },
  success: {
    box: "border-[#abd1c6]/30 bg-[#abd1c6]/12 text-[#abd1c6]",
    icon: "text-[#abd1c6]",
  },
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

function IconBadge({
  tone,
  children,
  size = "md",
  pulse = false,
}: {
  tone: IconBadgeTone;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const sizeClass =
    size === "lg" ? "h-12 w-12 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-xl" : "h-10 w-10 rounded-xl";

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center backdrop-blur-md ${sizeClass} border ${iconBadgeStyles[tone].box}`}
    >
      {pulse ? (
        <span
          className={`pointer-events-none absolute inset-0 rounded-[inherit] ${iconBadgeStyles[tone].glow} animate-pulse`}
        />
      ) : null}
      <span className={`relative ${iconBadgeStyles[tone].icon}`}>{children}</span>
    </span>
  );
}

export function ProfileDailyBonusCard({
  onBonusClaimed,
}: ProfileDailyBonusCardProps) {
  const [data, setData] = useState<DailyBonusStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
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
    fetchStatus();
  }, [fetchStatus]);

  const handleClaim = async () => {
    if (!data?.canClaim || claiming) return;

    try {
      setClaiming(true);
      setClaimMessage(null);
      setError(null);

      const res = await fetch("/api/profile/daily-bonus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const raw = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(raw, "Не удалось получить бонус"),
        );
      }

      const result = raw as DailyBonusResponse & {
        data: DailyBonusStatus & {
          totalGranted?: number;
          grantedMilestone?: number;
        };
      };

      setData(result.data);

      const totalGranted = result.data.totalGranted ?? result.data.dailyBonus;
      const milestoneGranted = result.data.grantedMilestone ?? 0;
      setClaimMessage(
        milestoneGranted > 0
          ? `Получено +${formatBonuses(totalGranted)} бонусов (включая награду за серию)!`
          : `Получено +${formatBonuses(totalGranted)} бонусов!`,
      );

      invalidateProfileCache();
      onBonusClaimed?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <Card variant="darkGlass" padding="md" className="border-white/[0.08]">
        <div className="mb-4 flex items-start gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-56 rounded-md" />
            <Skeleton className="h-3 w-full max-w-[320px] rounded-md" />
          </div>
        </div>
        <Separator className="mb-4 bg-white/10" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-11 w-full rounded-2xl" />
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
            fetchStatus();
          }}
        >
          Повторить
        </Button>
      </Card>
    );
  }

  const progressPercent = Math.round(data.progressToNextMilestone * 100);
  const streakIsActive = data.currentStreak > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        variant="darkGlass"
        padding="md"
        className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.03]"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f9bc60]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-[#e16162]/12 blur-3xl" />

        <CardHeader className="relative !mb-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <IconBadge tone="gold" size="lg">
                <LucideIcons.PiggyBank className="h-5 w-5 drop-shadow-[0_0_10px_rgba(249,188,96,0.45)]" />
              </IconBadge>
              <div className="min-w-0 space-y-1">
                <h3 className="text-base font-bold text-[#fffffe] sm:text-lg">
                  Копи любит постоянство
                </h3>
                <p className="text-xs leading-relaxed text-[#abd1c6] sm:text-sm">
                  Заходите каждый день и забирайте бонусы. Чем дольше серия
                  посещений — тем больше награда.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              {data.isAdminTestMode ? (
                <Badge
                  variant="secondary"
                  className="gap-1.5 border-[#e16162]/30 bg-[#e16162]/15 text-[#fffffe]"
                >
                  <LucideIcons.TestTube className="h-3.5 w-3.5" />
                  Режим теста
                </Badge>
              ) : null}
              <Badge
                variant={data.canClaim ? "success" : "secondary"}
                className="gap-1.5 border-white/15 bg-white/10 text-[#f9bc60] backdrop-blur-md"
              >
                <LucideIcons.Coins className="h-3.5 w-3.5" />
                +{formatBonuses(data.dailyBonus)} / день
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator className="relative my-4 bg-white/10" />

        <CardContent className="relative space-y-4">
          <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <IconBadge tone="flame" pulse={streakIsActive}>
                <motion.span
                  animate={
                    streakIsActive
                      ? {
                          scale: [1, 1.08, 1],
                        }
                      : undefined
                  }
                  transition={{
                    duration: 1.8,
                    repeat: streakIsActive ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="inline-flex"
                >
                  <LucideIcons.Flame className="h-4 w-4" />
                </motion.span>
              </IconBadge>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#fffffe]">
                  Серия: {formatBonuses(data.currentStreak)}{" "}
                  {getStreakLabel(data.currentStreak)} подряд
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-[#abd1c6]">
                  <LucideIcons.Sparkles className="h-3.5 w-3.5 shrink-0 text-[#f9bc60]" />
                  Сегодняшняя награда: +{formatBonuses(data.dailyBonus)} бонусов
                </p>
              </div>
            </div>
          </div>

          {data.nextMilestone ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <IconBadge tone="gift">
                  <LucideIcons.Gift className="h-4 w-4" />
                </IconBadge>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#f9bc60]">
                    Следующая награда
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#fffffe]">
                    +{formatBonuses(data.nextMilestone.bonus)} бонусов за{" "}
                    {data.nextMilestone.days}{" "}
                    {getStreakLabel(data.nextMilestone.days)} подряд
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-[#abd1c6]">
                    <LucideIcons.Target className="h-3.5 w-3.5 shrink-0 text-[#f9bc60]" />
                    Осталось: {formatBonuses(data.daysUntilNextMilestone)}{" "}
                    {getStreakLabel(data.daysUntilNextMilestone)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs text-[#abd1c6]">
                  <span className="flex items-center gap-2">
                    <LucideIcons.TrendingUp className="h-3.5 w-3.5 text-[#f9bc60]" />
                    Прогресс до следующей награды
                  </span>
                  <span className="font-semibold text-[#fffffe]">
                    {formatBonuses(data.currentStreak)} /{" "}
                    {formatBonuses(data.nextMilestone.days)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] via-[#ffd27d] to-[#e16162] shadow-[0_0_18px_rgba(249,188,96,0.35)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-[#abd1c6]/20 bg-[#abd1c6]/8 px-3 py-3">
              <IconBadge tone="success" size="sm">
                <LucideIcons.Trophy className="h-4 w-4" />
              </IconBadge>
              <p className="text-sm text-[#abd1c6]">
                Цикл серии завершён — начните новый путь к наградам!
              </p>
            </div>
          )}

          {claimMessage ? (
            <div className="flex items-start gap-3 rounded-xl border border-[#abd1c6]/25 bg-[#abd1c6]/10 px-3 py-2.5">
              <IconBadge tone="success" size="sm">
                <LucideIcons.CheckCircle2 className="h-4 w-4" />
              </IconBadge>
              <p className="text-sm text-[#fffffe]">{claimMessage}</p>
            </div>
          ) : null}

          {data.claimedToday && !claimMessage ? (
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
              <IconBadge tone="mint" size="sm">
                <LucideIcons.CalendarCheck className="h-4 w-4" />
              </IconBadge>
              <p className="text-sm text-[#abd1c6]">
                Сегодняшний бонус уже получен. Возвращайтесь завтра.
              </p>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="relative !mt-2 border-white/10">
          <Button
            type="button"
            variant="default"
            disabled={!data.canClaim || claiming}
            onClick={handleClaim}
            className="h-11 w-full gap-2 rounded-2xl border border-[#f9bc60]/45 bg-[#f9bc60]/90 font-bold text-[#001e1d] shadow-lg shadow-[#f9bc60]/15 hover:bg-[#f7b24a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {claiming ? (
              <>
                <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                Получаем бонус...
              </>
            ) : (
              <>
                <LucideIcons.Coins className="h-4 w-4" />
                Забрать бонус (+{formatBonuses(data.dailyBonus)})
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
