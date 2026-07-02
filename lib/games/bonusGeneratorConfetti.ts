import confetti from 'canvas-confetti';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';

const BRAND_COLORS = ['#f9bc60', '#abd1c6', '#fffffe', '#004643'];

function burst(
  particleCount: number,
  spread: number,
  startVelocity: number,
  originY = 0.45,
) {
  void confetti({
    particleCount,
    spread,
    startVelocity,
    origin: { x: 0.5, y: originY },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    ticks: 220,
    gravity: 0.9,
    scalar: 0.95,
  });
}

/** Визуальная реакция на исход синтеза — интенсивность зависит от награды */
export function celebrateBonusGeneratorResult(
  result: BonusGeneratorRunResult,
): void {
  if (result.reward <= 0) {
    return;
  }

  if (result.isMegaBonus) {
    burst(130, 105, 58);
    window.setTimeout(() => burst(90, 75, 48, 0.5), 200);
    window.setTimeout(() => {
      void confetti({
        particleCount: 55,
        angle: 62,
        spread: 58,
        origin: { x: 0.08, y: 0.62 },
        colors: BRAND_COLORS,
        disableForReducedMotion: true,
      });
      void confetti({
        particleCount: 55,
        angle: 118,
        spread: 58,
        origin: { x: 0.92, y: 0.62 },
        colors: BRAND_COLORS,
        disableForReducedMotion: true,
      });
    }, 380);
    return;
  }

  if (result.label === 'super' || result.label === 'boost') {
    burst(75, 82, 42);
    return;
  }

  burst(38, 64, 30);
}

/** Короткая вспышка при старте синтеза */
export function celebrateGeneratorLaunch(): void {
  void confetti({
    particleCount: 14,
    spread: 48,
    startVelocity: 22,
    origin: { x: 0.5, y: 0.58 },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    ticks: 90,
    gravity: 0.75,
    scalar: 0.65,
  });
}
