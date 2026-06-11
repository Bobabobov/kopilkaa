import { randomInt } from "node:crypto";
import { DAILY_BONUS_RISK_WIN_ODDS } from "@/lib/dailyBonus/constants";

export function isDailyBonusRiskWin(
  roll: number,
  odds = DAILY_BONUS_RISK_WIN_ODDS,
): boolean {
  return roll === 0;
}

/** Возвращает true при выигрыше (1 из DAILY_BONUS_RISK_WIN_ODDS). */
export function rollDailyBonusRiskWin(
  odds = DAILY_BONUS_RISK_WIN_ODDS,
): boolean {
  return isDailyBonusRiskWin(randomInt(odds), odds);
}
