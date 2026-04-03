"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  trustIntroStaggerContainer,
  trustIntroStaggerItem,
  trustIntroStaggerItemReduced,
} from "./stepMotion";

const flowSteps = [
  {
    title: "Заявка",
    text: "Кратко и честно опишите ситуацию и цель.",
    Icon: LucideIcons.FileText,
  },
  {
    title: "Решение",
    text: "Админ смотрит историю, отзыв и отчёты.",
    Icon: LucideIcons.Clock,
  },
  {
    title: "Отчёт",
    text: "После помощи — фото результата для следующих заявок.",
    Icon: LucideIcons.Image,
  },
] as const;

export function StepReports() {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? trustIntroStaggerItemReduced : trustIntroStaggerItem;

  return (
    <motion.section
      className="space-y-5"
      aria-label="Система отчётов"
      variants={trustIntroStaggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="space-y-2.5">
        <p className="text-[13px] leading-snug text-[#abd1c6]">
          <span className="font-semibold text-[#fffffe]">Правило 1.</span> После
          первой одобренной заявки один раз оставляете{" "}
          <span className="text-[#f9bc60] font-medium">отзыв с фото</span> — без
          этого следующую заявку не подать.
        </p>
        <p className="text-[13px] leading-snug text-[#abd1c6]">
          <span className="font-semibold text-[#fffffe]">Правило 2.</span> К
          каждой новой заявке — короткий{" "}
          <span className="text-[#f9bc60] font-medium">фото‑отчёт</span> по
          прошлой одобренной: чек, товар, переписка и т.п.
        </p>
      </motion.div>

      <motion.div
        variants={trustIntroStaggerContainer}
        className="rounded-2xl border border-white/[0.08] bg-[#004643]/35 px-3 py-4 sm:px-4"
      >
        <motion.p
          variants={item}
          className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#94a1b2]"
        >
          Обычный цикл
        </motion.p>
        <motion.ol
          variants={trustIntroStaggerContainer}
          className="relative m-0 list-none p-0"
        >
          {flowSteps.map(({ title, text, Icon }, i) => (
            <motion.li
              key={title}
              variants={item}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              {i < flowSteps.length - 1 && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-[#f9bc60]/45 to-[#abd1c6]/15"
                  aria-hidden
                />
              )}
              <motion.span
                className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f9bc60]/35 bg-[#001e1d]/80 text-[#f9bc60]"
                initial={reducedMotion ? false : { scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 24,
                }}
              >
                <Icon size="xs" />
              </motion.span>
              <div className="min-w-0 pt-0.5">
                <span className="block text-sm font-semibold text-[#fffffe]">
                  {title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-[#9fb2ab]">
                  {text}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    </motion.section>
  );
}
