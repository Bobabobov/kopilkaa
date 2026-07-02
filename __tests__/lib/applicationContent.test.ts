import { describe, expect, it } from "vitest";

import {
  applicationPlainTextContainsLink,
  applicationStoryHtmlContainsLink,
  findApplicationFieldWithLink,
  getApplicationNoLinksError,
} from "@/lib/applications/validateContent";
import { textContainsLink } from "@/lib/text/noLinks";

describe("textContainsLink", () => {
  it("должно обнаружить https-ссылку", () => {
    expect(textContainsLink("Смотри https://example.com/page")).toBe(true);
  });

  it("должно обнаружить домен без схемы", () => {
    expect(textContainsLink("Пишите на example.ru")).toBe(true);
  });

  it("должно пропустить обычный текст без ссылок", () => {
    expect(textContainsLink("Помощь с арендой после переезда")).toBe(false);
  });
});

describe("applicationStoryHtmlContainsLink", () => {
  it("должно обнаружить ссылку в plain-text внутри HTML истории", () => {
    expect(
      applicationStoryHtmlContainsLink(
        "<p>Напишите мне на t.me/spam и помогите</p>",
      ),
    ).toBe(true);
  });

  it("должно пропустить историю без ссылок", () => {
    expect(
      applicationStoryHtmlContainsLink(
        "<p>Мне нужна помощь с оплатой аренды после сложной ситуации в семье.</p>",
      ),
    ).toBe(false);
  });
});

describe("findApplicationFieldWithLink", () => {
  it("должно вернуть title когда ссылка в заголовке", () => {
    expect(
      findApplicationFieldWithLink({
        title: "Помощь https://evil.test",
        summary: "Кратко",
        storyHtml: "<p>История без ссылок, достаточно длинная для заявки.</p>",
      }),
    ).toBe("title");
  });

  it("должно вернуть payment когда ссылка в реквизитах", () => {
    expect(
      findApplicationFieldWithLink({
        title: "Помощь с арендой",
        summary: "Краткое описание ситуации",
        storyHtml: "<p>История без ссылок, достаточно длинная для заявки.</p>",
        payment: "Банк: Сбер\nhttps://evil.test/pay",
      }),
    ).toBe("payment");
  });

  it("должно вернуть bankName когда ссылка в названии банка", () => {
    expect(
      findApplicationFieldWithLink({
        title: "Помощь с арендой",
        summary: "Краткое описание ситуации",
        storyHtml: "<p>История без ссылок, достаточно длинная для заявки.</p>",
        bankName: "t.me/bank",
      }),
    ).toBe("bankName");
  });

  it("должно вернуть null когда ссылок нет", () => {
    expect(
      findApplicationFieldWithLink({
        title: "Помощь с арендой",
        summary: "Краткое описание ситуации",
        storyHtml: "<p>История без ссылок, достаточно длинная для заявки.</p>",
      }),
    ).toBeNull();
  });
});

describe("getApplicationNoLinksError", () => {
  it("должно вернуть понятное сообщение для заголовка", () => {
    expect(getApplicationNoLinksError("title")).toContain("заголовке");
  });

  it("должно вернуть понятное сообщение для банка и реквизитов", () => {
    expect(getApplicationNoLinksError("bankName")).toContain("банка");
    expect(getApplicationNoLinksError("payment")).toContain("реквизитах");
  });
});

describe("applicationPlainTextContainsLink", () => {
  it("должно обнаружить www в кратком описании", () => {
    expect(applicationPlainTextContainsLink("Сайт www.shop.test")).toBe(true);
  });
});
