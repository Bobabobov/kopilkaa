"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustLevel } from "@/lib/trustLevel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { LevelStats } from "@/hooks/profile/useProfileDashboard";

type TrustStatus = Lowercase<TrustLevel>;

const STATUS_CONFIG: Record<
  TrustStatus,
  {
    icon: typeof Shield;
    iconWrapper: string;
    card: string;
    divider: string;
    accent: string;
  }
> = {
  level_1: {
    icon: Shield,
    iconWrapper: "bg-[#e7f3ed] text-[#0f2d25]",
    card: "from-[#f8fbf9] via-[#f4f9f6] to-[#eef6f2] border border-[#e4f2ec] text-[#0f2d25]",
    divider: "border-t border-[#dbeae2]",
    accent: "text-[#1f6a4d]",
  },
  level_2: {
    icon: Shield,
    iconWrapper: "bg-[#e7f3ed] text-[#0f2d25]",
    card: "from-[#f8fbf9] via-[#f4f9f6] to-[#eef6f2] border border-[#e4f2ec] text-[#0f2d25]",
    divider: "border-t border-[#dbeae2]",
    accent: "text-[#1f6a4d]",
  },
  level_3: {
    icon: CheckCircle2,
    iconWrapper: "bg-[#e4f5ee] text-[#0f3a2f]",
    card: "from-[#f7fbf8] via-[#f2f8f4] to-[#ecf4ef] border border-[#d8ebe2] text-[#103127]",
    divider: "border-t border-[#d3e6dc]",
    accent: "text-[#1b7a59]",
  },
  level_4: {
    icon: CheckCircle2,
    iconWrapper: "bg-[#e4f5ee] text-[#0f3a2f]",
    card: "from-[#f7fbf8] via-[#f2f8f4] to-[#ecf4ef] border border-[#d8ebe2] text-[#103127]",
    divider: "border-t border-[#d3e6dc]",
    accent: "text-[#1b7a59]",
  },
  level_5: {
    icon: Star,
    iconWrapper: "bg-[#e0f3ea] text-[#0d3227]",
    card: "from-[#f6fbf8] via-[#f0f7f3] to-[#eaf2ed] border border-[#d2e6db] text-[#0e2f24]",
    divider: "border-t border-[#cde2d6]",
    accent: "text-[#1c7f5c]",
  },
  level_6: {
    icon: Star,
    iconWrapper: "bg-[#e0f3ea] text-[#0d3227]",
    card: "from-[#f6fbf8] via-[#f0f7f3] to-[#eaf2ed] border border-[#d2e6db] text-[#0e2f24]",
    divider: "border-t border-[#cde2d6]",
    accent: "text-[#1c7f5c]",
  },
};

const TRUST_TITLES: Record<TrustStatus, string> = {
  level_1: "Новый участник",
  level_2: "Новый участник",
  level_3: "Проверенный участник",
  level_4: "Проверенный участник",
  level_5: "Доверенный участник",
  level_6: "Доверенный участник",
};

type StatRow = {
  label: string;
  value: number;
  variant: "success" | "muted" | "warning" | "danger";
  icon?: keyof typeof LucideIcons;
};

interface ProfileTrustAndStatsCardProps {
  status: TrustStatus;
  supportText?: string;
  progressText?: string | null;
  progressValue?: number | null;
  progressCurrent?: number | null;
  progressTotal?: number | null;
  titleOverride?: string;
  descriptionOverride?: string;
  extraOverride?: string | null;
  levelStats?: LevelStats | null;
}

export function ProfileTrustAndStatsCard({
  status,
  supportText,
  progressText,
  progressValue,
  progressCurrent,
  progressTotal,
  titleOverride,
  descriptionOverride,
  extraOverride,
  levelStats,
}: ProfileTrustAndStatsCardProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const support = supportText || `Уровень ${status.split("_")[1]}`;
  const levelLabel = `Уровень ${status.split("_")[1]}`;
  const title = titleOverride || TRUST_TITLES[status];
  const description =
    descriptionOverride ||
    "Уровень доверия определяет доступный диапазон поддержки по одобренным заявкам.";
  const progressPercent =
    progressValue === null || progressValue === undefined
      ? null
      : Math.round(Math.min(1, Math.max(0, progressValue)) * 100);

  const statRows: StatRow[] = levelStats
    ? [
        {
          label: "Одобрено (в уровень)",
          value: levelStats.approvedCounting,
          variant: "success",
          icon: "CheckCircle",
        },
        {
          label: "Одобрено (без уровня)",
          value: levelStats.approvedWithoutLevel,
          variant: "muted",
        },
        {
          label: "Одобрено с понижением",
          value: levelStats.approvedWithLevelDecrease,
          variant: "warning",
        },
        {
          label: "В процессе",
          value: levelStats.pending,
          variant: "warning",
          icon: "Clock",
        },
        {
          label: "Отклонено",
          value: levelStats.rejectedTotal,
          variant: "muted",
        },
        {
          label: "Отклонено с понижением",
          value: levelStats.rejectedWithLevelDecrease,
          variant: "danger",
          icon: "TrendingDown",
        },
      ]
    : [];

  const totalApplications = levelStats
    ? levelStats.approvedTotal +
      levelStats.rejectedTotal +
      levelStats.pending
    : 0;

  return (
    <section className="space-y-2" aria-labelledby="trust-and-stats-heading">
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-[#94a1b2] uppercase tracking-[0.08em]">
          Ваш статус в Копилке
        </p>
        <h2
          id="trust-and-stats-heading"
          className="text-lg sm:text-xl font-semibold text-[#fffffe]"
        >
          Уровень доверия и статистика
        </h2>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-3xl border shadow-[0_14px_30px_-30px_rgba(15,33,27,0.35)] bg-gradient-to-br",
          config.card,
        )}
      >
        <div className="relative p-4 sm:p-5 md:p-6">
          <Tabs defaultValue="level" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-auto p-1 rounded-xl bg-[#e8f0ec] border border-[#d7e6dd] text-[#2f4b41]">
              <TabsTrigger
                value="level"
                className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-[#1f6a4d]/20 data-[state=active]:text-[#1f6a4d] data-[state=active]:shadow-none"
              >
                Уровень доверия
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="text-xs sm:text-sm py-2.5 data-[state=active]:bg-[#1f6a4d]/20 data-[state=active]:text-[#1f6a4d] data-[state=active]:shadow-none"
              >
                Статистика заявок
              </TabsTrigger>
            </TabsList>

            <TabsContent value="level" className="mt-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl border border-[#d6e9e0]/70 shrink-0",
                      config.iconWrapper,
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.3} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className={cn("text-base sm:text-lg font-semibold", config.accent)}>
                      {title}
                    </p>
                    <p className="inline-flex w-fit items-center rounded-full border border-[#1f6a4d]/30 bg-[#e6f3ed] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6a4d]">
                      {levelLabel}
                    </p>
                    <p className="text-sm text-[#4f615a] leading-relaxed">
                      {description}
                    </p>
                    {extraOverride && (
                      <p className="text-xs text-[#667a73] leading-relaxed">
                        {extraOverride}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-[#667a73]">
                    Ориентир по поддержке:{" "}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-[#3a554d]">
                    {support}
                  </span>
                  <p className="text-[11px] text-[#667a73] leading-relaxed">
                    Уровень — ориентир, не гарантия суммы и одобрения.
                  </p>
                </div>

                {progressText &&
                  progressPercent !== null &&
                  progressCurrent !== null &&
                  progressTotal !== null && (
                    <div className="rounded-xl border border-[#d7e6dd] bg-[#eef4f1] px-3 py-3 space-y-2.5">
                      <p className="text-[11px] sm:text-xs font-medium text-[#2f4b41] tracking-[0.01em]">
                        Прогресс до следующего уровня
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#0f2d25]">
                        {progressCurrent} из {progressTotal} одобренных заявок
                      </p>
                      <div className="space-y-1.5">
                        <div className="h-2 rounded-full bg-[#d8e6dd] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full bg-[#1f6a4d]"
                          />
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#3e5a51] leading-relaxed">
                          {progressText}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              {statRows.length > 0 ? (
                <div className="space-y-3">
                  {totalApplications > 0 && (
                    <p className="text-sm text-[#667a73]">
                      Всего заявок:{" "}
                      <span className="font-semibold text-[#0f2d25]">
                        {totalApplications}
                      </span>
                    </p>
                  )}
                  <ul className="space-y-2" role="list">
                    {statRows.map((row) => (
                      <StatRowFull key={row.label} row={row} />
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-[#667a73]">
                  Пока нет заявок для отображения статистики.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.article>
    </section>
  );
}

/** Строка статистики с полной подписью (без обрезки), для таба «Статистика заявок». */
function StatRowFull({ row }: { row: StatRow }) {
  const variantStyles = {
    success:
      "bg-[#e6f3ed]/80 border-[#1f6a4d]/25 text-[#1f6a4d]",
    muted:
      "bg-[#eef2f0] border-[#c5d4ce]/60 text-[#4f615a]",
    warning:
      "bg-[#fef3e6]/80 border-[#e8a545]/30 text-[#b8751a]",
    danger:
      "bg-[#fce8e8]/80 border-[#e16162]/30 text-[#c94a4a]",
  };
  const Icon = row.icon ? LucideIcons[row.icon] : null;
  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
        variantStyles[row.variant],
      )}
    >
      <span className="text-sm font-medium text-left flex-1 min-w-0">
        {row.label}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {Icon && <Icon className="h-4 w-4 opacity-80" />}
        <Badge
          variant="secondary"
          className={cn(
            "h-7 min-w-[1.75rem] justify-center font-semibold tabular-nums text-sm px-2",
            row.variant === "success" && "bg-[#1f6a4d]/15 text-[#1f6a4d] border-[#1f6a4d]/30",
            row.variant === "danger" && "bg-[#e16162]/15 text-[#c94a4a] border-[#e16162]/30",
            row.variant === "warning" && "bg-[#e8a545]/15 text-[#b8751a] border-[#e8a545]/30",
          )}
        >
          {row.value}
        </Badge>
      </div>
    </li>
  );
}

export default ProfileTrustAndStatsCard;
