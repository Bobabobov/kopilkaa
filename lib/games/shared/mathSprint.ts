export const TIME_LIMIT_MS = 2000;
export const DAILY_ATTEMPT_LIMIT = 10;

export type MathSprintDifficulty = 'easy' | 'medium' | 'hard';

export interface MathSprintDifficultyConfig {
  cost: number;
  reward: number;
  label: string;
}

export const MATH_SPRINT_DIFFICULTIES: Record<
  MathSprintDifficulty,
  MathSprintDifficultyConfig
> = {
  easy: { cost: 5, reward: 8, label: 'Лёгкий' },
  medium: { cost: 15, reward: 25, label: 'Средний' },
  hard: { cost: 30, reward: 55, label: 'Сложный' },
};

export type MathSprintAnswerReason =
  | 'success'
  | 'timeout'
  | 'wrong_answer'
  | 'no_active_session';

export interface MathSprintAnswerResult {
  won: boolean;
  reason: MathSprintAnswerReason;
  reactionMs: number | null;
  reward: number;
  balanceAfter: number | null;
  difficulty: MathSprintDifficulty | null;
}
