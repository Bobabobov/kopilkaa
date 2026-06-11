"use client";

import { useEffect, useState } from "react";
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

const TRUST_INTRO_STEPS = [
  StepWelcome,
  StepRestrictions,
  StepAllowed,
  StepReports,
] as const;

export function TrustIntroStepPanel({ step, checked, onCheckedChange }: Props) {
  const reducedMotion = useReducedMotion();
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();

    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const renderStepContent = (stepIndex: number) => {
    const StepComponent = TRUST_INTRO_STEPS[stepIndex];

    if (StepComponent) {
      return <StepComponent />;
    }

    return (
      <StepAcknowledge checked={checked} onCheckedChange={onCheckedChange} />
    );
  };

  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5">
      {isMobileViewport ? (
        <div className="space-y-4">{renderStepContent(step)}</div>
      ) : (
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reducedMotion ? { opacity: 0 } : trustIntroStepInitial}
              animate={reducedMotion ? { opacity: 1 } : trustIntroStepAnimate}
              exit={reducedMotion ? { opacity: 0 } : trustIntroStepExit}
              transition={
                reducedMotion
                  ? trustIntroStepTransitionReduced
                  : trustIntroStepTransition
              }
              className="space-y-4"
            >
              {renderStepContent(step)}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
