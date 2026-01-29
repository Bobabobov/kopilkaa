// lib/status.ts
export type AppStatus = "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";

export const statusRu: Record<AppStatus, string> = {
  PENDING: "Обработка",
  APPROVED: "Дали добро",
  REJECTED: "Сорри. Без копейки пока. Попробуй ещё раз",
  CONTEST: "Конкурс",
};

export function statusColor(status: AppStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold";
    case "REJECTED":
      return "bg-[#e16162]/20 text-[#e16162] border border-[#e16162]/40 font-bold";
    case "CONTEST":
      return "bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/40 font-bold";
    default:
      return "bg-[#f9bc60]/20 text-[#f9bc60] border border-[#f9bc60]/40 font-bold";
  }
}
