export type GameStageSize = {
  width: number;
  height: number;
  compact: boolean;
  minimapSize: number;
};

const GAME_MIN_WIDTH = 280;
const GAME_MIN_HEIGHT = 200;

/**
 * Полноэкранный stage: заполняет весь доступный контейнер (100dvh × 100%).
 */
export function computeFullscreenStageSize(
  parentWidth: number,
  parentHeight: number,
): GameStageSize {
  const width = Math.max(GAME_MIN_WIDTH, Math.round(parentWidth));
  const height = Math.max(GAME_MIN_HEIGHT, Math.round(parentHeight));
  const compact = width < 560 || height < 420;
  const minimapSize = compact ? 56 : width < 900 ? 72 : 88;

  return {
    width,
    height,
    compact,
    minimapSize,
  };
}

export function prefersCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}
