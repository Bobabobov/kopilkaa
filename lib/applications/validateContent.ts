import sanitizeHtml from "sanitize-html";

import {
  textContainsLink,
  USER_TEXT_NO_LINKS_ERROR,
} from "@/lib/text/noLinks";

export { USER_TEXT_NO_LINKS_ERROR as APPLICATION_NO_LINKS_ERROR };

export function getPlainTextFromApplicationStoryHtml(html: string): string {
  return sanitizeHtml(html || "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

export function applicationPlainTextContainsLink(text: string): boolean {
  return textContainsLink(text);
}

export function applicationStoryHtmlContainsLink(html: string): boolean {
  const plain = getPlainTextFromApplicationStoryHtml(html);
  if (!plain) return false;
  return textContainsLink(plain);
}

export type ApplicationTextField =
  | "title"
  | "summary"
  | "story"
  | "bankName"
  | "payment";

export function getApplicationNoLinksError(
  field: ApplicationTextField,
): string {
  if (field === "title") {
    return "В заголовке нельзя указывать ссылки";
  }
  if (field === "summary") {
    return "В кратком описании нельзя указывать ссылки";
  }
  if (field === "bankName") {
    return "В названии банка нельзя указывать ссылки";
  }
  if (field === "payment") {
    return "В номере телефона нельзя указывать ссылки";
  }
  return "В истории нельзя указывать ссылки";
}

export function findApplicationFieldWithLink(input: {
  title: string;
  summary: string;
  storyHtml: string;
  bankName?: string;
  payment?: string;
}): ApplicationTextField | null {
  if (applicationPlainTextContainsLink(input.title)) return "title";
  if (applicationPlainTextContainsLink(input.summary)) return "summary";
  if (applicationStoryHtmlContainsLink(input.storyHtml)) return "story";
  if (input.bankName && applicationPlainTextContainsLink(input.bankName)) {
    return "bankName";
  }
  if (input.payment && applicationPlainTextContainsLink(input.payment)) {
    return "payment";
  }
  return null;
}
