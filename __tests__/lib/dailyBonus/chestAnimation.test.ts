import { describe, expect, it } from "vitest";
import {
  DAILY_CHEST_BLEND_START_RATIO,
  getChestOpenBlendFromProgress,
} from "@/lib/dailyBonus/chestAnimation";

describe("getChestOpenBlendFromProgress", () => {
  it("должно держать сундук закрытым до финальной фазы прогресса", () => {
    expect(getChestOpenBlendFromProgress(DAILY_CHEST_BLEND_START_RATIO)).toBe(0);
    expect(getChestOpenBlendFromProgress(0.5)).toBe(0);
  });

  it("должно полностью открыть сундук только при прогрессе 100%", () => {
    expect(getChestOpenBlendFromProgress(1)).toBe(1);
  });

  it("должно плавно открывать сундук в последней части прогресса", () => {
    const midOpenProgress =
      DAILY_CHEST_BLEND_START_RATIO +
      (1 - DAILY_CHEST_BLEND_START_RATIO) * 0.5;

    expect(getChestOpenBlendFromProgress(midOpenProgress)).toBeCloseTo(0.5, 5);
  });
});
