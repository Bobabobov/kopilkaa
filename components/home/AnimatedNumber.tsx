"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Оптимизированный компонент анимированного числа
 * Анимация запускается только при попадании в viewport и только один раз
 */
export default function AnimatedNumber({ value, prefix = "", suffix = "" }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: "easeOut",
      });

      return controls.stop;
    }
  }, [isInView, motionValue, value]);

  // Если элемент не в viewport и анимация не запущена, показываем статичное значение
  if (!isInView && !hasAnimated.current) {
    return (
      <span ref={ref}>
        {prefix}
        <span>{value}</span>
        {suffix}
      </span>
    );
  }

  return (
    <motion.span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

