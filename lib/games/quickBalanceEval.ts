/**
 * Безопасный калькулятор выражений для «Быстрого баланса».
 * Только целые числа, скобки и + − × ÷.
 */

const MAX_ABS_VALUE = 9999;

export function normalizeBalanceExpression(input: string): string {
  return input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '');
}

export function evaluateBalanceExpression(input: string): number {
  const source = normalizeBalanceExpression(input);
  let index = 0;

  function peek(): string {
    return source[index] ?? '';
  }

  function consume(): string {
    const char = source[index];
    index += 1;
    return char;
  }

  function parseNumber(): number {
    if (peek() === '(') {
      consume();
      const value = parseExpression();
      if (consume() !== ')') {
        throw new Error('Ожидалась закрывающая скобка');
      }
      return value;
    }

    let digits = '';
    while (/[0-9]/.test(peek())) {
      digits += consume();
    }

    if (!digits) {
      throw new Error('Ожидалось число');
    }

    return Number(digits);
  }

  function parseTerm(): number {
    let value = parseNumber();

    while (peek() === '*' || peek() === '/') {
      const operator = consume();
      const right = parseNumber();

      if (operator === '*') {
        value *= right;
      } else {
        if (right === 0 || value % right !== 0) {
          throw new Error('Деление должно быть без остатка');
        }
        value = Math.trunc(value / right);
      }
    }

    return value;
  }

  function parseExpression(): number {
    let value = parseTerm();

    while (peek() === '+' || peek() === '-') {
      const operator = consume();
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
    }

    return value;
  }

  const result = parseExpression();

  if (index !== source.length) {
    throw new Error('Лишние символы в выражении');
  }

  if (!Number.isFinite(result) || Math.abs(result) > MAX_ABS_VALUE) {
    throw new Error('Результат вне допустимого диапазона');
  }

  return result;
}

export function formatBalanceNumber(value: number): string {
  return String(value);
}

/** Красивый вывод: «(14 - 6) × 3». */
export function formatBalanceExpression(raw: string): string {
  return raw
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )')
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
    .trim();
}

export function getComparisonFromValues(
  left: number,
  right: number,
): 'lt' | 'eq' | 'gt' {
  if (left < right) {
    return 'lt';
  }
  if (left > right) {
    return 'gt';
  }
  return 'eq';
}
