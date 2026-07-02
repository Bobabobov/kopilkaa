/**
 * Конфиг уровней профиля: лимиты заявок, стоимость подачи, кулдаун.
 * Единый источник правды для формы заявки, профиля, API и админки.
 */

import { getMinWithdrawalBonuses } from '@/lib/bonusWithdrawals/constants';
import { formatLevelWithdrawalPerk } from '@/lib/bonusWithdrawals/commission';
import { formatDesiredAmountPerk } from '@/lib/applications/publicationPricing';
import { formatLevelThreeMilestoneBonusPerk } from '@/lib/userLevel/levelMilestoneBonuses';
import {
  LEVEL_PATH_MILESTONES,
  MAX_ACTIVE_PROFILE_LEVEL,
  formatCooldownIntervalLabel,
  type LevelRules,
  type LevelRulesSlice,
} from './level-config/shared';

export type { LevelRules, LevelRulesSlice } from './level-config/shared';
export { MAX_ACTIVE_PROFILE_LEVEL } from './level-config/shared';

/** Якорные уровни с явными правилами */
const KEY_LEVEL_RULES: Record<number, LevelRulesSlice> = {
  1: {
    maxApplicationAmount: 150,
    applicationCost: 50,
    cooldownHours: 24,
    inDevelopment: false,
  },
  2: {
    maxApplicationAmount: 200,
    applicationCost: 40,
    cooldownHours: 24,
    inDevelopment: false,
  },
  3: {
    maxApplicationAmount: 250,
    applicationCost: 35,
    cooldownHours: 24,
    inDevelopment: false,
  },
  4: {
    maxApplicationAmount: 275,
    applicationCost: 30,
    cooldownHours: 24,
    inDevelopment: false,
  },
  5: {
    maxApplicationAmount: 300,
    applicationCost: 25,
    cooldownHours: 24,
    inDevelopment: false,
  },
  10: {
    maxApplicationAmount: 400,
    applicationCost: 70,
    cooldownHours: 48,
    inDevelopment: true,
  },
  15: {
    maxApplicationAmount: 500,
    applicationCost: 100,
    cooldownHours: 72,
    inDevelopment: true,
  },
  20: {
    maxApplicationAmount: 500,
    applicationCost: 100,
    cooldownHours: 72,
    inDevelopment: true,
  },
};

/** Значимые уровни для «пути уровней» и подсказок в профиле */
export { LEVEL_PATH_MILESTONES } from './level-config/shared';

export type LevelPathItem = {
  level: number;
  maxApplicationAmount: number | null;
  inDevelopment: boolean;
};

export type LevelPathDetail = LevelPathItem & {
  headline: string;
  perks: string[];
};

const LEVEL_HEADLINES: Record<number, string> = {
  1: 'Старт на платформе',
  2: 'Гибкая публикация',
  3: 'Вывод гонорара',
  4: 'Рост лимита',
  5: 'Уверенный уровень',
  10: 'Расширенные возможности',
  15: 'Максимальный лимит',
  20: 'Новый этап',
};

function buildLevelPerks(
  level: number,
  rules: LevelRulesSlice,
): string[] {
  if (rules.inDevelopment) {
    return [
      'Новые лимиты и привилегии в разработке',
      'Следите за обновлениями платформы',
    ];
  }

  const perks = [
    `Гонорар за историю до ${rules.maxApplicationAmount} ₽`,
    `Публикация за ${rules.applicationCost} бонусов`,
    `Интервал между историями: ${formatCooldownIntervalLabel(rules.cooldownHours)}`,
  ];

  if (level >= 2) {
    perks.push(formatDesiredAmountPerk(rules.maxApplicationAmount));
  }

  if (level >= 3) {
    perks.push(formatLevelWithdrawalPerk(getMinWithdrawalBonuses(level), level));
    if (level === 3) {
      perks.push(formatLevelThreeMilestoneBonusPerk());
    }
  }

  if (level >= 10) {
    perks.push('Повышенный лимит при том же доверии к профилю');
  }

  if (level >= 15) {
    perks.push('Максимальный гонорар на текущий момент');
  }

  return perks;
}

export function getLevelPathDetails(): LevelPathDetail[] {
  return LEVEL_PATH_MILESTONES.map((level) => {
    const rules = KEY_LEVEL_RULES[level];
    return {
      level,
      maxApplicationAmount: rules.inDevelopment
        ? null
        : rules.maxApplicationAmount,
      inDevelopment: rules.inDevelopment,
      headline: LEVEL_HEADLINES[level] ?? `Уровень ${level}`,
      perks: buildLevelPerks(level, rules),
    };
  });
}

export type {
  LevelMilestoneDetail,
  LevelMilestoneQuest,
  LevelMilestoneEducation,
  LevelMilestoneEducationItem,
} from './level-config/pathPresentation';

export {
  buildLevelMilestoneDetail,
  getMilestoneDetailByLevel,
  getNextMilestoneLevel,
  getNextMilestonePreview,
} from './level-config/pathPresentation';

import {
  getMilestoneDetailByLevel,
  getNextMilestonePreview,
} from './level-config/pathPresentation';

/** Детали вех с дельтой перков, подсказками и квестами */
export function getLevelMilestoneDetails() {
  return LEVEL_PATH_MILESTONES.map((level) =>
    getMilestoneDetailByLevel(level, KEY_LEVEL_RULES),
  ).filter((item): item is NonNullable<typeof item> => item != null);
}

/** Превью следующей вехи для блока «до следующего уровня» */
export function getNextLevelMilestonePreview(currentLevel: number) {
  return getNextMilestonePreview(currentLevel, KEY_LEVEL_RULES);
}

/** Определяет якорный уровень для произвольного level пользователя */
export function resolveTierLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel >= 20) return 20;
  if (safeLevel >= 16) return 15;
  if (safeLevel >= 15) return 15;
  if (safeLevel >= 11) return 10;
  if (safeLevel >= 10) return 10;
  if (safeLevel >= 6) return 5;
  if (safeLevel >= 5) return 5;
  if (safeLevel >= 4) return 4;
  if (safeLevel >= 3) return 3;
  if (safeLevel >= 2) return 2;
  return 1;
}

export function getLevelRules(level: number): LevelRules {
  const tierLevel = resolveTierLevel(level);
  const rules = KEY_LEVEL_RULES[tierLevel];
  return { tierLevel, ...rules };
}

export function getMaxApplicationAmount(level: number): number {
  return getLevelRules(level).maxApplicationAmount;
}

export function getApplicationCost(level: number): number {
  return getLevelRules(level).applicationCost;
}

export function getApplicationCooldownHours(level: number): number {
  return getLevelRules(level).cooldownHours;
}

/** Следующий значимый уровень для подсказки в профиле */
export function getNextMeaningfulLevel(level: number): number | null {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel >= MAX_ACTIVE_PROFILE_LEVEL) return null;
  if (safeLevel >= 4) return 5;
  if (safeLevel >= 3) return 4;
  if (safeLevel >= 2) return 3;
  if (safeLevel >= 1) return 2;
  return null;
}

export function getLevelPathItems(): LevelPathItem[] {
  return getLevelPathDetails();
}

/** Человекочитаемый интервал между заявками */
export { formatCooldownIntervalLabel } from './level-config/shared';

/** Оставшееся время до следующей заявки */
export function formatCooldownRemaining(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} мин.`;
  if (minutes === 0) return `${hours} ч.`;
  return `${hours} ч. ${minutes} мин.`;
}

export function formatMaxAmountError(maxAmount: number): string {
  return `На вашем уровне доступен гонорар до ${maxAmount} ₽.`;
}

/** Поле «Желаемая сумма» доступно с 2-го уровня */
export function showsDesiredAmountField(userLevel: number): boolean {
  return Math.max(1, Math.floor(userLevel)) >= 2;
}

export const INSUFFICIENT_BONUSES_ERROR =
  'Недостаточно бонусов для публикации истории.';

export function formatCooldownError(remainingMs: number): string {
  return `Следующую историю можно отправить через: ${formatCooldownRemaining(remainingMs)}`;
}
