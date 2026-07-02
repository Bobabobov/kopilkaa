'use client';

import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BonusGeneratorAnimatedRewardProps {
  value: number;
  className?: string;
}

export function BonusGeneratorAnimatedReward({
  value,
  className,
}: BonusGeneratorAnimatedRewardProps) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setDisplay(0);
      return;
    }

    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (next) => setDisplay(Math.round(next)),
    });

    return () => controls.stop();
  }, [value, reducedMotion]);

  if (value <= 0) {
    return <span className={className}>0</span>;
  }

  return (
    <span className={className}>
      +{display}
    </span>
  );
}
