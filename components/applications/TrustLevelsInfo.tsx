"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Star, UserRound } from "lucide-react";

const LEVELS = [
  {
    key: "new",
    title: "Новый участник",
    subtitle: "Стартовый уровень доверия",
    support: "от 50 до 300 ₽",
    obtain: "Статус присваивается индивидуально",
    desc: "Это первый шаг, чтобы мы познакомились и убедились, что заявка реальная.",
    icon: UserRound,
    tone: {
      bg: "bg-[#0f2f28]/80",
      border: "border-[#1f4a3f]/60",
      iconBg: "bg-[#e7f2ec] text-[#0f2d25]",
      title: "text-[#e3f0ea]",
      muted: "text-[#9bb5ad]",
      pad: "py-4 sm:py-5 px-4 sm:px-5",
      ring: "shadow-[0_14px_34px_-28px_rgba(0,0,0,0.45)]",
    },
  },
  {
    key: "verified",
    title: "Проверенный участник",
    subtitle: "Подтверждён сообществом",
    support: "до 1 500 ₽",
    obtain: "Решение принимает сообщество по итогам заявки",
    desc: "Этот статус получают не все. Он означает, что сообщество доверяет вам.",
    icon: ShieldCheck,
    tone: {
      bg: "bg-[#10382f]/85",
      border: "border-[#2e6f5a]/65",
      iconBg: "bg-[#d9f0e6] text-[#0f3a2f]",
      title: "text-[#e9f7f0]",
      muted: "text-[#a4c7b8]",
      pad: "py-5 sm:py-6 px-4 sm:px-6",
      ring: "shadow-[0_16px_38px_-26px_rgba(0,0,0,0.5)]",
    },
  },
  {
    key: "trusted",
    title: "Доверенный участник",
    subtitle: "Расширенный уровень доверия",
    support: "до 5 000 ₽",
    obtain: "Статус присваивается индивидуально",
    desc: "Этот статус получают участники, которым сообщество доверяет на постоянной основе.",
    icon: Star,
    tone: {
      bg: "bg-[#0f3d33]/90",
      border: "border-[#3b8a70]/70",
      iconBg: "bg-[#d3edde] text-[#124437]",
      title: "text-[#f1fdf6]",
      muted: "text-[#adcfc1]",
      pad: "py-6 sm:py-7 px-4 sm:px-7",
      ring: "shadow-[0_18px_44px_-24px_rgba(0,0,0,0.55)]",
    },
  },
];

export function TrustLevelsInfo() {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#fffffe]">
          Уровни доверия в Копилке
        </h2>
        <p className="text-sm text-[#94a1b2]">
          Сумма поддержки зависит от статуса участника
        </p>
        <p className="text-xs text-[#94a1b2]/90">
          Доверие не начисляется автоматически
        </p>
      </div>

      <div className="rounded-2xl border border-[#2c4f45]/50 bg-[#0b2a24]/70 backdrop-blur-sm p-4 sm:p-5 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.45)] space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-[#e2f0ea]">
          Как работает доверие в Копилке
        </h3>
        <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
          В Копилке нет автоматических выплат и гарантированных сумм. Поддержка — это решение сообщества, а не функция сайта.
        </p>
        <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
          Мы смотрим на каждую заявку отдельно. Уровень доверия показывает, на какую сумму поддержки вы в принципе можете рассчитывать, но он не гарантирует одобрение заявки.
        </p>
      </div>

      <div className="relative flex flex-col gap-4 sm:gap-5">
        {LEVELS.map((level, idx) => {
          const Icon = level.icon;
          const isLast = idx === LEVELS.length - 1;
          return (
            <div key={level.key} className="relative">
              {!isLast && (
                <div className="absolute left-8 sm:left-10 top-full h-6 sm:h-8 w-px bg-gradient-to-b from-[#9dc2b3]/75 via-[#6e8f83]/35 to-transparent pointer-events-none" />
              )}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * idx }}
                className={[
                  "relative rounded-2xl border backdrop-blur-md h-full",
                  level.tone.bg,
                  level.tone.border,
                  level.tone.pad,
                  level.tone.ring,
                ].join(" ")}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`${level.tone.iconBg} p-3.5 sm:p-4 rounded-full shadow-inner shrink-0`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.4} />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-lg sm:text-xl font-semibold ${level.tone.title}`}>
                      {level.title}
                    </p>
                    <p className={`text-xs sm:text-sm ${level.tone.muted}`}>
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-sm text-[#cfded6]">
                    Доступная поддержка:{" "}
                    <span className="font-semibold text-[#f0c878]">{level.support}</span>
                  </div>
                  <div className="text-sm text-[#b5c9c1]">
                    Как получить: {level.obtain}
                  </div>
                  <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
                    {level.desc}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
        Уровень доверия влияет только на доступную сумму поддержки. Каждая заявка рассматривается индивидуально и может быть отклонена.
      </p>
    </section>
  );
}

export default TrustLevelsInfo;

