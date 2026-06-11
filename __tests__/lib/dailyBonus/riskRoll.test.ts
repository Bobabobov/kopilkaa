import { describe, expect, it } from "vitest";
import { isDailyBonusRiskWin } from "@/lib/dailyBonus/riskRoll";

describe("isDailyBonusRiskWin", () => {
  it("должно вернуть true когда выпало 0", () => {
    expect(isDailyBonusRiskWin(0, 1000)).toBe(true);
  });

  it("должно вернуть false когда выпало не 0", () => {
    expect(isDailyBonusRiskWin(42, 1000)).toBe(false);
  });
});
