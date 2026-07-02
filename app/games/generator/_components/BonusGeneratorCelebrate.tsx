'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';
import { celebrateBonusGeneratorResult } from '@/lib/games/bonusGeneratorConfetti';

interface BonusGeneratorCelebrateProps {
  result: BonusGeneratorRunResult | null;
  celebrateKey: number;
}

export function BonusGeneratorCelebrate({
  result,
  celebrateKey,
}: BonusGeneratorCelebrateProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!result || celebrateKey <= 0 || reducedMotion) {
      return;
    }

    celebrateBonusGeneratorResult(result);
  }, [result, celebrateKey, reducedMotion]);

  return null;
}
