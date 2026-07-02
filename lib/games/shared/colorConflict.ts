import type { ColorConflictOptionView } from '@/lib/games/colorConflictDisplay';

export type ColorConflictDifficulty = 'easy' | 'medium' | 'hard';
export const DAILY_ATTEMPT_LIMIT = 10;

export interface ColorConflictDifficultyConfig {
  cost: number;
  reward: number;
  seriesTarget: number;
  timeLimitMs: number;
  label: string;
}

export const COLOR_CONFLICT_DIFFICULTIES: Record<
  ColorConflictDifficulty,
  ColorConflictDifficultyConfig
> = {
  easy: {
    cost: 5,
    reward: 8,
    seriesTarget: 5,
    timeLimitMs: 2000,
    label: 'Лёгкий',
  },
  medium: {
    cost: 15,
    reward: 25,
    seriesTarget: 10,
    timeLimitMs: 2500,
    label: 'Средний',
  },
  hard: {
    cost: 30,
    reward: 55,
    seriesTarget: 15,
    timeLimitMs: 1800,
    label: 'Сложный',
  },
};

export interface ColorConflictRoundPayload {
  wordText: string;
  displayColorHex: string;
  displayGlowRgb: string;
  options: ColorConflictOptionView[];
  currentRound: number;
  seriesTarget: number;
  timeLimitMs: number;
  serverStartTime: number;
}

export type ColorConflictAnswerReason =
  | 'success'
  | 'continue'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface ColorConflictAnswerResult {
  gameOver: boolean;
  won: boolean;
  reason: ColorConflictAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  difficulty: ColorConflictDifficulty | null;
  currentStreak: number;
  seriesTarget: number;
  nextRound: ColorConflictRoundPayload | null;
}

export type { ColorConflictOptionView };
