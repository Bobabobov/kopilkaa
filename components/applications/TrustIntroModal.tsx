"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRUST_INTRO_STEP_COUNT } from "./trust-intro/constants";
import { TrustIntroHeader } from "./trust-intro/TrustIntroHeader";
import { TrustIntroStepPanel } from "./trust-intro/TrustIntroStepPanel";
import { TrustIntroFooter } from "./trust-intro/TrustIntroFooter";

type Props = {
  open: boolean;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  onConfirm: () => void;
};

export function TrustIntroModal({
  open,
  checked,
  onCheckedChange,
  onConfirm,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const goNext = () =>
    setStep((s) => Math.min(TRUST_INTRO_STEP_COUNT - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const handleContinue = () => {
    if (!checked) return;
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        reducedMotion ? { duration: 0.15 } : { duration: 0.22, ease: "easeOut" }
      }
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-intro-title"
    >
      <div
        className="absolute inset-0 bg-[#001e1d]/85 backdrop-blur-md"
        aria-hidden
      />

      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 52 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0.18, ease: "easeOut" }
            : {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.88,
              }
        }
        className={cn(
          "relative flex w-full max-w-lg flex-col bg-gradient-to-b from-[#0d2e28] to-[#001e1d]",
          "border border-white/10 shadow-[0_-12px_48px_rgba(0,0,0,0.45)] sm:shadow-[0_24px_64px_rgba(0,0,0,0.55)]",
          "rounded-t-[24px] sm:rounded-[24px] max-h-[min(92dvh,900px)] sm:max-h-[min(88vh,860px)]",
        )}
      >
        <TrustIntroHeader step={step} />
        <TrustIntroStepPanel
          step={step}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <TrustIntroFooter
          step={step}
          checked={checked}
          onBack={goBack}
          onNext={goNext}
          onContinue={handleContinue}
        />
      </motion.div>
    </motion.div>
  );
}

export default TrustIntroModal;
