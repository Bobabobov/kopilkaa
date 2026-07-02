import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { toUtcDayKey } from '@/lib/dailyBonus/dayKey';

export const QUEST_REWARD_BONUSES = 5;
export const GAMES_DAILY_QUEST_REWARD_TX = 'GAMES_DAILY_QUEST_REWARD';
export const DAILY_QUEST_REROLLS_PER_DAY = 1;

export type DailyQuestId = 1 | 2 | 3;

type QuestType =
  | 'math_sprint'
  | 'bonus_generator'
  | 'sequence'
  | 'quick_balance'
  | 'odd_number'
  | 'color_conflict';

type QuestTypeConfig = {
  type: QuestType;
  titleTemplate: (target: number) => string;
  minTarget: number;
  maxTarget: number;
  txTypes: string[];
};

const QUEST_TYPE_CONFIGS: Record<QuestType, QuestTypeConfig> = {
  math_sprint: {
    type: 'math_sprint',
    titleTemplate: (target) => `Сыграть ${target} игр в Спринт`,
    minTarget: 2,
    maxTarget: 5,
    txTypes: ['GAMES_MATH_SPRINT_START', 'GAMES_MATH_SPRINT_EXTRA_START'],
  },
  bonus_generator: {
    type: 'bonus_generator',
    titleTemplate: (target) => `Запустить Генератор ${target} раз`,
    minTarget: 3,
    maxTarget: 6,
    txTypes: ['GAMES_BONUS_GENERATOR_RUN'],
  },
  sequence: {
    type: 'sequence',
    titleTemplate: (target) => `Сыграть ${target} раундов в Последовательность`,
    minTarget: 2,
    maxTarget: 5,
    txTypes: ['GAMES_SEQUENCE_START', 'GAMES_SEQUENCE_EXTRA_START'],
  },
  quick_balance: {
    type: 'quick_balance',
    titleTemplate: (target) => `Сыграть ${target} игр в Быстрый баланс`,
    minTarget: 2,
    maxTarget: 5,
    txTypes: ['GAMES_QUICK_BALANCE_START', 'GAMES_QUICK_BALANCE_EXTRA_START'],
  },
  odd_number: {
    type: 'odd_number',
    titleTemplate: (target) => `Сыграть ${target} игр в Лишнее число`,
    minTarget: 2,
    maxTarget: 4,
    txTypes: ['GAMES_ODD_NUMBER_SCHULTE_START', 'GAMES_ODD_NUMBER_SCHULTE_EXTRA_START'],
  },
  color_conflict: {
    type: 'color_conflict',
    titleTemplate: (target) => `Сыграть ${target} игр в Цветовой конфликт`,
    minTarget: 2,
    maxTarget: 5,
    txTypes: ['GAMES_COLOR_CONFLICT_START', 'GAMES_COLOR_CONFLICT_EXTRA_START'],
  },
};

const QUEST_TYPE_VALUES = Object.keys(QUEST_TYPE_CONFIGS) as QuestType[];

const QUEST_SLOTS = [
  { id: 1 as const, doneKey: 'quest1_done' as const, typeKey: 'quest1_type' as const, targetKey: 'quest1_target' as const },
  { id: 2 as const, doneKey: 'quest2_done' as const, typeKey: 'quest2_type' as const, targetKey: 'quest2_target' as const },
  { id: 3 as const, doneKey: 'quest3_done' as const, typeKey: 'quest3_type' as const, targetKey: 'quest3_target' as const },
];

type QuestRow = {
  id: string;
  userId: string;
  quest1_done: boolean;
  quest2_done: boolean;
  quest3_done: boolean;
  questDayKey: string | null;
  rerollsUsed: number;
  quest1_type: string | null;
  quest1_target: number | null;
  quest2_type: string | null;
  quest2_target: number | null;
  quest3_type: string | null;
  quest3_target: number | null;
  updatedAt: Date;
};

type DbClient = Prisma.TransactionClient | typeof prisma;

export interface DailyQuestView {
  id: DailyQuestId;
  type: QuestType;
  title: string;
  progress: number;
  target: number;
  done: boolean;
  reward: number;
}

export interface DailyQuestsState {
  quests: DailyQuestView[];
  rerollsRemaining: number;
}

export class DailyQuestRerollLimitError extends Error {
  constructor() {
    super('Доступна только одна замена ежедневного задания в сутки');
    this.name = 'DailyQuestRerollLimitError';
  }
}

export class DailyQuestRerollInvalidQuestError extends Error {
  constructor() {
    super('Некорректный идентификатор задания для замены');
    this.name = 'DailyQuestRerollInvalidQuestError';
  }
}

export class DailyQuestRerollCompletedQuestError extends Error {
  constructor() {
    super('Нельзя заменить уже выполненное ежедневное задание');
    this.name = 'DailyQuestRerollCompletedQuestError';
  }
}

function getUtcDayStart(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00.000Z`);
}

function isQuestType(value: string | null): value is QuestType {
  if (!value) return false;
  return value in QUEST_TYPE_CONFIGS;
}

function randomIntInclusive(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

function pickRandomQuestTypes(count: number): QuestType[] {
  const pool = [...QUEST_TYPE_VALUES];
  const selected: QuestType[] = [];
  while (selected.length < count && pool.length > 0) {
    const index = crypto.randomInt(0, pool.length);
    const [picked] = pool.splice(index, 1);
    selected.push(picked);
  }
  return selected;
}

function buildQuestTarget(type: QuestType): number {
  const config = QUEST_TYPE_CONFIGS[type];
  return randomIntInclusive(config.minTarget, config.maxTarget);
}

function createRandomQuestSlots(): Array<{ type: QuestType; target: number }> {
  const types = pickRandomQuestTypes(3);
  return types.map((type) => ({
    type,
    target: buildQuestTarget(type),
  }));
}

async function ensureDailyQuestsRow(userId: string, db: DbClient): Promise<QuestRow> {
  const existing = await db.userDailyQuests.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing as QuestRow;
  }

  return db.userDailyQuests.create({
    data: { userId },
  }) as Promise<QuestRow>;
}

async function hydrateDailyQuestsForDay(
  userId: string,
  row: QuestRow,
  dayKey: string,
  db: DbClient,
): Promise<QuestRow> {
  const needsFreshDayReset = row.questDayKey !== dayKey;
  const hasLegacyMissingData =
    !isQuestType(row.quest1_type) ||
    !isQuestType(row.quest2_type) ||
    !isQuestType(row.quest3_type) ||
    !row.quest1_target ||
    !row.quest2_target ||
    !row.quest3_target;

  if (!needsFreshDayReset && !hasLegacyMissingData) {
    return row;
  }

  const [slot1, slot2, slot3] = createRandomQuestSlots();

  return db.userDailyQuests.update({
    where: { userId },
    data: {
      questDayKey: dayKey,
      rerollsUsed: 0,
      quest1_done: false,
      quest2_done: false,
      quest3_done: false,
      quest1_type: slot1.type,
      quest1_target: slot1.target,
      quest2_type: slot2.type,
      quest2_target: slot2.target,
      quest3_type: slot3.type,
      quest3_target: slot3.target,
    },
  }) as Promise<QuestRow>;
}

async function getQuestProgressMap(
  userId: string,
  dayKey: string,
  db: DbClient,
): Promise<Record<QuestType, number>> {
  const dayStart = getUtcDayStart(dayKey);
  const allTypes = QUEST_TYPE_VALUES.flatMap((type) => QUEST_TYPE_CONFIGS[type].txTypes);

  const counts = await db.bonusTransaction.groupBy({
    by: ['type'],
    where: {
      userId,
      createdAt: { gte: dayStart },
      type: { in: allTypes },
    },
    _count: {
      _all: true,
    },
  });

  const byTxType = new Map<string, number>();
  for (const item of counts) {
    byTxType.set(item.type, item._count._all);
  }

  const result = {} as Record<QuestType, number>;
  for (const type of QUEST_TYPE_VALUES) {
    result[type] = QUEST_TYPE_CONFIGS[type].txTypes.reduce((acc, txType) => {
      return acc + (byTxType.get(txType) ?? 0);
    }, 0);
  }

  return result;
}

function parseQuestSlot(row: QuestRow, slotId: DailyQuestId): {
  id: DailyQuestId;
  type: QuestType;
  target: number;
  done: boolean;
} {
  const slot = QUEST_SLOTS.find((item) => item.id === slotId);
  if (!slot) {
    throw new DailyQuestRerollInvalidQuestError();
  }

  const rawType = row[slot.typeKey];
  const rawTarget = row[slot.targetKey];

  if (!isQuestType(rawType) || !rawTarget) {
    throw new Error('Некорректные данные ежедневных квестов');
  }

  return {
    id: slotId,
    type: rawType,
    target: rawTarget,
    done: row[slot.doneKey],
  };
}

function buildQuestView(
  slot: { id: DailyQuestId; type: QuestType; target: number; done: boolean },
  progressMap: Record<QuestType, number>,
): DailyQuestView {
  const config = QUEST_TYPE_CONFIGS[slot.type];
  const progress = Math.min(progressMap[slot.type], slot.target);

  return {
    id: slot.id,
    type: slot.type,
    title: config.titleTemplate(slot.target),
    progress,
    target: slot.target,
    done: slot.done,
    reward: QUEST_REWARD_BONUSES,
  };
}

async function grantQuestReward(
  tx: Prisma.TransactionClient,
  userId: string,
  questTitle: string,
): Promise<void> {
  await tx.goodDeedBonusGrant.create({
    data: {
      userId,
      amountBonuses: QUEST_REWARD_BONUSES,
      comment: `Награда за ежедневный квест: ${questTitle}`,
    },
  });

  await tx.bonusTransaction.create({
    data: {
      userId,
      amount: 0,
      type: GAMES_DAILY_QUEST_REWARD_TX,
      description: `Начисление +${QUEST_REWARD_BONUSES} бонусов за квест «${questTitle}»`,
    },
  });
}

export interface EvaluateDailyQuestsHints {
  sequenceStepsCompleted?: number;
}

export async function evaluateDailyQuests(
  userId: string,
  _hints: EvaluateDailyQuestsHints = {},
  db: DbClient = prisma,
): Promise<void> {
  const dayKey = toUtcDayKey(new Date());
  const row = await ensureDailyQuestsRow(userId, db);
  const hydratedRow = await hydrateDailyQuestsForDay(userId, row, dayKey, db);
  const progressMap = await getQuestProgressMap(userId, dayKey, db);

  const slots = QUEST_SLOTS.map((slot) => parseQuestSlot(hydratedRow, slot.id));

  const completions = slots.filter((slot) => {
    return !slot.done && progressMap[slot.type] >= slot.target;
  });

  if (!completions.length) {
    return;
  }

  const run = async (tx: Prisma.TransactionClient) => {
    for (const completion of completions) {
      const questTitle = QUEST_TYPE_CONFIGS[completion.type].titleTemplate(
        completion.target,
      );

      await grantQuestReward(tx, userId, questTitle);

      const doneKey = QUEST_SLOTS.find((slot) => slot.id === completion.id)?.doneKey;
      if (!doneKey) continue;

      await tx.userDailyQuests.update({
        where: { userId },
        data: { [doneKey]: true },
      });
    }
  };

  if (db === prisma) {
    await prisma.$transaction(run);
  } else {
    await run(db);
  }
}

export async function getDailyQuestsForUser(userId: string): Promise<DailyQuestsState> {
  await evaluateDailyQuests(userId);

  const dayKey = toUtcDayKey(new Date());
  const row = await ensureDailyQuestsRow(userId, prisma);
  const hydratedRow = await hydrateDailyQuestsForDay(userId, row, dayKey, prisma);
  const progressMap = await getQuestProgressMap(userId, dayKey, prisma);

  const quests = QUEST_SLOTS.map((slot) => {
    const parsed = parseQuestSlot(hydratedRow, slot.id);
    return buildQuestView(parsed, progressMap);
  });

  return {
    quests,
    rerollsRemaining: Math.max(0, DAILY_QUEST_REROLLS_PER_DAY - hydratedRow.rerollsUsed),
  };
}

export async function rerollDailyQuest(
  userId: string,
  questId: DailyQuestId,
): Promise<DailyQuestsState> {
  const dayKey = toUtcDayKey(new Date());
  const row = await ensureDailyQuestsRow(userId, prisma);
  const hydratedRow = await hydrateDailyQuestsForDay(userId, row, dayKey, prisma);

  if (hydratedRow.rerollsUsed >= DAILY_QUEST_REROLLS_PER_DAY) {
    throw new DailyQuestRerollLimitError();
  }

  const slot = QUEST_SLOTS.find((item) => item.id === questId);
  if (!slot) {
    throw new DailyQuestRerollInvalidQuestError();
  }

  if (hydratedRow[slot.doneKey]) {
    throw new DailyQuestRerollCompletedQuestError();
  }

  const excludedTypes = new Set<QuestType>();
  for (const item of QUEST_SLOTS) {
    if (item.id === questId) continue;
    const type = hydratedRow[item.typeKey];
    if (isQuestType(type)) {
      excludedTypes.add(type);
    }
  }
  const currentSlotType = hydratedRow[slot.typeKey];
  if (isQuestType(currentSlotType)) {
    excludedTypes.add(currentSlotType);
  }

  let candidateTypes = QUEST_TYPE_VALUES.filter((type) => !excludedTypes.has(type));
  if (!candidateTypes.length) {
    candidateTypes = QUEST_TYPE_VALUES.filter((type) => type !== currentSlotType);
  }
  if (!candidateTypes.length) {
    candidateTypes = QUEST_TYPE_VALUES;
  }

  const nextType = candidateTypes[crypto.randomInt(0, candidateTypes.length)];
  const nextTarget = buildQuestTarget(nextType);

  await prisma.userDailyQuests.update({
    where: { userId },
    data: {
      [slot.typeKey]: nextType,
      [slot.targetKey]: nextTarget,
      [slot.doneKey]: false,
      rerollsUsed: {
        increment: 1,
      },
    },
  });

  await evaluateDailyQuests(userId);
  return getDailyQuestsForUser(userId);
}
