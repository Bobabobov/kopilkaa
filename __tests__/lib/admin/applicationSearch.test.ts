import { describe, expect, it } from "vitest";
import {
  applicationMatchesClientSearch,
  buildApplicationTextSearchWhere,
  getSearchTermVariants,
  normalizeAdminApplicationSearchQuery,
  stripHtmlForSearch,
} from "@/lib/admin/applicationSearch";

describe("normalizeAdminApplicationSearchQuery", () => {
  it("должно убрать @ в начале ника", () => {
    expect(normalizeAdminApplicationSearchQuery("@ivan")).toBe("ivan");
  });
});

describe("getSearchTermVariants", () => {
  it("должно включать варианты регистра для кириллицы", () => {
    const variants = getSearchTermVariants("иван");
    expect(variants).toContain("иван");
    expect(variants).toContain("Иван");
    expect(variants).toContain("ИВАН");
  });
});

describe("stripHtmlForSearch", () => {
  it("должно убрать HTML-теги из истории", () => {
    expect(stripHtmlForSearch("<p>Нужна помощь</p>")).toBe("Нужна помощь");
  });
});

describe("applicationMatchesClientSearch", () => {
  const item = {
    title: "Помощь с лечением",
    summary: "Кратко",
    story: "<p>История про <strong>лечение</strong></p>",
    payment: "2202 2000 0000",
    adminComment: null,
    amount: 5000,
    user: {
      name: "Иван",
      username: "ivan_help",
      email: "ivan@mail.ru",
      telegramUsername: "ivan_tg",
    },
  };

  it("должно находить по заголовку без учёта регистра", () => {
    expect(applicationMatchesClientSearch(item, "лечением")).toBe(true);
    expect(applicationMatchesClientSearch(item, "ЛЕЧЕНИЕМ")).toBe(true);
  });

  it("должно находить по нику и email", () => {
    expect(applicationMatchesClientSearch(item, "ivan_help")).toBe(true);
    expect(applicationMatchesClientSearch(item, "ivan@mail")).toBe(true);
  });

  it("должно находить по тексту истории без HTML", () => {
    expect(applicationMatchesClientSearch(item, "лечение")).toBe(true);
  });

  it("должно скрывать нерелевантные заявки", () => {
    expect(applicationMatchesClientSearch(item, "ремонт крыши")).toBe(false);
  });
});

describe("buildApplicationTextSearchWhere", () => {
  it("должно искать по имени и username пользователя", () => {
    const where = buildApplicationTextSearchWhere("petrov");
    expect(where).toMatchObject({
      OR: expect.arrayContaining([
        { user: { name: { contains: "petrov" } } },
        { user: { username: { contains: "petrov" } } },
      ]),
    });
  });

  it("должно требовать все слова при многословном запросе", () => {
    const where = buildApplicationTextSearchWhere("иван лечение");
    expect(where).toHaveProperty("AND");
    expect((where as { AND: unknown[] }).AND).toHaveLength(2);
  });
});
