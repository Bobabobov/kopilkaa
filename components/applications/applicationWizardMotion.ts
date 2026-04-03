"use client";

import type { Variants } from "framer-motion";

/** Контейнер шага: поочерёдное появление полей */
export const wizardStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.05,
    },
  },
};

export const wizardStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 30,
    },
  },
};

export const cardEntranceSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 26,
  mass: 0.85,
};
