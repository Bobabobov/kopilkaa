import { MEGA_BONUS_AMOUNT } from '@/lib/games/bonusGenerator';

export interface GeneratorRewardTier {
  probabilityPercent: number;
  reward: number;
  rewardDescription: string;
  isMega?: boolean;
}

/** Публичная таблица распределения вознаграждений генератора бонусов. */
export const GENERATOR_REWARD_TIERS: GeneratorRewardTier[] = [
  {
    probabilityPercent: 35,
    reward: 0,
    rewardDescription: 'Возврат 0 бонусов',
  },
  {
    probabilityPercent: 30,
    reward: 5,
    rewardDescription: 'Возврат 5 бонусов',
  },
  {
    probabilityPercent: 20,
    reward: 15,
    rewardDescription: 'Возврат 15 бонусов',
  },
  {
    probabilityPercent: 10,
    reward: 30,
    rewardDescription: 'Возврат 30 бонусов',
  },
  {
    probabilityPercent: 4.9,
    reward: 75,
    rewardDescription: 'Возврат 75 бонусов',
  },
  {
    probabilityPercent: 0.1,
    reward: MEGA_BONUS_AMOUNT,
    rewardDescription: 'МЕГА-БОНУС 500 баллов',
    isMega: true,
  },
];

export function formatGeneratorProbability(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}%`;
  }
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })}%`;
}
