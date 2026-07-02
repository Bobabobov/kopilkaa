import confetti from 'canvas-confetti';
import type { ColorConflictAnswerResult } from '@/lib/games/colorConflict';

const BRAND_COLORS = ['#f9bc60', '#34d399', '#a78bfa', '#fffffe'];

export function celebrateColorConflictWin(reward: number): void {
  const bursts = reward >= 55 ? 3 : reward >= 25 ? 2 : 1;

  for (let index = 0; index < bursts; index += 1) {
    window.setTimeout(() => {
      void confetti({
        particleCount: reward >= 55 ? 70 : 45,
        spread: 72,
        startVelocity: 38,
        origin: { x: 0.5, y: 0.42 + index * 0.04 },
        colors: BRAND_COLORS,
        disableForReducedMotion: true,
        ticks: 200,
        gravity: 0.85,
        scalar: 0.9,
      });
    }, index * 180);
  }
}
