import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#38bdf8', '#34d399', '#a78bfa', '#fffffe'];

export function celebrateOddNumberWin(reward: number): void {
  void confetti({
    particleCount: reward >= 25 ? 50 : 35,
    spread: 72,
    startVelocity: 34,
    origin: { x: 0.5, y: 0.42 },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    ticks: 180,
    gravity: 0.9,
    scalar: 0.9,
  });
}
