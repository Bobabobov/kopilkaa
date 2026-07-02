import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#f9bc60', '#34d399', '#60a5fa', '#fffffe'];

export function celebrateMathSprintWin(reward: number): void {
  const bursts = reward >= 55 ? 3 : reward >= 25 ? 2 : 1;

  for (let index = 0; index < bursts; index += 1) {
    window.setTimeout(() => {
      void confetti({
        particleCount: reward >= 55 ? 65 : 40,
        spread: 70,
        startVelocity: 36,
        origin: { x: 0.5, y: 0.4 + index * 0.05 },
        colors: BRAND_COLORS,
        disableForReducedMotion: true,
        ticks: 190,
        gravity: 0.9,
        scalar: 0.88,
      });
    }, index * 160);
  }
}
