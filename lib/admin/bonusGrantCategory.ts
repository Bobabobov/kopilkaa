import {
  DAILY_BONUS_GRANT_COMMENT,
  DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX,
  DAILY_BONUS_RISK_LOSS_GRANT_COMMENT,
  DAILY_BONUS_RISK_WIN_GRANT_COMMENT,
} from "@/lib/dailyBonus/constants";

export type BonusSourceCategory =
  | "goodDeeds"
  | "referrals"
  | "dailyBonus"
  | "adminManual"
  | "other";

export const BONUS_SOURCE_LABELS: Record<BonusSourceCategory, string> = {
  goodDeeds: "Добрые дела",
  referrals: "Рефералы",
  dailyBonus: "Ежедневный вход",
  adminManual: "Ручное начисление",
  other: "Прочее",
};

export function categorizeBonusGrant(
  comment: string | null | undefined,
  grantedById: string | null | undefined,
): Exclude<BonusSourceCategory, "goodDeeds"> {
  const normalized = (comment ?? "").trim();

  if (
    normalized === DAILY_BONUS_GRANT_COMMENT ||
    normalized === DAILY_BONUS_RISK_WIN_GRANT_COMMENT ||
    normalized === DAILY_BONUS_RISK_LOSS_GRANT_COMMENT ||
    normalized.startsWith(DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX)
  ) {
    return "dailyBonus";
  }

  const lower = normalized.toLowerCase();
  if (lower.includes("реферал") || lower.includes("referral")) {
    return "referrals";
  }

  if (grantedById) {
    return "adminManual";
  }

  return normalized ? "other" : "other";
}
