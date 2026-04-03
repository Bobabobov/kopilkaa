"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  trustIntroStepAnimate,
  trustIntroStepExit,
  trustIntroStepInitial,
  trustIntroStepTransition,
  trustIntroStepTransitionReduced,
} from "./stepMotion";
import { StepWelcome } from "./StepWelcome";
import { StepRestrictions } from "./StepRestrictions";
import { StepAllowed } from "./StepAllowed";
import { StepReports } from "./StepReports";
import { StepAcknowledge } from "./StepAcknowledge";

type Props = {
  step: number;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
};

export function TrustIntroStepPanel({ step, checked, onCheckedChange }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={
            reducedMotion ? { opacity: 0 } : trustIntroStepInitial
          }
          animate={reducedMotion ? { opacity: 1 } : trustIntroStepAnimate}
          exit={reducedMotion ? { opacity: 0 } : trustIntroStepExit}
          transition={
            reducedMotion ? trustIntroStepTransitionReduced : trustIntroStepTransition
          }
          className="space-y-4"
        >
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepRestrictions />}
          {step === 2 && <StepAllowed />}
          {step === 3 && <StepReports />}
          {step === 4 && (
            <StepAcknowledge
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
