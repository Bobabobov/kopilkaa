"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

type Props = {
  value: number;
  className?: string;
};

const formatBonuses = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

export function DailyChestRewardCounter({ value, className }: Props) {
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });

    return controls.stop;
  }, [motionValue, reducedMotion, value]);

  if (reducedMotion) {
    return <span className={className}>+{formatBonuses(value)}</span>;
  }

  return (
    <span className={className}>
      +
      <motion.span>{rounded}</motion.span>
    </span>
  );
}
