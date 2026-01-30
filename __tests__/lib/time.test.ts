import { describe, expect, it } from "vitest";
import { formatTimeAgo, formatRelativeDate } from "@/lib/time";

describe("formatTimeAgo", () => {
  it("returns 'только что' for very recent date", () => {
    const now = new Date();
    expect(formatTimeAgo(now)).toBe("только что");
  });

  it("returns minutes ago for date within last hour", () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - 5);
    expect(formatTimeAgo(d)).toMatch(/\d+ (минуту|минуты|минут) назад/);
  });

  it("accepts string date", () => {
    const s = new Date().toISOString();
    expect(formatTimeAgo(s)).toBe("только что");
  });
});

describe("formatRelativeDate", () => {
  it("returns 'Сегодня' for today", () => {
    expect(formatRelativeDate(new Date())).toBe("Сегодня");
  });

  it("returns 'Вчера' for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeDate(yesterday)).toBe("Вчера");
  });
});
