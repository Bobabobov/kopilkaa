// Система спавна монет — только внутри видимой игровой области

import type { Coin, GameConfig } from "../../_types";

/** Максимум монет на экране: desktop 14, mobile 12 (чтобы не было завала и мисскликов) */
export const MAX_COINS_ON_SCREEN_DESKTOP = 14;
export const MAX_COINS_ON_SCREEN_MOBILE = 18;

export function getMaxCoinsOnScreen(isMobile: boolean): number {
  return isMobile ? MAX_COINS_ON_SCREEN_MOBILE : MAX_COINS_ON_SCREEN_DESKTOP;
}

export function spawnCoin(
  id: string,
  width: number,
  height: number,
  config: GameConfig,
  isMobile: boolean,
): Coin {
  const minSide = Math.min(width, height);
  const radiusBase = minSide * 0.065;
  const radius = Math.max(22, Math.min(isMobile ? 58 : 50, radiusBase));

  // Безопасная зона: монеты только внутри области обзора, с отступом от краёв
  const marginX = Math.max(radius + 20, width * 0.05);
  const marginY = Math.max(radius + 20, height * 0.06);
  const left = marginX;
  const top = marginY;
  const safeW = Math.max(0, width - marginX * 2);
  const safeH = Math.max(0, height - marginY * 2);

  const x = left + (safeW > 0 ? Math.random() * safeW : 0);
  const y = top + (safeH > 0 ? Math.random() * safeH : 0);

  return {
    id,
    x,
    y,
    radius,
    collected: false,
    spawnedAt: Date.now(),
  };
}
