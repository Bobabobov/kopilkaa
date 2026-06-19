import { GRAVEYARD_HEIGHT_PX, GRAVEYARD_WIDTH_PX } from '@/lib/vyzhivanie/graveyard';

export function resolvePanCamera(
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  zoom = 1,
): { x: number; y: number } {
  const safeZoom = Math.max(0.1, zoom);
  const visibleW = viewW / safeZoom;
  const visibleH = viewH / safeZoom;
  const maxX = Math.max(0, GRAVEYARD_WIDTH_PX - visibleW);
  const maxY = Math.max(0, GRAVEYARD_HEIGHT_PX - visibleH);

  return {
    x: Math.min(maxX, Math.max(0, camX)),
    y: Math.min(maxY, Math.max(0, camY)),
  };
}
