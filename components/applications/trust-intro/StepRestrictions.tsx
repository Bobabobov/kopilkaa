"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  trustIntroStaggerContainer,
  trustIntroStaggerItem,
  trustIntroStaggerItemReduced,
} from "./stepMotion";

export function StepRestrictions() {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? trustIntroStaggerItemReduced : trustIntroStaggerItem;

  return (
    <motion.section
      className="space-y-2.5 rounded-2xl border border-[#e16162]/25 bg-[#e16162]/[0.07] p-4 sm:p-5 relative overflow-hidden"
      aria-label="Ограничения Копилки"
      variants={trustIntroStaggerContainer}
      initial="hidden"
      animate="show"
    >
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#e16162]/70" />
      <motion.div
        className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#e16162]/22 blur-3xl pointer-events-none"
        aria-hidden
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }
        }
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div variants={item} className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1c4037]/60 text-[#f9bc60]">
          <LucideIcons.XCircle size="xs" />
        </span>
        <span className="text-sm sm:text-base font-semibold text-[#d9e6e0]">
          Мы не помогаем с:
        </span>
        <span className="inline-flex items-center rounded-full border border-[#e16162]/30 bg-[#e16162]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#e16162]">
          Нельзя
        </span>
      </motion.div>

      <motion.ul
        variants={item}
        className="space-y-2.5 text-sm text-[#dbe7e2] leading-snug pl-0.5"
      >
        <li className="space-y-1">
          <div className="font-semibold text-[#ffe0dd] flex flex-wrap items-center gap-2">
            <span className="inline-flex px-1.5 py-0.5 rounded-full bg-[#e16162]/20 text-[10px] font-bold text-[#ffc9c2]">
              ВАЖНО
            </span>
            Кредиты и займы
          </div>
          <p className="text-xs text-[#9fb2ab] pl-0.5">
            Банковские кредиты, рассрочки, потребительские займы и похожие
            обязательства —{" "}
            <span className="font-semibold text-[#ffe0dd]">
              никогда не одобряются через Копилку
            </span>
            .
          </p>
        </li>

        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#e3f0ea]">
            • МФО и займы «до зарплаты»
          </div>
          <p className="text-xs text-[#9fb2ab]">
            Онлайн-займы и быстрые деньги.
          </p>
        </li>

        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#e3f0ea]">
            • Долги, просрочки, коллекторы
          </div>
          <p className="text-xs text-[#9fb2ab]">Штрафы, пени и коллекторы.</p>
        </li>

        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#e3f0ea]">
            • Лечение и лекарства
          </div>
          <p className="text-xs text-[#9fb2ab]">
            Лечение, обследования и препараты.
          </p>
        </li>

        <li className="space-y-1 pl-0.5">
          <div className="font-semibold text-[#e3f0ea]">
            • Медицинские сборы
          </div>
          <p className="text-xs text-[#9fb2ab]">
            Реабилитация, анализы, платные процедуры.
          </p>
        </li>

        <li className="space-y-1">
          <div className="font-semibold text-[#ffe0dd] flex flex-wrap items-center gap-2">
            <span className="inline-flex px-1.5 py-0.5 rounded-full bg-[#e16162]/20 text-[10px] font-bold text-[#ffc9c2]">
              ВАЖНО
            </span>
            Дробление одной цели на множество заявок
          </div>
          <p className="text-xs text-[#9fb2ab] pl-0.5">
            <span className="font-semibold text-[#ffe0dd]">
              Одна цель — одна заявка.
            </span>{" "}
            Нельзя разбивать одну покупку на серию похожих заявок.
          </p>
        </li>
      </motion.ul>

      <motion.p
        variants={item}
        className="text-[11px] text-[#9fb2ab] pt-1 border-t border-[#e16162]/15"
      >
        Если сомневаетесь, подходит ли ваша ситуация — лучше сначала уточните у
        поддержки.
      </motion.p>
    </motion.section>
  );
}
