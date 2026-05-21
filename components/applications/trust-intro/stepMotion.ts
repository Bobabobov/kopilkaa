"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, type Variants } from "framer-motion";

export function useTrustIntroReducedMotion(): boolean {
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

  return Boolean(reducedMotion || isMobileViewport);
}

/** Смена шагов: вертикальный сдвиг — естественнее для bottom sheet */
export const trustIntroStepTransition = {
  duration: 0.24,
  ease: "easeOut" as const,
};

export const trustIntroStepInitial = { opacity: 0, y: 18 };
export const trustIntroStepAnimate = { opacity: 1, y: 0 };
export const trustIntroStepExit = { opacity: 0, y: -12 };

export const trustIntroStepTransitionReduced = { duration: 0.14 };

/** Stagger внутри экрана шага */
export const trustIntroStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const trustIntroStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 30 },
  },
};

export const trustIntroStaggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } },
};
