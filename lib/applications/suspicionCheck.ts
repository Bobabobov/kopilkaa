import sanitizeHtml from "sanitize-html";

function getPlainTextFromHtml(html: string): string {
  return sanitizeHtml(html || "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/** ~3–5 симв/сек — печать, 10+ — подозрение на вставку, 20+ — почти наверняка */
const CHARS_PER_SEC_SUSPICIOUS = 10;
const CHARS_PER_SEC_HIGH = 20;

/** Типичные фразы в AI-текстах (рус.) — эвристика */
const AI_LIKE_PHRASES = [
  "важно отметить",
  "следует подчеркнуть",
  "в заключение",
  "необходимо отметить",
  "стоит отметить",
  "более того",
  "таким образом",
  "как правило",
  "в данном случае",
  "несомненно",
  "безусловно",
  "разумеется",
  "в связи с вышесказанным",
  "подводя итог",
  "в первую очередь",
];

export type SuspicionResult = {
  /** Подозрение на вставку (слишком быстро заполнено) */
  fastFill: boolean;
  /** Высокое подозрение — почти наверняка вставка */
  fastFillHigh: boolean;
  /** Детали: символов, секунд, симв/сек */
  fastFillDetails?: {
    chars: number;
    seconds: number;
    charsPerSec: number;
  };
  /** Найдены типичные AI-фразы */
  aiPhrasesFound: string[];
  /** Есть любые подозрения */
  hasSuspicion: boolean;
};

export function checkApplicationSuspicion(
  storyHtml: string,
  filledMs: number | null | undefined,
): SuspicionResult {
  const text = getPlainTextFromHtml(storyHtml);
  const chars = text.length;

  const aiPhrasesFound = AI_LIKE_PHRASES.filter((phrase) =>
    text.toLowerCase().includes(phrase),
  );

  let fastFill = false;
  let fastFillHigh = false;
  let fastFillDetails: SuspicionResult["fastFillDetails"];

  if (
    typeof filledMs === "number" &&
    Number.isFinite(filledMs) &&
    filledMs > 0 &&
    chars >= 200
  ) {
    const seconds = Math.max(0.1, filledMs / 1000);
    const charsPerSec = chars / seconds;
    fastFillDetails = { chars, seconds, charsPerSec };
    fastFill = charsPerSec >= CHARS_PER_SEC_SUSPICIOUS;
    fastFillHigh = charsPerSec >= CHARS_PER_SEC_HIGH;
  }

  const hasSuspicion =
    fastFill || fastFillHigh || aiPhrasesFound.length >= 2;

  return {
    fastFill,
    fastFillHigh,
    fastFillDetails,
    aiPhrasesFound,
    hasSuspicion,
  };
}
