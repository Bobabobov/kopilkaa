"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TrustLevel } from "@/lib/trustLevel";

type TrustStatus = Lowercase<TrustLevel>;

type Props = {
  status: TrustStatus;
  supportText?: string;
  progressText?: string | null;
  progressValue?: number | null;
  progressCurrent?: number | null;
  progressTotal?: number | null;
};

const STATUS_CONFIG: Record<
  TrustStatus,
  {
    limit: string;
    icon: typeof Shield;
    iconWrapper: string;
    card: string;
    divider: string;
    accent: string;
  }
> = {
  level_1: {
    limit: "до 150 ₽",
    icon: Shield,
    iconWrapper: "bg-[#e7f3ed] text-[#0f2d25]",
    card: "from-[#f8fbf9] via-[#f4f9f6] to-[#eef6f2] border border-[#e4f2ec] text-[#0f2d25]",
    divider: "border-t border-[#dbeae2]",
    accent: "text-[#1f6a4d]",
  },
  level_2: {
    limit: "до 300 ₽",
    icon: Shield,
    iconWrapper: "bg-[#e7f3ed] text-[#0f2d25]",
    card: "from-[#f8fbf9] via-[#f4f9f6] to-[#eef6f2] border border-[#e4f2ec] text-[#0f2d25]",
    divider: "border-t border-[#dbeae2]",
    accent: "text-[#1f6a4d]",
  },
  level_3: {
    limit: "до 700 ₽",
    icon: CheckCircle2,
    iconWrapper: "bg-[#e4f5ee] text-[#0f3a2f]",
    card: "from-[#f7fbf8] via-[#f2f8f4] to-[#ecf4ef] border border-[#d8ebe2] text-[#103127]",
    divider: "border-t border-[#d3e6dc]",
    accent: "text-[#1b7a59]",
  },
  level_4: {
    limit: "до 1 500 ₽",
    icon: CheckCircle2,
    iconWrapper: "bg-[#e4f5ee] text-[#0f3a2f]",
    card: "from-[#f7fbf8] via-[#f2f8f4] to-[#ecf4ef] border border-[#d8ebe2] text-[#103127]",
    divider: "border-t border-[#d3e6dc]",
    accent: "text-[#1b7a59]",
  },
  level_5: {
    limit: "до 3 000 ₽",
    icon: Star,
    iconWrapper: "bg-[#e0f3ea] text-[#0d3227]",
    card: "from-[#f6fbf8] via-[#f0f7f3] to-[#eaf2ed] border border-[#d2e6db] text-[#0e2f24]",
    divider: "border-t border-[#cde2d6]",
    accent: "text-[#1c7f5c]",
  },
  level_6: {
    limit: "до 5 000 ₽",
    icon: Star,
    iconWrapper: "bg-[#e0f3ea] text-[#0d3227]",
    card: "from-[#f6fbf8] via-[#f0f7f3] to-[#eaf2ed] border border-[#d2e6db] text-[#0e2f24]",
    divider: "border-t border-[#cde2d6]",
    accent: "text-[#1c7f5c]",
  },
};

const TRUST_TEXTS: Record<
  TrustStatus,
  {
    title: string;
    description: string;
    extra?: string;
  }
> = {
  level_1: {
    title: "Новый участник",
    description:
      "Вы только начинаете участие в Копилке. Это начальный уровень доверия.",
    extra: "Каждый участник когда-то начинал с этого шага.",
  },
  level_2: {
    title: "Новый участник",
    description:
      "Вы только начинаете участие в Копилке. Это начальный уровень доверия.",
    extra: "Каждый участник когда-то начинал с этого шага.",
  },
  level_3: {
    title: "Проверенный участник",
    description:
      "Вы уже знакомы сообществу Копилки. Это означает, что вы прошли первый путь вместе с нами.",
    extra: "Спасибо, что остаетесь и участвуете честно.",
  },
  level_4: {
    title: "Проверенный участник",
    description:
      "Вы уже знакомы сообществу Копилки. Это означает, что вы прошли первый путь вместе с нами.",
    extra: "Спасибо, что остаетесь и участвуете честно.",
  },
  level_5: {
    title: "Доверенный участник",
    description:
      "Сообщество знает вас и доверяет вам. Вы стали частью Копилки не на один шаг, а надолго.",
    extra: "Такие участники — важная часть нашего сообщества.",
  },
  level_6: {
    title: "Доверенный участник",
    description:
      "Сообщество знает вас и доверяет вам. Вы стали частью Копилки не на один шаг, а надолго.",
    extra: "Такие участники — важная часть нашего сообщества.",
  },
};

export function TrustLevelCard({
  status,
  supportText,
  progressText,
  progressValue,
  progressCurrent,
  progressTotal,
}: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const support = supportText || config.limit;
  const text = TRUST_TEXTS[status];
  const progressPercent =
    progressValue === null || progressValue === undefined
      ? null
      : Math.round(Math.min(1, Math.max(0, progressValue)) * 100);

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-[#94a1b2] uppercase tracking-[0.08em]">
          Ваш статус в Копилке
        </p>
        <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
          Уровень доверия
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{
          y: -4,
          boxShadow:
            "0 6px 18px -18px rgba(0,0,0,0.28), 0 3px 10px -12px rgba(32, 94, 70, 0.14)",
        }}
        className={cn(
          "relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-6 transition-transform duration-300",
          "bg-gradient-to-br shadow-[0_14px_30px_-30px_rgba(15,33,27,0.35)]",
          config.card,
        )}
      >
        <div className="relative flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className={cn("p-2.5 rounded-xl border border-[#d6e9e0]/70", config.iconWrapper)}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.3} />
            </div>
            <div className="space-y-1">
              <p className={cn("text-lg sm:text-xl font-semibold", config.accent)}>
                {text.title}
              </p>
              <p className="text-sm text-[#4f615a] leading-relaxed">
                {text.description}
              </p>
              {text.extra && (
                <p className="text-xs text-[#667a73] leading-relaxed">
                  {text.extra}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className={cn("", config.divider)} />

            <div className="space-y-1">
              <span className="text-sm text-[#667a73]">Максимальная поддержка:</span>
              <span className="text-base sm:text-lg font-semibold text-[#3a554d]">
                {support}
              </span>
            </div>

            {progressText && progressPercent !== null && progressCurrent !== null && progressTotal !== null && (
              <>
                <div className={cn("pt-1", config.divider)} />

                <div className="rounded-xl border border-[#d7e6dd] bg-[#eef4f1] px-3 py-3 space-y-2.5">
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
                    className="text-[11px] sm:text-xs font-medium text-[#2f4b41] tracking-[0.01em]"
                  >
                    Прогресс до следующего уровня
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
                    className="text-sm sm:text-base font-semibold text-[#0f2d25]"
                  >
                    {progressCurrent} из {progressTotal} одобренных заявок
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut", delay: 0.16 }}
                    className="space-y-1.5"
                  >
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
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default TrustLevelCard;

