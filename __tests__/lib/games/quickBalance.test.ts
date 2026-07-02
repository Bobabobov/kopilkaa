import { describe, expect, it } from 'vitest';
import {
  evaluateBalanceExpression,
  formatBalanceExpression,
  getComparisonFromValues,
} from '@/lib/games/quickBalanceEval';
import {
  generateQuickBalanceSeries,
  validateQuickBalanceChoices,
} from '@/lib/games/quickBalanceExpressions';

describe('evaluateBalanceExpression', () => {
  it('должно учитывать приоритет умножения', () => {
    expect(evaluateBalanceExpression('8+2*3')).toBe(14);
    expect(evaluateBalanceExpression('(8+2)*3')).toBe(30);
  });

  it('должно парсить символы × и ÷', () => {
    expect(evaluateBalanceExpression(formatBalanceExpression('(14-6)*3'))).toBe(24);
    expect(evaluateBalanceExpression(formatBalanceExpression('32-7'))).toBe(25);
  });
});

describe('generateQuickBalanceSeries', () => {
  it('должно генерировать 3 уникальные раундовые пары без ошибок', () => {
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const rounds = generateQuickBalanceSeries();

      expect(rounds).toHaveLength(3);
      expect(rounds[2].kind).toBe('tricky');

      for (const round of rounds) {
        expect(round.leftText.length).toBeGreaterThan(0);
        expect(round.rightText.length).toBeGreaterThan(0);
        expect(round.correct).toBe(
          getComparisonFromValues(round.leftValue, round.rightValue),
        );
      }
    }
  });
});

describe('validateQuickBalanceChoices', () => {
  it('должно принять верную серию из трёх ответов', () => {
    const rounds = generateQuickBalanceSeries();
    const choices = rounds.map((round) => round.correct);

    expect(validateQuickBalanceChoices(rounds, choices)).toEqual({
      valid: true,
      progress: 3,
    });
  });
});
