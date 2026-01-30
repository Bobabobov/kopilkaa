// Система адаптивного масштабирования

import type { GameConfig } from "../../_types";

export interface Viewport {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export function calculateViewport(
  containerWidth: number,
  containerHeight: number,
  config: GameConfig,
): Viewport {
  const scaleX = containerWidth / config.designWidth;
  const scaleY = containerHeight / config.designHeight;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = config.designWidth * scale;
  const scaledHeight = config.designHeight * scale;

  const offsetX = (containerWidth - scaledWidth) / 2;
  const offsetY = (containerHeight - scaledHeight) / 2;

  return {
    width: scaledWidth,
    height: scaledHeight,
    scale,
    offsetX,
    offsetY,
  };
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/** Видимая область экрана (учитывает visualViewport на мобильных), с фолбэками и защитой от нулевых размеров */
export function getVisibleViewport(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 1280, height: 720 };
  }
  let width: number;
  let height: number;
  const vv = window.visualViewport;
  if (vv) {
    width = vv.width;
    height = vv.height;
    if (
      width < 1 ||
      height < 1 ||
      Number.isNaN(width) ||
      Number.isNaN(height)
    ) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
  } else {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  return {
    width: Math.max(320, Math.floor(width)),
    height: Math.max(320, Math.floor(height)),
  };
}
