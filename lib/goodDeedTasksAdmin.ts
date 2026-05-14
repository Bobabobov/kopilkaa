import { prisma } from "@/lib/db";
import {
  GOOD_DEED_TASK_POOL,
  type GoodDeedDifficulty,
  type GoodDeedTaskTemplate,
} from "@/lib/goodDeeds";

const ROTATION_STATE_ID = "singleton";
const ROTATION_MS = 7 * 24 * 60 * 60 * 1000;

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

export async function getAllManagedGoodDeedTasks(): Promise<ManagedGoodDeedTask[]> {
  await ensureGoodDeedTasksSeeded();

  const tasks = await prisma.goodDeedTask.findMany({
    orderBy: [{ difficulty: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
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
    EASY: allTasks.filter((task) => task.isActive && task.difficulty === "EASY"),
    MEDIUM: allTasks.filter(
      (task) => task.isActive && task.difficulty === "MEDIUM",
    ),
    HARD: allTasks.filter((task) => task.isActive && task.difficulty === "HARD"),
  };
}

export async function getManagedTaskById(
  taskId: string,
): Promise<ManagedGoodDeedTask | null> {
  const allTasks = await getAllManagedGoodDeedTasks();
  return allTasks.find((task) => task.id === taskId) || null;
}

export async function getTaskRotationState(): Promise<{
  version: number;
  nextRotationAt: Date;
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
        nextRotationAt: new Date(now.getTime() + ROTATION_MS),
      },
    });
    return {
      version: created.version,
      nextRotationAt: created.nextRotationAt,
      lastRotatedAt: created.lastRotatedAt,
    };
  }

  if (existing.nextRotationAt.getTime() > now.getTime()) {
    return {
      version: existing.version,
      nextRotationAt: existing.nextRotationAt,
      lastRotatedAt: existing.lastRotatedAt,
    };
  }

  const passedPeriods =
    Math.floor((now.getTime() - existing.nextRotationAt.getTime()) / ROTATION_MS) +
    1;
  const updated = await prisma.goodDeedTaskRotationState.update({
    where: { id: ROTATION_STATE_ID },
    data: {
      version: { increment: passedPeriods },
      lastRotatedAt: now,
      nextRotationAt: new Date(existing.nextRotationAt.getTime() + passedPeriods * ROTATION_MS),
    },
  });

  return {
    version: updated.version,
    nextRotationAt: updated.nextRotationAt,
    lastRotatedAt: updated.lastRotatedAt,
  };
}

export async function rotateTasksNow(): Promise<{
  version: number;
  nextRotationAt: Date;
  lastRotatedAt: Date;
}> {
  const now = new Date();
  const updated = await prisma.goodDeedTaskRotationState.upsert({
    where: { id: ROTATION_STATE_ID },
    create: {
      id: ROTATION_STATE_ID,
      version: 1,
      lastRotatedAt: now,
      nextRotationAt: new Date(now.getTime() + ROTATION_MS),
    },
    update: {
      version: { increment: 1 },
      lastRotatedAt: now,
      nextRotationAt: new Date(now.getTime() + ROTATION_MS),
    },
  });

  return {
    version: updated.version,
    nextRotationAt: updated.nextRotationAt,
    lastRotatedAt: updated.lastRotatedAt,
  };
}

export async function getGoodDeedCycleKey(baseKey: string): Promise<string> {
  const rotation = await getTaskRotationState();
  return `${baseKey}:v${rotation.version}`;
}
