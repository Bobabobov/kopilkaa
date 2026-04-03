"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRUST_INTRO_STEP_COUNT } from "./constants";

type Props = {
  step: number;
  checked: boolean;
  onBack: () => void;
  onNext: () => void;
  onContinue: () => void;
};

export function TrustIntroFooter({
  step,
  checked,
  onBack,
  onNext,
  onContinue,
}: Props) {
  const reducedMotion = useReducedMotion();
  const atFirst = step === 0;
  const atLast = step === TRUST_INTRO_STEP_COUNT - 1;

  return (
    <div
      className={cn(
        "shrink-0 border-t border-white/10 bg-[#001e1d]/95 px-4 pt-3 backdrop-blur-md",
        "pb-[max(12px,env(safe-area-inset-bottom))] sm:rounded-b-[24px]",
      )}
    >
      {!atLast ? (
        <div className="flex gap-3">
          <motion.button
            type="button"
            onClick={onBack}
            disabled={atFirst}
            whileHover={
              atFirst || reducedMotion ? undefined : { scale: 1.02 }
            }
            whileTap={
              atFirst || reducedMotion ? undefined : { scale: 0.97 }
            }
            className={cn(
              "min-h-[48px] flex-1 rounded-xl border border-[#abd1c6]/30 py-3 text-sm font-semibold text-[#abd1c6] transition-opacity",
              atFirst
                ? "pointer-events-none opacity-35"
                : "",
            )}
          >
            Назад
          </motion.button>
          <motion.button
            type="button"
            onClick={onNext}
            whileHover={reducedMotion ? undefined : { scale: 1.03, y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            className="min-h-[48px] flex-[1.2] rounded-xl py-3 text-sm font-semibold text-[#001e1d] transition-opacity"
            style={{
              background:
                "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              boxShadow: "0 8px 24px rgba(249, 188, 96, 0.22)",
            }}
          >
            Далее
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-stretch">
          <motion.button
            type="button"
            disabled={!checked}
            onClick={onContinue}
            whileHover={
              !checked || reducedMotion ? undefined : { scale: 1.02, y: -1 }
            }
            whileTap={
              !checked || reducedMotion ? undefined : { scale: 0.98 }
            }
            className={cn(
              "min-h-[48px] w-full rounded-xl py-3.5 text-sm font-semibold transition-all sm:flex-1 sm:py-3",
              checked
                ? "text-[#001e1d]"
                : "cursor-not-allowed bg-white/10 text-[#6d7f78]",
            )}
            style={
              checked
                ? {
                    background:
                      "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                    boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                  }
                : undefined
            }
          >
            Понятно, продолжить
          </motion.button>
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={reducedMotion ? undefined : { scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            className="min-h-[48px] w-full rounded-xl border border-[#abd1c6]/30 py-3 text-sm font-semibold text-[#abd1c6] sm:w-auto sm:min-w-[120px]"
          >
            Назад
          </motion.button>
        </div>
      )}
    </div>
  );
}
