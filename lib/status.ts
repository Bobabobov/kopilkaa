// lib/status.ts
export type AppStatus = "PENDING" | "APPROVED" | "REJECTED";

export const statusRu: Record<AppStatus, string> = {
  PENDING: "Обработка",
  APPROVED: "Дали добро",
  REJECTED: "Сорри. Без копейки пока. Попробуй ещё раз",
};

export function statusColor(status: AppStatus) {
  switch (status) {
    case "APPROVED": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
    case "REJECTED": return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800";
    default: return "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
  }
}
