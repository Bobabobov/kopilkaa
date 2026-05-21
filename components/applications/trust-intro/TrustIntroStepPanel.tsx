"use client";

import { useCallback, useEffect, useState } from "react";
import AutoHeight from "embla-carousel-auto-height";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
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
  onStepChange: (step: number) => void;
};

const TRUST_INTRO_STEPS = [
  StepWelcome,
  StepRestrictions,
  StepAllowed,
  StepReports,
] as const;

export function TrustIntroStepPanel({
  step,
  checked,
  onCheckedChange,
  onStepChange,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
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

  const handleSelect = useCallback(
    (carouselApi: NonNullable<CarouselApi>) => {
      const selectedStep = carouselApi.selectedScrollSnap();
      if (selectedStep !== step) {
        onStepChange(selectedStep);
      }
    },
    [onStepChange, step],
  );

  useEffect(() => {
    if (!api || !isMobileViewport) return;

    if (api.selectedScrollSnap() !== step) {
      api.scrollTo(step);
    }
  }, [api, isMobileViewport, step]);

  useEffect(() => {
    if (!api || !isMobileViewport) return;

    handleSelect(api);
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api, handleSelect, isMobileViewport]);

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
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
      {isMobileViewport ? (
        <>
          <Carousel
            setApi={setApi}
            plugins={[AutoHeight()]}
            opts={{
              align: "start",
              containScroll: "trimSnaps",
              dragFree: false,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-0 items-start transition-[height] duration-200 ease-out [touch-action:pan-y]">
              {[0, 1, 2, 3, 4].map((stepIndex) => (
                <CarouselItem key={stepIndex} className="basis-full pl-0">
                  <div className="space-y-4">
                    {renderStepContent(stepIndex)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-2 flex justify-end">
            <Badge
              variant="muted"
              className="border border-white/10 bg-transparent px-2 py-0.5 text-[10px] font-medium text-[#94a1b2]/80"
            >
              <MoveHorizontal className="h-3 w-3 text-[#f9bc60]/70" />
              свайп
            </Badge>
          </div>
        </>
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
