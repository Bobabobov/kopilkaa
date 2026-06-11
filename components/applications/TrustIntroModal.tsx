"use client";

import { useEffect, useState } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
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
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const goNext = () =>
    setStep((s) => Math.min(TRUST_INTRO_STEP_COUNT - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const handleContinue = () => {
    if (!checked) return;
    onConfirm();
  };

  return (
    <GlassModal
      open={open}
      onClose={() => {}}
      size="lg"
      zIndex={60}
      align="end"
      maxHeight="min(92dvh, 900px)"
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={false}
      bodyClassName="flex flex-col overflow-hidden p-0"
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
    </GlassModal>
  );
}

export default TrustIntroModal;
