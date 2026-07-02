import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';

export const GENERATOR_OUTCOME_TITLES: Record<
  BonusGeneratorRunResult['label'],
  string
> = {
  none: 'Без начисления',
  small: 'Небольшое усиление',
  refund: 'Компенсация затрат',
  boost: 'Усиление баланса',
  super: 'Выдающийся результат',
  mega: 'Мега-бонус',
};

export const GENERATOR_OUTCOME_MESSAGES: Record<
  BonusGeneratorRunResult['label'],
  string
> = {
  none: 'На этот раз начисления не было. Можно запустить генератор ещё раз.',
  small: 'Вы получили дополнительные баллы активности.',
  refund: 'Затраты на запуск полностью компенсированы.',
  boost: 'Баланс заметно вырос — отличная активность!',
  super: 'Редкий успех генератора — крупное начисление!',
  mega: 'Максимальное вознаграждение программы лояльности!',
};

export function formatBonusDelta(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return '0';
}
