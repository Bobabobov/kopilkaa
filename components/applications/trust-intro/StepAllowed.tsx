"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  trustIntroStaggerContainer,
  trustIntroStaggerItem,
  trustIntroStaggerItemReduced,
} from "./stepMotion";

export function StepAllowed() {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? trustIntroStaggerItemReduced : trustIntroStaggerItem;

  return (
    <motion.section
      className="space-y-3.5 rounded-2xl border border-[#2f6f5a]/40 bg-[#14352f]/60 p-4 sm:p-5 relative overflow-hidden"
      aria-label="Что поддерживает Копилка"
      variants={trustIntroStaggerContainer}
      initial="hidden"
      animate="show"
    >
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#2f6f5a]/90" />
      <motion.div
        className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-[#f9bc60]/28 blur-3xl pointer-events-none"
        aria-hidden
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.45, 0.8, 0.45], scale: [1, 1.08, 1] }
        }
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-white/[0.03]" />

      <motion.div variants={item} className="space-y-2 relative">
        <div className="flex flex-wrap items-center gap-2 text-lg sm:text-xl font-semibold text-[#f6fcf9]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f6f5a]/70 text-[#f9bc60]">
            <LucideIcons.CheckCircle2 size="sm" />
          </span>
          Мы можем помочь с:
        </div>
        <div className="h-px w-16 bg-[#2c4f45]/40" />
      </motion.div>

      <motion.span
        variants={item}
        className="inline-flex items-center rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#f9bc60]"
      >
        Можно
      </motion.span>

      <motion.ul
        variants={item}
        className="space-y-2.5 text-sm text-[#f1fbf7] leading-snug relative"
      >
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">• Еда и напитки</div>
          <p className="text-xs text-[#c8d9d2]">
            Покупка продуктов, перекус, вода, чай, кофе.
          </p>
        </li>
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">
            • Небольшие бытовые расходы
          </div>
          <p className="text-xs text-[#c8d9d2]">
            Базовые вещи первой необходимости.
          </p>
        </li>
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">
            • Проезд, связь и мелкие расходы
          </div>
          <p className="text-xs text-[#c8d9d2]">
            Транспорт, связь, интернет и мелкие траты.
          </p>
        </li>
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">
            • Небольшой подарок
          </div>
          <p className="text-xs text-[#c8d9d2]">
            Небольшой подарок без крупных затрат.
          </p>
        </li>
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">
            • Донат в игру или сервис
          </div>
          <p className="text-xs text-[#c8d9d2]">
            Игры, подписки и небольшие цифровые покупки.
          </p>
        </li>
        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#f2faf6]">
            • Поддержка в обычной жизненной ситуации
          </div>
          <p className="text-xs text-[#c8d9d2]">
            Небольшая помощь без обязательств
          </p>
        </li>
      </motion.ul>
    </motion.section>
  );
}
