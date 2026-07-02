import { describe, expect, it } from 'vitest';
import {
  generateSchulteGrid,
  GRID_CELL_COUNT,
  TARGET_COUNT,
  validateSchulteClickSequence,
} from '@/lib/games/oddNumberSchulte';

describe('generateSchulteGrid', () => {
  it('должно вернуть перестановку чисел 1–16', () => {
    const cells = generateSchulteGrid();

    expect(cells).toHaveLength(GRID_CELL_COUNT);

    const values = cells.map((cell) => cell.value).sort((a, b) => a - b);
    expect(values).toEqual(
      Array.from({ length: TARGET_COUNT }, (_, index) => index + 1),
    );
  });
});

describe('validateSchulteClickSequence', () => {
  it('должно принять верную цепочку кликов', () => {
    const cells = [
      { index: 0, value: 2 },
      { index: 1, value: 1 },
      { index: 2, value: 3 },
    ];

    expect(validateSchulteClickSequence(cells, [1, 0, 2])).toEqual({
      valid: true,
      progress: 3,
    });
  });

  it('должно отклонить неверный клик', () => {
    const cells = generateSchulteGrid();
    const firstIndex = cells.find((cell) => cell.value === 1)!.index;
    const skipIndex = cells.find((cell) => cell.value === 3)!.index;

    expect(validateSchulteClickSequence(cells, [skipIndex])).toEqual({
      valid: false,
      progress: 0,
    });

    expect(validateSchulteClickSequence(cells, [firstIndex, skipIndex])).toEqual({
      valid: false,
      progress: 1,
    });
  });
});
