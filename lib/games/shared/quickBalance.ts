import type {
  QuickBalanceComparison,
  QuickBalanceRoundView,
} from '@/lib/games/quickBalanceExpressions';

export const ROUNDS_IN_SERIES = 3;
export const TIME_LIMIT_MS = 1800;
export const GAME_COST = 15;
export const WIN_REWARD = 45;
export const DAILY_ATTEMPT_LIMIT = 10;

export type { QuickBalanceComparison, QuickBalanceRoundView };

export type QuickBalanceVerifyReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface QuickBalanceVerifyResult {
  won: boolean;
  reason: QuickBalanceVerifyReason;
  reward: number;
  balanceAfter: number | null;
  progress: number;
  roundsInSeries: number;
  reactionMs: number | null;
}
