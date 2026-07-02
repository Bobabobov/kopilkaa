/** Сложность ставки для игр с уровнями (мат. спринт, цветовой конфликт). */
export type GameStakeDifficulty = 'easy' | 'medium' | 'hard';

export function isGameStakeDifficulty(
  value: unknown,
): value is GameStakeDifficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

/**
 * Цена доп. слота попытки по уровню сложности.
 *
 * Подобрано так, чтобы при победе оставался небольшой плюс:
 * easy 5→+8: 8−5−2=+1 · medium 15→+25: 25−15−7=+3 · hard 30→+55: 55−30−12=+13
 */
export const EXTRA_ATTEMPT_COST_BY_DIFFICULTY: Record<GameStakeDifficulty, number> =
  {
    easy: 2,
    medium: 7,
    hard: 12,
  };

/** Фиксированная ставка «Секретной последовательности» — как средний уровень. */
export const SEQUENCE_EXTRA_ATTEMPT_COST =
  EXTRA_ATTEMPT_COST_BY_DIFFICULTY.medium;

export function getExtraAttemptCost(difficulty: GameStakeDifficulty): number {
  return EXTRA_ATTEMPT_COST_BY_DIFFICULTY[difficulty];
}

/** Чистая прибыль при победе с купленным слотом (теоретический максимум). */
export function getExtraAttemptWinNet(
  entryCost: number,
  winReward: number,
  difficulty: GameStakeDifficulty,
): number {
  return winReward - entryCost - getExtraAttemptCost(difficulty);
}
