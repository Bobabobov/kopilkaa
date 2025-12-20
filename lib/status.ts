// lib/status.ts
export type AppStatus = "PENDING" | "APPROVED" | "REJECTED";

export const statusRu: Record<AppStatus, string> = {
  PENDING: "Обработка",
  APPROVED: "Дали добро",
  REJECTED: "Сорри. Без копейки пока. Попробуй ещё раз",
};

export function statusColor(status: AppStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold";
    case "REJECTED":
      return "bg-[#e16162]/20 text-[#e16162] border border-[#e16162]/40 font-bold";
    default:
      return "bg-[#f9bc60]/20 text-[#f9bc60] border border-[#f9bc60]/40 font-bold";
  }
}
