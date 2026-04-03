"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  trustIntroStaggerContainer,
  trustIntroStaggerItem,
  trustIntroStaggerItemReduced,
} from "./stepMotion";

const chips = [
  {
    Icon: LucideIcons.Shield,
    iconClass: "text-[#abd1c6]",
    text: "Без долгов и кредитов",
  },
  {
    Icon: LucideIcons.Heart,
    iconClass: "text-[#e16162]",
    text: "Без медицины и лечения",
  },
  {
    Icon: LucideIcons.Home,
    iconClass: "text-[#f9bc60]",
    text: "Бытовая помощь",
  },
] as const;

export function StepWelcome() {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? trustIntroStaggerItemReduced : trustIntroStaggerItem;

  return (
    <motion.div
      className="space-y-4"
      variants={trustIntroStaggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#f9bc60]"
      >
        <motion.span
          className="inline-flex"
          animate={
            reducedMotion
              ? undefined
              : { rotate: [0, -8, 8, 0] }
          }
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatDelay: 4,
          }}
        >
          <LucideIcons.AlertTriangle size="xs" />
        </motion.span>
        Важно перед подачей заявки
      </motion.div>
      <motion.h2
        variants={item}
        className="text-xl font-semibold leading-tight text-[#fffffe] sm:text-2xl"
      >
        Копилка помогает не во всех ситуациях
      </motion.h2>
      <motion.p
        variants={item}
        className="text-sm leading-relaxed text-[#e5f2ee] sm:text-base"
      >
        Мы заранее обозначаем границы проекта, чтобы избежать недопонимания.
        Ниже — несколько шагов со всеми деталями: пролистайте до конца и
        подтвердите, что условия понятны.
      </motion.p>
      <motion.div
        variants={trustIntroStaggerContainer}
        className="flex flex-wrap gap-2 pt-1"
      >
        {chips.map(({ Icon, iconClass, text }) => (
          <motion.span
            key={text}
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#e6f1ec]"
            whileHover={reducedMotion ? undefined : { scale: 1.03, y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            <Icon size="xs" className={iconClass} />
            {text}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
