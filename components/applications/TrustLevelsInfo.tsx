"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Crown,
  ShieldCheck,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";

const LEVELS = [
  {
    key: "level_1",
    title: "Уровень 1",
    subtitle: "Начальный уровень участия",
    support: "от 50 до 150 ₽",
    obtain: "Ориентир формируется по итогам первых подтверждённых заявок.",
    desc: "Вы только начинаете участие в Копилке. Это стартовый уровень доверия, с которого начинают все участники.",
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
    key: "level_2",
    title: "Уровень 2",
    subtitle: "Первые подтверждённые заявки",
    support: "от 50 до 300 ₽",
    obtain: "Уровень может пересматриваться по мере дальнейшего участия.",
    desc: "Участие в проекте уже подтверждено. Появляются первые основания для расширения ориентиров поддержки.",
    icon: BadgeCheck,
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
    key: "level_3",
    title: "Уровень 3",
    subtitle: "Стабильные одобрения",
    support: "от 100 до 700 ₽",
    obtain: "Ориентиры расширяются при подтверждённом участии.",
    desc: "Заявки проходят регулярно и без нарушений. Доверие к участию постепенно усиливается.",
    icon: ShieldCheck,
    tone: {
      bg: "bg-[#123f34]/85",
      border: "border-[#35745f]/65",
      iconBg: "bg-[#d8efe5] text-[#0f3a2f]",
      title: "text-[#e9f7f0]",
      muted: "text-[#a7cabb]",
      pad: "py-5 sm:py-6 px-4 sm:px-6",
      ring: "shadow-[0_16px_38px_-26px_rgba(0,0,0,0.5)]",
    },
  },
  {
    key: "level_4",
    title: "Уровень 4",
    subtitle: "Подтверждённый опыт",
    support: "от 100 до 1 500 ₽",
    obtain: "Уровень доверия может быть пересмотрен при изменении участия.",
    desc: "Опыт участия подтверждён на практике. Проект учитывает стабильность и качество заявок.",
    icon: TrendingUp,
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
  {
    key: "level_5",
    title: "Уровень 5",
    subtitle: "Высокий уровень доверия",
    support: "от 300 до 3 000 ₽",
    obtain: "Ориентиры поддержки находятся на высоком уровне.",
    desc: "Длительное и ответственное участие в проекте. Сообщество доверяет вам на постоянной основе.",
    icon: Star,
    tone: {
      bg: "bg-[#0d3f32]/90",
      border: "border-[#3f9479]/70",
      iconBg: "bg-[#cde9db] text-[#114437]",
      title: "text-[#f1fdf6]",
      muted: "text-[#a9d0c2]",
      pad: "py-6 sm:py-7 px-4 sm:px-7",
      ring: "shadow-[0_18px_44px_-24px_rgba(0,0,0,0.55)]",
    },
  },
  {
    key: "level_6",
    title: "Уровень 6",
    subtitle: "Максимальный уровень",
    support: "от 300 до 5 000 ₽",
    obtain:
      "Это верхний ориентир поддержки, не гарантирующий одобрение заявки.",
    desc: "Максимальный уровень доверия в проекте. Формируется при длительном и ответственном участии.",
    icon: Crown,
    tone: {
      bg: "bg-[#0c4536]/90",
      border: "border-[#48a488]/70",
      iconBg: "bg-[#c6e6d6] text-[#0f4537]",
      title: "text-[#f5fff8]",
      muted: "text-[#b4d7c8]",
      pad: "py-6 sm:py-7 px-4 sm:px-7",
      ring: "shadow-[0_20px_48px_-22px_rgba(0,0,0,0.6)]",
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
        <p className="text-sm text-[#cfded6] font-medium">
          Ориентиры по поддержке зависят от подтверждённого участия в проекте
        </p>
        <p className="text-xs text-[#9bb3ab]">
          Уровень доверия формируется автоматически и может пересматриваться.
        </p>
      </div>

      <div className="rounded-2xl border border-[#2c4f45]/50 bg-[#0b2a24]/70 backdrop-blur-sm p-4 sm:p-5 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.45)] space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-[#e2f0ea]">
          Как работает доверие в Копилке
        </h3>
        <p className="text-xs sm:text-sm text-[#cfded6] font-medium leading-relaxed">
          В Копилке нет{" "}
          <span className="text-[#f0c878]">автоматических выплат</span> и{" "}
          <span className="text-[#f0c878]">гарантированных сумм</span>.
        </p>
        <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
          <span className="text-[#cfded6] font-medium">Уровень доверия</span> —
          это <span className="text-[#f0c878]">ориентир</span> по возможной
          сумме поддержки. Он{" "}
          <span className="text-[#f0c878]">
            не означает обязательное одобрение
          </span>{" "}
          заявки и не даёт «права» на деньги.
        </p>
        <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
          Уровень формируется на основе{" "}
          <span className="text-[#f0c878]">подтверждённого участия</span> и
          качества заявок. В отдельных случаях команда может{" "}
          <span className="text-[#f0c878]">пересматривать уровень доверия</span>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {LEVELS.map((level, idx) => {
          const Icon = level.icon;
          return (
            <motion.div
              key={level.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.03 * idx }}
              className={[
                "relative rounded-2xl border backdrop-blur-md h-full",
                level.tone.bg,
                level.tone.border,
                level.tone.pad,
                level.tone.ring,
              ].join(" ")}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`${level.tone.iconBg} p-3.5 sm:p-4 rounded-full shadow-inner shrink-0`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.4} />
                </div>
                <div className="space-y-1">
                  <p
                    className={`text-lg sm:text-xl font-semibold ${level.tone.title}`}
                  >
                    {level.title}
                  </p>
                  <p className={`text-xs sm:text-sm ${level.tone.muted}`}>
                    {level.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#9bb3ab]">
                    Ориентир по поддержке
                  </span>
                  <span className="block text-base sm:text-lg font-semibold text-[#f0c878] whitespace-nowrap">
                    {level.support}
                  </span>
                </div>
                <div className="text-sm font-medium text-[#cfded6]">
                  {level.obtain}
                </div>
                <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
                  {level.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs sm:text-sm text-[#9bb3ab] leading-relaxed">
        Уровень доверия задаёт ориентир по сумме поддержки. Каждая заявка
        рассматривается индивидуально и может быть отклонена.
      </p>
    </section>
  );
}

export default TrustLevelsInfo;
