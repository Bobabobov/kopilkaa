import { describe, expect, it } from "vitest";
import { rollDailyChestAmount } from "@/lib/dailyChest/rollDailyChest";

describe("rollDailyChestAmount", () => {
  it("должно вернуть значение от 0 до 15 включительно", () => {
    expect(rollDailyChestAmount(() => 0)).toBe(0);
    expect(rollDailyChestAmount(() => 0.999999)).toBe(15);
    expect(rollDailyChestAmount(() => 0.5)).toBe(8);
  });
});
