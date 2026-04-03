"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRUST_INTRO_STEP_COUNT, TRUST_INTRO_STEP_TITLES } from "./constants";

type Props = {
  step: number;
};

export function TrustIntroHeader({ step }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden"
        aria-hidden
        initial={reducedMotion ? false : { opacity: 0.5, scaleX: 0.75 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-2 sm:px-5 sm:pt-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a1b2]">
            Шаг {step + 1} из {TRUST_INTRO_STEP_COUNT}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={step}
              id="trust-intro-title"
              initial={
                reducedMotion ? false : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-sm font-semibold text-[#fffffe] sm:text-base line-clamp-2"
            >
              {TRUST_INTRO_STEP_TITLES[step]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div
          className="flex shrink-0 gap-1.5"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TRUST_INTRO_STEP_COUNT}
          aria-label="Прогресс"
        >
          {Array.from({ length: TRUST_INTRO_STEP_COUNT }).map((_, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <motion.span
                key={i}
                layout
                className={cn(
                  "rounded-full",
                  done || active ? "bg-[#f9bc60]" : "bg-white/15",
                  active ? "h-2 w-2" : "h-1.5 w-1.5",
                )}
                initial={false}
                animate={
                  reducedMotion
                    ? {}
                    : active
                      ? { scale: [1, 1.35, 1] }
                      : { scale: 1 }
                }
                transition={
                  active && !reducedMotion
                    ? { type: "spring", stiffness: 500, damping: 22 }
                    : { duration: 0.2 }
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
