export const GRID_SIZE = 4;
export const GRID_CELL_COUNT = GRID_SIZE * GRID_SIZE;
export const TARGET_COUNT = GRID_CELL_COUNT;
export const TIME_LIMIT_MS = 10_000;
export const GAME_COST = 15;
export const WIN_REWARD = 25;
export const DAILY_ATTEMPT_LIMIT = 10;

export interface OddNumberCell {
  index: number;
  value: number;
}

export type OddNumberAnswerReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface OddNumberAnswerResult {
  gameOver: boolean;
  won: boolean;
  reason: OddNumberAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  progress: number;
}
