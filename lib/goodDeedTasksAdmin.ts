import { prisma } from "@/lib/db";
import {
  GOOD_DEED_TASK_POOL,
  type GoodDeedDifficulty,
  type GoodDeedTaskTemplate,
} from "@/lib/goodDeeds";

const ROTATION_STATE_ID = "singleton";

export type ManagedGoodDeedTask = GoodDeedTaskTemplate & {
  isActive: boolean;
  sortOrder: number;
};

function isDifficulty(value: string): value is GoodDeedDifficulty {
  return value === "EASY" || value === "MEDIUM" || value === "HARD";
}

function toManagedTask(
  task: GoodDeedTaskTemplate,
  sortOrder: number,
): ManagedGoodDeedTask {
  return {
    ...task,
    isActive: true,
    sortOrder,
  };
}

export function formatGoodDeedCycleLabel(lastRotatedAt: Date): string {
  return `Активен с ${lastRotatedAt.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

export async function ensureGoodDeedTasksSeeded(): Promise<void> {
  const count = await prisma.goodDeedTask.count();
  if (count > 0) return;

  await prisma.goodDeedTask.createMany({
    data: GOOD_DEED_TASK_POOL.map((task, index) => ({
      id: task.id,
      difficulty: task.difficulty,
      title: task.title,
      description: task.description,
      reward: task.reward,
      isActive: true,
      sortOrder: index,
    })),
  });
}

export async function getAllManagedGoodDeedTasks(): Promise<
  ManagedGoodDeedTask[]
> {
  await ensureGoodDeedTasksSeeded();

  const tasks = await prisma.goodDeedTask.findMany({
    orderBy: [
      { difficulty: "asc" },
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  if (!tasks.length) {
    return GOOD_DEED_TASK_POOL.map((task, index) => toManagedTask(task, index));
  }

  return tasks
    .filter((task) => isDifficulty(task.difficulty))
    .map((task) => ({
      id: task.id,
      difficulty: task.difficulty as GoodDeedDifficulty,
      title: task.title,
      description: task.description,
      reward: task.reward,
      isActive: task.isActive,
      sortOrder: task.sortOrder,
    }));
}

export async function getActiveTasksByDifficulty(): Promise<
  Record<GoodDeedDifficulty, ManagedGoodDeedTask[]>
> {
  const allTasks = await getAllManagedGoodDeedTasks();
  return {
    EASY: allTasks.filter(
      (task) => task.isActive && task.difficulty === "EASY",
    ),
    MEDIUM: allTasks.filter(
      (task) => task.isActive && task.difficulty === "MEDIUM",
    ),
    HARD: allTasks.filter(
      (task) => task.isActive && task.difficulty === "HARD",
    ),
  };
}

export async function getCurrentGoodDeedTasks(): Promise<
  ManagedGoodDeedTask[]
> {
  const [tasksByDifficulty, rotation] = await Promise.all([
    getActiveTasksByDifficulty(),
    getTaskRotationState(),
  ]);

  const difficultyOrder: GoodDeedDifficulty[] = ["EASY", "MEDIUM", "HARD"];

  return difficultyOrder.flatMap((difficulty) => {
    const tasks = tasksByDifficulty[difficulty];
    if (!tasks.length) return [];

    return [tasks[rotation.version % tasks.length]];
  });
}

export async function getManagedTaskById(
  taskId: string,
): Promise<ManagedGoodDeedTask | null> {
  const allTasks = await getAllManagedGoodDeedTasks();
  return allTasks.find((task) => task.id === taskId) || null;
}

/** Состояние цикла заданий — меняется только вручную из админки. */
export async function getTaskRotationState(): Promise<{
  version: number;
  lastRotatedAt: Date;
}> {
  const now = new Date();
  const existing = await prisma.goodDeedTaskRotationState.findUnique({
    where: { id: ROTATION_STATE_ID },
  });

  if (!existing) {
    const created = await prisma.goodDeedTaskRotationState.create({
      data: {
        id: ROTATION_STATE_ID,
        version: 0,
        lastRotatedAt: now,
        // Поле остаётся в схеме; авто-ротация отключена.
        nextRotationAt: now,
      },
    });
    return {
      version: created.version,
      lastRotatedAt: created.lastRotatedAt,
    };
  }

  return {
    version: existing.version,
    lastRotatedAt: existing.lastRotatedAt,
  };
}

/** Ручная смена набора заданий (админка). */
export async function rotateTasksNow(): Promise<{
  version: number;
  lastRotatedAt: Date;
}> {
  const now = new Date();
  const updated = await prisma.goodDeedTaskRotationState.upsert({
    where: { id: ROTATION_STATE_ID },
    create: {
      id: ROTATION_STATE_ID,
      version: 1,
      lastRotatedAt: now,
      nextRotationAt: now,
    },
    update: {
      version: { increment: 1 },
      lastRotatedAt: now,
      nextRotationAt: now,
    },
  });

  return {
    version: updated.version,
    lastRotatedAt: updated.lastRotatedAt,
  };
}

/** Ключ цикла отчётов — только версия ротации, без календарной недели. */
export async function getGoodDeedCycleKey(): Promise<string> {
  const rotation = await getTaskRotationState();
  return `good-deed:v${rotation.version}`;
}
