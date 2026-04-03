"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  trustIntroStaggerContainer,
  trustIntroStaggerItem,
  trustIntroStaggerItemReduced,
} from "./stepMotion";

type Props = {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
};

export function StepAcknowledge({ checked, onCheckedChange }: Props) {
  const reducedMotion = useReducedMotion();
  const item = reducedMotion ? trustIntroStaggerItemReduced : trustIntroStaggerItem;

  return (
    <motion.div
      className="space-y-4"
      variants={trustIntroStaggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.p
        variants={item}
        className="text-sm leading-relaxed text-[#abd1c6]"
      >
        Вы просмотрели все условия. Если ваша ситуация подходит под правила
        Копилки, отметьте согласие — откроется форма заявки.
      </motion.p>
      <motion.div
        variants={item}
        className={cn(
          "rounded-xl p-3 sm:p-4 transition-colors border border-white/10",
          checked ? "bg-emerald-500/15 border-[#f9bc60]/30" : "bg-white/4",
        )}
      >
        <label className="flex cursor-pointer items-start gap-3 select-none">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#2c4f45] bg-[#0b2a24] text-[#f9bc60] accent-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/50 focus:ring-offset-0 focus:ring-offset-transparent"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
          />
          <span className="text-sm text-[#e6f1ec] leading-relaxed">
            Я понимаю условия и подаю подходящую заявку
          </span>
        </label>
      </motion.div>
    </motion.div>
  );
}
