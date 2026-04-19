"use client";

import type { Variants } from "framer-motion";

/**
 * Контейнер шага: только stagger по дочерним motion — без opacity на родителе,
 * иначе при переключении шагов весь блок мог оставаться с opacity 0 (редкий баг с FM + wait).
 */
export const wizardStaggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.05,
    },
  },
};

/** Без opacity:0 в hidden — при не-motion обёртках между родителем и полем FM иногда не доанимировал «show», форма оставалась невидимой */
export const wizardStaggerItem: Variants = {
  hidden: { opacity: 1, y: 10 },
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
