import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#34d399', '#f472b6', '#fbbf24', '#fffffe'];

export function celebrateQuickBalanceWin(reward: number): void {
  void confetti({
    particleCount: reward >= 45 ? 55 : 40,
    spread: 75,
    startVelocity: 38,
    origin: { x: 0.5, y: 0.4 },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    ticks: 200,
    gravity: 0.88,
    scalar: 0.92,
  });
}
