import {
  getLevelMilestoneDetails,
  getLevelPathDetails,
  MAX_ACTIVE_PROFILE_LEVEL,
} from '@/lib/level-config';
import { getXpSpanForLevel } from '@/lib/userLevel/calculate';
import {
  BONUS_LEVEL_LABEL,
  LEVEL_BENEFIT_HINT,
} from '@/lib/userLevel/economy';

export type HonorLimitChartPoint = {
  level: number;
  label: string;
  limit: number;
  headline: string;
};

export type XpCurveChartPoint = {
  level: number;
  label: string;
  xpNeeded: number;
  cumulativeXp: number;
};

export const LEVELS_HUB_FAQ = [
  {
    id: 'bonuses-xp',
    question: 'Как бонусы превращаются в опыт?',
    answer: `${BONUS_LEVEL_LABEL}. В блоке «Баланс бонусов» вложите нужное количество — оно сразу идёт в опыт профиля. Вложенные бонусы нельзя вывести.`,
  },
  {
    id: 'honor-limit',
    question: 'Зачем нужен уровень?',
    answer: LEVEL_BENEFIT_HINT,
  },
  {
    id: 'level-3',
    question: 'Что открывается на 3 уровне?',
    answer:
      'Вывод накопленных бонусов на СБП, подарок за первый вывод и бонус за достижение вехи. Комиссия при выводе — 10%, с 4 уровня снижается до 8%.',
  },
  {
    id: 'max-level',
    question: 'Есть ли потолок уровня?',
    answer: `Сейчас активны уровни 1–${MAX_ACTIVE_PROFILE_LEVEL}. Вехи 10, 15 и 20 запланированы — следите за обновлениями платформы.`,
  },
] as const;

export function getHonorLimitChartData(): HonorLimitChartPoint[] {
  return getLevelPathDetails()
    .filter((item) => !item.inDevelopment && item.maxApplicationAmount != null)
    .map((item) => ({
      level: item.level,
      label: `Ур. ${item.level}`,
      limit: item.maxApplicationAmount ?? 0,
      headline: item.headline,
    }));
}

export function getXpCurveChartData(): XpCurveChartPoint[] {
  let cumulative = 0;
  return Array.from({ length: MAX_ACTIVE_PROFILE_LEVEL }, (_, index) => {
    const level = index + 1;
    const xpNeeded = getXpSpanForLevel(level);
    cumulative += xpNeeded;
    return {
      level,
      label: `Ур. ${level}`,
      xpNeeded,
      cumulativeXp: cumulative,
    };
  });
}

export function getLevelsHubMilestones() {
  return getLevelMilestoneDetails();
}
