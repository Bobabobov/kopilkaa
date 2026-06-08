import { describe, expect, it } from "vitest";
import {
  buildDailyBonusStatus,
  canClaimDailyBonus,
  computeNextStreakOnClaim,
  getEffectiveStreak,
  getMilestoneBonusForStreak,
  getStreakAfterClaim,
} from "@/lib/dailyBonus/streakLogic";

const emptyState = {
  currentStreak: 0,
  lastClaimDate: null as string | null,
  lastClaimAt: null as Date | null,
};

describe("dailyBonus streakLogic", () => {
  it("должно вернуть серию 0 когда пользователь ещё не забирал бонус", () => {
    expect(getEffectiveStreak(emptyState, "2026-06-08")).toBe(0);
  });

  it("должно увеличить серию на 1 при получении бонуса на следующий день", () => {
    const state = {
      currentStreak: 6,
      lastClaimDate: "2026-06-07",
      lastClaimAt: new Date("2026-06-07T12:00:00.000Z"),
    };

    expect(getEffectiveStreak(state, "2026-06-08")).toBe(6);
    expect(computeNextStreakOnClaim(state, "2026-06-08")).toBe(7);
    expect(getMilestoneBonusForStreak(7)).toBe(30);
  });

  it("должно сбросить серию на 0 при пропуске дня", () => {
    const state = {
      currentStreak: 5,
      lastClaimDate: "2026-06-05",
      lastClaimAt: new Date("2026-06-05T12:00:00.000Z"),
    };

    expect(getEffectiveStreak(state, "2026-06-08")).toBe(0);
    expect(computeNextStreakOnClaim(state, "2026-06-08")).toBe(1);
  });

  it("должно выдать награду за 30 дней и сбросить серию после цикла", () => {
    const state = {
      currentStreak: 29,
      lastClaimDate: "2026-06-07",
      lastClaimAt: new Date("2026-06-07T12:00:00.000Z"),
    };

    expect(computeNextStreakOnClaim(state, "2026-06-08")).toBe(30);
    expect(getMilestoneBonusForStreak(30)).toBe(100);
    expect(getStreakAfterClaim(30)).toBe(0);
  });

  it("должно запретить повторное получение бонуса в тот же день", () => {
    const state = {
      currentStreak: 3,
      lastClaimDate: "2026-06-08",
      lastClaimAt: new Date("2026-06-08T08:00:00.000Z"),
    };
    const nowMs = new Date("2026-06-08T20:00:00.000Z").getTime();

    expect(canClaimDailyBonus(state, "2026-06-08", nowMs)).toBe(false);
    expect(
      buildDailyBonusStatus(state, "2026-06-08", nowMs).claimedToday,
    ).toBe(true);
  });

  it("должно разрешить админу получать бонус повторно и наращивать серию", () => {
    const state = {
      currentStreak: 6,
      lastClaimDate: "2026-06-08",
      lastClaimAt: new Date("2026-06-08T10:00:00.000Z"),
    };
    const nowMs = new Date("2026-06-08T20:00:00.000Z").getTime();

    expect(canClaimDailyBonus(state, "2026-06-08", nowMs, true)).toBe(true);
    expect(computeNextStreakOnClaim(state, "2026-06-08", true)).toBe(7);
    expect(
      buildDailyBonusStatus(state, "2026-06-08", nowMs, true).isAdminTestMode,
    ).toBe(true);
  });

  it("должно запретить повторное получение бонуса раньше чем через 24 часа", () => {
    const state = {
      currentStreak: 1,
      lastClaimDate: "2026-06-07",
      lastClaimAt: new Date("2026-06-08T10:00:00.000Z"),
    };
    const nowMs = new Date("2026-06-08T20:00:00.000Z").getTime();

    expect(canClaimDailyBonus(state, "2026-06-08", nowMs)).toBe(false);
  });
});
