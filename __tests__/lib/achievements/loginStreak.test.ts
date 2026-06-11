import { describe, expect, it } from "vitest";

import { computeLoginStreakOnVisit } from "@/lib/achievements/loginStreak";

describe("computeLoginStreakOnVisit", () => {
  it("должно начать серию с 1 при первом визите", () => {
    const result = computeLoginStreakOnVisit(
      { currentStreak: 0, lastVisitDate: null, maxStreak: 0 },
      "2026-06-11",
    );

    expect(result).toEqual({
      currentStreak: 1,
      maxStreak: 1,
      alreadyVisitedToday: false,
    });
  });

  it("должно не менять серию при повторном визите в тот же день", () => {
    const result = computeLoginStreakOnVisit(
      { currentStreak: 3, lastVisitDate: "2026-06-11", maxStreak: 5 },
      "2026-06-11",
    );

    expect(result).toEqual({
      currentStreak: 3,
      maxStreak: 5,
      alreadyVisitedToday: true,
    });
  });

  it("должно увеличить серию при визите на следующий день", () => {
    const result = computeLoginStreakOnVisit(
      { currentStreak: 4, lastVisitDate: "2026-06-10", maxStreak: 4 },
      "2026-06-11",
    );

    expect(result).toEqual({
      currentStreak: 5,
      maxStreak: 5,
      alreadyVisitedToday: false,
    });
  });

  it("должно сбросить серию при пропуске дня", () => {
    const result = computeLoginStreakOnVisit(
      { currentStreak: 6, lastVisitDate: "2026-06-08", maxStreak: 6 },
      "2026-06-11",
    );

    expect(result).toEqual({
      currentStreak: 1,
      maxStreak: 6,
      alreadyVisitedToday: false,
    });
  });
});
