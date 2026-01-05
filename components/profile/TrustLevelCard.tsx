"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Shield, Star } from "lucide-react";

import { cn } from "@/lib/utils";

type TrustStatus = "new" | "verified" | "trusted";

type Props = {
  status: TrustStatus;
  supportText?: string;
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
  new: {
    limit: "до 5 000 ₽",
    icon: Shield,
    iconWrapper: "bg-[#e7f3ed] text-[#0f2d25]",
    card: "from-[#f8fbf9] via-[#f4f9f6] to-[#eef6f2] border border-[#e4f2ec] text-[#0f2d25]",
    divider: "border-t border-[#dbeae2]",
    accent: "text-[#1f6a4d]",
  },
  verified: {
    limit: "до 15 000 ₽",
    icon: CheckCircle2,
    iconWrapper: "bg-[#e4f5ee] text-[#0f3a2f]",
    card: "from-[#f7fbf8] via-[#f2f8f4] to-[#ecf4ef] border border-[#d8ebe2] text-[#103127]",
    divider: "border-t border-[#d3e6dc]",
    accent: "text-[#1b7a59]",
  },
  trusted: {
    limit: "до 30 000 ₽",
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
  new: {
    title: "Новый участник",
    description:
      "Вы только начинаете участие в Копилке. Это начальный уровень доверия.",
    extra: "Каждый участник когда-то начинал с этого шага.",
  },
  verified: {
    title: "Проверенный участник",
    description:
      "Вы уже знакомы сообществу Копилки. Это означает, что вы прошли первый путь вместе с нами.",
    extra: "Спасибо, что остаетесь и участвуете честно.",
  },
  trusted: {
    title: "Доверенный участник",
    description:
      "Сообщество знает вас и доверяет вам. Вы стали частью Копилки не на один шаг, а надолго.",
    extra: "Такие участники — важная часть нашего сообщества.",
  },
};

export function TrustLevelCard({ status, supportText }: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const support = supportText || config.limit;
  const text = TRUST_TEXTS[status];

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

            <div className={cn("pt-2", config.divider)} />

            <p className="text-[11px] sm:text-xs text-[#6c7f78] leading-relaxed">
              Следующий уровень открывается после одобрения заявки
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default TrustLevelCard;

