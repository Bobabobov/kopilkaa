"use client";

import { motion } from "framer-motion";

const defaultTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  /** Класс для контейнера */
  className?: string;
  /** Смещение по Y при появлении (px) */
  yOffset?: number;
  /** Задержка перед анимацией (сек) */
  delay?: number;
  /** Длительность анимации (сек) */
  duration?: number;
  /** Отступ viewport — когда считать секцию «в видимости» (px или "number%") */
  viewportMargin?: string;
}

/**
 * Обёртка для секции: плавное появление (fade + slide up) при скролле.
 */
export function AnimatedSection({
  children,
  className = "",
  yOffset = 32,
  delay = 0,
  duration = 0.6,
  viewportMargin = "-60px",
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        ...defaultTransition,
        duration,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
