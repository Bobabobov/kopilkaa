import { describe, expect, it } from 'vitest';
import {
  GRAVEYARD_HEIGHT_PX,
  GRAVEYARD_WIDTH_PX,
} from '@/lib/vyzhivanie/graveyard';
import { resolvePanCamera } from '@/lib/vyzhivanie/camera';

describe('resolvePanCamera', () => {
  it('должно сохранять положение камеры внутри карты', () => {
    const viewW = 900;
    const viewH = 600;
    const cam = resolvePanCamera(1500, 1000, viewW, viewH);

    expect(cam.x).toBe(1500);
    expect(cam.y).toBe(1000);
  });

  it('должно не выходить за границы кладбища', () => {
    const cam = resolvePanCamera(-50, 9999, 900, 600);

    expect(cam.x).toBeGreaterThanOrEqual(0);
    expect(cam.y).toBeGreaterThanOrEqual(0);
    expect(cam.x).toBeLessThanOrEqual(Math.max(0, GRAVEYARD_WIDTH_PX - 900));
    expect(cam.y).toBeLessThanOrEqual(Math.max(0, GRAVEYARD_HEIGHT_PX - 600));
  });

  it('должно оставлять пространство для прокрутки', () => {
    expect(GRAVEYARD_WIDTH_PX).toBeGreaterThan(2000);
    expect(GRAVEYARD_HEIGHT_PX).toBeGreaterThan(1500);
  });
});
