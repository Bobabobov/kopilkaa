'use client';

import { useEffect, useRef } from 'react';
import {
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';

interface NumberTickerProps {
  value: number;
  className?: string;
  durationMs?: number;
}

export function NumberTicker({
  value,
  className,
  durationMs = 1000,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: durationMs / 1000,
    bounce: 0,
  });
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!isInView) return;
    motionValue.set(value);
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (!ref.current) return;
      ref.current.textContent = Math.round(latest).toLocaleString('ru-RU');
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className} aria-live='polite'>
      0
    </span>
  );
}
