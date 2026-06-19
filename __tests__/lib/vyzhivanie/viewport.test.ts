import { describe, expect, it } from 'vitest';
import { computeFullscreenStageSize } from '@/lib/vyzhivanie/viewport';

describe('computeFullscreenStageSize', () => {
  it('должно заполнять весь контейнер на десктопе', () => {
    const result = computeFullscreenStageSize(1600, 900);
    expect(result.width).toBe(1600);
    expect(result.height).toBe(900);
    expect(result.compact).toBe(false);
  });

  it('должно помечать узкий телефон как compact', () => {
    const result = computeFullscreenStageSize(320, 700);
    expect(result.width).toBe(320);
    expect(result.height).toBe(700);
    expect(result.compact).toBe(true);
  });

  it('должно соблюдать минимальные размеры', () => {
    const result = computeFullscreenStageSize(100, 80);
    expect(result.width).toBeGreaterThanOrEqual(280);
    expect(result.height).toBeGreaterThanOrEqual(200);
  });

  it('должно уменьшать миникарту на compact', () => {
    const desktop = computeFullscreenStageSize(1200, 800);
    const phone = computeFullscreenStageSize(360, 640);
    expect(phone.minimapSize).toBeLessThan(desktop.minimapSize);
  });
});
