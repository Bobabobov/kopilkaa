// lib/status.ts
export type AppStatus = "PENDING" | "APPROVED" | "REJECTED";

export const statusRu: Record<AppStatus, string> = {
  PENDING: "Обработка",
  APPROVED: "Дали добро",
  REJECTED: "Сорри. Без копейки пока. Попробуй ещё раз",
};

export function statusColor(status: AppStatus) {
  switch (status) {
    case "APPROVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200";
  }
}
