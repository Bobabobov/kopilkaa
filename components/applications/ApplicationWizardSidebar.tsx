"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcons } from "@/components/ui/LucideIcons";

type Props = {
  step: number;
  labels: readonly string[];
  onGoToStep?: (index: number) => void;
};

export function ApplicationWizardSidebar({ step, labels, onGoToStep }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <nav aria-label="Этапы заявки" className="select-none">
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a1b2]">
        Этапы
      </p>
      <ol className="m-0 list-none space-y-0 p-0">
        {labels.map((label, i) => {
          const done = i < step;
          const active = i === step;
          const future = i > step;
          const canGoBack = done && onGoToStep;
          const last = i === labels.length - 1;

          const circle = (
            <motion.span
              layout
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                active &&
                  "bg-[#f9bc60] text-[#001e1d] shadow-[0_0_0_3px_rgba(249,188,96,0.22)]",
                done &&
                  !active &&
                  "border border-[#f9bc60]/55 bg-[#f9bc60]/12 text-[#f9bc60]",
                future &&
                  "border border-white/12 bg-[#001e1d]/50 text-[#6d7f78]",
              )}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            >
              {done && !active ? (
                <motion.span
                  key="check"
                  initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="inline-flex"
                >
                  <LucideIcons.Check size="xs" className="text-[#f9bc60]" />
                </motion.span>
              ) : (
                <span className="tabular-nums">{i + 1}</span>
              )}
            </motion.span>
          );

          const text = (
            <div className="min-w-0 pb-5 pt-0.5">
              <span
                className={cn(
                  "block text-sm font-semibold leading-snug",
                  active && "text-[#fffffe]",
                  done &&
                    !active &&
                    "text-[#abd1c6] group-hover:text-[#fffffe]",
                  future && "text-[#6d7f78]",
                )}
              >
                {label}
              </span>
              {active && (
                <span className="mt-1 block text-[11px] text-[#94a1b2]">
                  Текущий шаг
                </span>
              )}
            </div>
          );

          const inner = (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                {circle}
                {!last && (
                  <motion.span
                    layout
                    className={cn(
                      "my-1 h-4 w-px shrink-0 origin-top",
                      i < step ? "bg-[#f9bc60]/35" : "bg-white/10",
                    )}
                    aria-hidden
                    initial={false}
                    animate={{
                      scaleY: i < step ? 1 : 0.85,
                      opacity: i < step ? 1 : 0.65,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
              {text}
            </div>
          );

          return (
            <li key={label}>
              {canGoBack ? (
                <motion.button
                  type="button"
                  onClick={() => onGoToStep?.(i)}
                  whileHover={reducedMotion ? undefined : { x: 4 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                  className="group w-full rounded-xl text-left transition-colors hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/40"
                >
                  {inner}
                </motion.button>
              ) : (
                <div
                  className={cn("rounded-xl", future && "opacity-85")}
                  aria-current={active ? "step" : undefined}
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs leading-relaxed text-[#6d7f78]">
        К завершённым этапам можно вернуться кликом.
      </p>
    </nav>
  );
}
