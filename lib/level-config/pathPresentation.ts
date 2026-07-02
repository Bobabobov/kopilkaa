import { getMinWithdrawalBonuses } from '@/lib/bonusWithdrawals/constants';
import {
  formatLevelWithdrawalPerk,
  formatReducedCommissionPerk,
} from '@/lib/bonusWithdrawals/commission';
import { formatFirstWithdrawalBonusPerk } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { formatLevelThreeMilestoneBonusPerk } from '@/lib/userLevel/levelMilestoneBonuses';
import { formatPublicationCostByLevelPerk, formatPublicationCostDecreasePerk, formatDesiredAmountPerk } from '@/lib/applications/publicationPricing';
import {
  LEVEL_PATH_MILESTONES,
  formatCooldownIntervalLabel,
  type LevelRulesSlice,
} from './shared';

export type LevelMilestoneQuest = {
  label: string;
  targetBonuses: number;
  description: string;
};

export type LevelMilestoneEducationItem = {
  label: string;
  description: string;
};

export type LevelMilestoneEducation = {
  title: string;
  items: LevelMilestoneEducationItem[];
};

export type LevelMilestoneDetail = {
  level: number;
  headline: string;
  maxApplicationAmount: number | null;
  inDevelopment: boolean;
  /** Только новое или изменившееся на этой вехе */
  newPerks: string[];
  hints?: string[];
  quest?: LevelMilestoneQuest;
  education?: LevelMilestoneEducation;
  /** Тизер следующей вехи — мотивация «зачем расти дальше» */
  upcomingHighlight?: string;
};

type RulesSlice = LevelRulesSlice;

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

const LEVEL_ONE_QUEST_TARGET = 50;

function formatLevelThreeWithdrawalPerk(level: number): string {
  const levelWithdrawalPerk = formatLevelWithdrawalPerk(
    getMinWithdrawalBonuses(level),
    level,
  );
  return levelWithdrawalPerk.replace(
    'Вывод на СБП',
    'Вывод бонусов',
  );
}

const MILESTONE_META: Partial<
  Record<
    number,
    Pick<
      LevelMilestoneDetail,
      'hints' | 'quest' | 'upcomingHighlight' | 'education'
    >
  >
> = {
  1: {
    hints: [
      'Выполните задание в разделе «Добрые дела» — быстрый способ получить бонусы',
      'Откройте ежедневный сундук в профиле или на главной',
    ],
    quest: {
      label: 'Ко 2-й истории',
      targetBonuses: LEVEL_ONE_QUEST_TARGET,
      description: `Накопите ${LEVEL_ONE_QUEST_TARGET} бонусов для публикации второй истории`,
    },
  },
  2: {
    upcomingHighlight: 'На 3 уровне — вывод гонорара',
  },
  3: {
    education: {
      title: 'Вложить в уровень или вывести?',
      items: [
        {
          label: 'Вложить в уровень',
          description:
            'Бонусы превращаются в опыт и повышают уровень. После вложения их нельзя вывести — они уже «в уровне».',
        },
        {
          label: 'Вывести',
          description:
            'Только накопленные бонусы на балансе (не вложенные в опыт). Комиссия 10%. С 4 уровня комиссия снижается до 8%.',
        },
      ],
    },
  },
};

function buildNewPerks(
  level: number,
  rules: RulesSlice,
  prevRules: RulesSlice | null,
): string[] {
  if (rules.inDevelopment) {
    return ['Новые лимиты и привилегии — в разработке'];
  }

  if (level === 1) {
    return [
      'Первая история — бесплатно',
      `Гонорар за историю до ${rules.maxApplicationAmount} ₽`,
      formatPublicationCostByLevelPerk(rules.applicationCost),
      `Интервал между историями: ${formatCooldownIntervalLabel(rules.cooldownHours)}`,
    ];
  }

  if (level === 2) {
    return [
      formatDesiredAmountPerk(rules.maxApplicationAmount),
      prevRules
        ? formatPublicationCostDecreasePerk(
            rules.applicationCost,
            prevRules.applicationCost,
            1,
          )
        : formatPublicationCostByLevelPerk(rules.applicationCost),
      `Лимит гонорара: до ${rules.maxApplicationAmount} ₽`,
    ];
  }

  if (level === 3) {
    const perks = [
      formatLevelThreeWithdrawalPerk(level),
      formatLevelThreeMilestoneBonusPerk(),
      formatFirstWithdrawalBonusPerk(),
    ];
    if (prevRules && rules.applicationCost < prevRules.applicationCost) {
      perks.push(
        `Публикация за ${rules.applicationCost} бонусов (на 2 ур. — ${prevRules.applicationCost})`,
      );
    }
    perks.push(`Лимит гонорара: до ${rules.maxApplicationAmount} ₽`);
    return perks;
  }

  const perks: string[] = [];

  if (
    prevRules &&
    rules.maxApplicationAmount > prevRules.maxApplicationAmount
  ) {
    perks.push(`Лимит гонорара: до ${rules.maxApplicationAmount} ₽`);
  }

  if (level === 4) {
    perks.push(formatReducedCommissionPerk());
    perks.push(
      `Минимальный вывод: от ${getMinWithdrawalBonuses(level)} бонусов (на 3 уровне — 100)`,
    );
  }

  if (prevRules && rules.applicationCost < prevRules.applicationCost) {
    perks.push(
      `Публикация за ${rules.applicationCost} бонусов (раньше ${prevRules.applicationCost})`,
    );
  }

  if (prevRules && rules.applicationCost > prevRules.applicationCost) {
    perks.push(
      `Публикация: ${rules.applicationCost} бонусов (раньше ${prevRules.applicationCost})`,
    );
  }

  if (prevRules && rules.cooldownHours > prevRules.cooldownHours) {
    perks.push(
      `Интервал между историями: ${formatCooldownIntervalLabel(rules.cooldownHours)}`,
    );
  }

  if (level === 10 && perks.length <= 2) {
    perks.push('Уровень для авторов с более высоким запросом гонорара');
  }

  if (level === 15) {
    perks.push('Максимальный лимит гонорара на платформе');
  }

  if (level === 5) {
    perks.push('Максимальный активный уровень — дальше в разработке');
  }

  if (perks.length === 0) {
    perks.push('Условия как на предыдущей вехе');
  }

  return perks;
}

export function buildLevelMilestoneDetail(
  level: number,
  rules: RulesSlice,
  prevRules: RulesSlice | null,
): LevelMilestoneDetail {
  const meta = MILESTONE_META[level];

  return {
    level,
    headline: LEVEL_HEADLINES[level] ?? `Уровень ${level}`,
    maxApplicationAmount: rules.inDevelopment
      ? null
      : rules.maxApplicationAmount,
    inDevelopment: rules.inDevelopment,
    newPerks: buildNewPerks(level, rules, prevRules),
    hints: meta?.hints,
    quest: meta?.quest,
    education: meta?.education,
    upcomingHighlight: meta?.upcomingHighlight,
  };
}

export function getNextMilestoneLevel(currentLevel: number): number | null {
  const safeLevel = Math.max(1, Math.floor(currentLevel));
  for (const milestone of LEVEL_PATH_MILESTONES) {
    if (milestone > safeLevel) return milestone;
  }
  return null;
}

export function getMilestoneDetailByLevel(
  level: number,
  rulesByLevel: Record<number, RulesSlice>,
): LevelMilestoneDetail | null {
  const rules = rulesByLevel[level];
  if (!rules) return null;

  const index = LEVEL_PATH_MILESTONES.indexOf(
    level as (typeof LEVEL_PATH_MILESTONES)[number],
  );
  const prevLevel =
    index > 0 ? LEVEL_PATH_MILESTONES[index - 1] : null;
  const prevRules =
    prevLevel != null ? (rulesByLevel[prevLevel] ?? null) : null;

  return buildLevelMilestoneDetail(level, rules, prevRules);
}

export function getNextMilestonePreview(
  currentLevel: number,
  rulesByLevel: Record<number, RulesSlice>,
): {
  nextLevel: number;
  detail: LevelMilestoneDetail;
} | null {
  const nextLevel = getNextMilestoneLevel(currentLevel);
  if (nextLevel == null) return null;
  const detail = getMilestoneDetailByLevel(nextLevel, rulesByLevel);
  if (!detail || detail.inDevelopment) return null;
  return { nextLevel, detail };
}

export { formatLevelThreeWithdrawalPerk };
