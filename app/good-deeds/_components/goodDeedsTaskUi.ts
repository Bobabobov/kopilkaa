import type { GoodDeedDifficulty, GoodDeedTaskView, TaskStatus } from "../types";

export const TASK_TIER: Record<
  GoodDeedDifficulty,
  { n: number; name: string }
> = {
  EASY: { n: 1, name: "лёгкое" },
  MEDIUM: { n: 2, name: "среднее" },
  HARD: { n: 3, name: "сложное" },
};

export function bonusWord(n: number): string {
  const m = n % 10;
  const c = n % 100;
  if (m === 1 && c !== 11) return "бонус";
  if (m >= 2 && m <= 4 && (c < 10 || c > 20)) return "бонуса";
  return "бонусов";
}

export function displayTierLabel(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function canSubmitGoodDeedTask(status: TaskStatus): boolean {
  return status === null || status === "REJECTED";
}

export function getTaskStatusMeta(status: TaskStatus) {
  if (status === "PENDING") {
    return {
      label: "На проверке",
      className: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    };
  }
  if (status === "APPROVED") {
    return {
      label: "Подтверждено",
      className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    };
  }
  if (status === "REJECTED") {
    return {
      label: "Отклонено",
      className: "border-rose-500/40 bg-rose-500/10 text-rose-100",
    };
  }
  return null;
}

export function getTaskSlot(task: GoodDeedTaskView, index: number) {
  const tier = TASK_TIER[task.difficulty];
  return {
    slotNumber: tier.n,
    slotName: tier.name,
    index,
  };
}
