import crypto from 'crypto';
import {
  evaluateBalanceExpression,
  formatBalanceExpression,
  getComparisonFromValues,
} from '@/lib/games/quickBalanceEval';

export type QuickBalanceComparison = 'lt' | 'eq' | 'gt';

export type QuickBalanceRoundKind = 'easy' | 'medium' | 'tricky';

export interface QuickBalanceRoundView {
  leftText: string;
  rightText: string;
}

export interface QuickBalanceRoundInternal extends QuickBalanceRoundView {
  leftValue: number;
  rightValue: number;
  correct: QuickBalanceComparison;
  kind: QuickBalanceRoundKind;
}

function randomInt(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

function pick<T>(items: T[]): T {
  return items[crypto.randomInt(0, items.length)];
}

function buildRound(
  leftRaw: string,
  rightRaw: string,
  kind: QuickBalanceRoundKind,
): QuickBalanceRoundInternal {
  const leftValue = evaluateBalanceExpression(leftRaw);
  const rightValue = evaluateBalanceExpression(rightRaw);

  return {
    leftText: formatBalanceExpression(leftRaw),
    rightText: formatBalanceExpression(rightRaw),
    leftValue,
    rightValue,
    correct: getComparisonFromValues(leftValue, rightValue),
    kind,
  };
}

function generateEasyRound(): QuickBalanceRoundInternal {
  const templates = [
    () => {
      const a = randomInt(3, 18);
      const b = randomInt(2, 12);
      const c = randomInt(5, 25);
      const d = randomInt(2, 9);
      return buildRound(`${a}+${b}`, `${c}-${d}`, 'easy');
    },
    () => {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      const c = randomInt(10, 40);
      const d = randomInt(2, 15);
      return buildRound(`${a}*${b}`, `${c}+${d}`, 'easy');
    },
    () => {
      const divisor = randomInt(2, 9);
      const quotient = randomInt(2, 9);
      const dividend = divisor * quotient;
      const c = randomInt(12, 35);
      const d = randomInt(3, 11);
      return buildRound(`${dividend}/${divisor}`, `${c}-${d}`, 'easy');
    },
    () => {
      const a = randomInt(4, 20);
      const b = randomInt(2, 12);
      const c = randomInt(2, 8);
      const d = randomInt(2, 8);
      return buildRound(`${a}-${b}`, `${c}*${d}`, 'easy');
    },
  ];

  return pick(templates)();
}

function generateMediumRound(): QuickBalanceRoundInternal {
  const templates = [
    () => {
      const a = randomInt(8, 22);
      const b = randomInt(2, 12);
      const mul = randomInt(2, 5);
      const c = randomInt(20, 45);
      const d = randomInt(3, 15);
      return buildRound(`(${a}-${b})*${mul}`, `${c}-${d}`, 'medium');
    },
    () => {
      const a = randomInt(10, 30);
      const b = randomInt(2, 9);
      const c = randomInt(3, 8);
      const d = randomInt(2, 7);
      const e = randomInt(4, 18);
      return buildRound(`${a}+${b}*${c}`, `${d}*${e}+${randomInt(1, 9)}`, 'medium');
    },
    () => {
      const divisor = randomInt(2, 8);
      const quotient = randomInt(3, 9);
      const dividend = divisor * quotient;
      const rightA = randomInt(15, 40);
      const rightB = randomInt(4, 16);
      return buildRound(`(${dividend})/${divisor}+${randomInt(1, 6)}`, `${rightA}-${rightB}`, 'medium');
    },
    () => {
      const a = randomInt(5, 16);
      const b = randomInt(2, 8);
      const c = randomInt(2, 6);
      const d = randomInt(18, 50);
      const e = randomInt(2, 12);
      return buildRound(`${a}*${b}+${c}`, `(${d}-${e})`, 'medium');
    },
  ];

  return pick(templates)();
}

/** Ловушка приоритета операций — третий раунд. */
function generateTrickyRound(): QuickBalanceRoundInternal {
  const templates = [
    () => {
      const a = randomInt(4, 12);
      const b = randomInt(2, 7);
      const c = randomInt(2, 6);
      return buildRound(`${a}+${b}*${c}`, `(${a}+${b})*${c}`, 'tricky');
    },
    () => {
      const a = randomInt(12, 30);
      const b = randomInt(2, 9);
      const c = randomInt(2, 5);
      return buildRound(`${a}-${b}*${c}`, `(${a}-${b})*${c}`, 'tricky');
    },
    () => {
      const divisor = randomInt(2, 6);
      const bPart = divisor * randomInt(2, 6);
      const diff = divisor * randomInt(2, 8);
      const a = randomInt(diff + 10, 48);
      const b = a - diff;
      return buildRound(`${a}-${bPart}/${divisor}`, `(${a}-${b})/${divisor}`, 'tricky');
    },
    () => {
      const a = randomInt(4, 12);
      const b = randomInt(2, 7);
      const c = randomInt(2, 6);
      const base = randomInt(8, 16);
      const tail = randomInt(1, 5);
      return buildRound(`${base}+${a}*${b}-${tail}`, `(${base}+${a})*${b}-${tail}`, 'tricky');
    },
    () => {
      const mul = randomInt(2, 5);
      const a = randomInt(3, 10);
      const b = randomInt(2, 8);
      const c = randomInt(10, 28);
      const d = randomInt(2, 9);
      return buildRound(`${mul}*${a}+${b}`, `${c}-${d}*${randomInt(1, 3)}`, 'tricky');
    },
  ];

  let round = pick(templates)();
  let attempts = 0;

  while (round.correct === 'eq' && attempts < 8) {
    round = pick(templates)();
    attempts += 1;
  }

  return round;
}

function generateEqualRound(kind: QuickBalanceRoundKind): QuickBalanceRoundInternal {
  const value = randomInt(10, 50);
  const a = randomInt(2, Math.max(3, value - 2));
  const b = value - a;
  const c = randomInt(value + 5, value + 20);
  const d = c - value;
  return buildRound(`${a}+${b}`, `${c}-${d}`, kind);
}

function maybeInjectEqual(
  round: QuickBalanceRoundInternal,
  chancePercent: number,
): QuickBalanceRoundInternal {
  if (crypto.randomInt(1, 101) > chancePercent) {
    return round;
  }

  const equalRound = generateEqualRound(round.kind);
  if (equalRound.correct === 'eq') {
    return equalRound;
  }

  return round;
}

export function generateQuickBalanceSeries(): QuickBalanceRoundInternal[] {
  return [
    maybeInjectEqual(generateEasyRound(), 12),
    maybeInjectEqual(generateMediumRound(), 10),
    generateTrickyRound(),
  ];
}

export function toRoundViews(
  rounds: QuickBalanceRoundInternal[],
): QuickBalanceRoundView[] {
  return rounds.map((round) => ({
    leftText: round.leftText,
    rightText: round.rightText,
  }));
}

export function validateQuickBalanceChoices(
  rounds: QuickBalanceRoundInternal[],
  choices: QuickBalanceComparison[],
): { valid: boolean; progress: number } {
  for (let index = 0; index < choices.length; index += 1) {
    if (choices[index] !== rounds[index]?.correct) {
      return { valid: false, progress: index };
    }
  }

  return { valid: true, progress: choices.length };
}
