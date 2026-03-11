import { ApplicationStatus } from "../types";

interface BadgeProps {
  status: ApplicationStatus;
}

export default function Badge({ status }: BadgeProps) {
  const config: Record<
    ApplicationStatus,
    { label: string; className: string }
  > = {
    PENDING: {
      label: "В обработке",
      className:
        "bg-[#f9bc60]/12 text-[#f9bc60] border border-[#f9bc60]/35",
    },
    APPROVED: {
      label: "Одобрено",
      className:
        "bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/35",
    },
    REJECTED: {
      label: "Отказано",
      className:
        "bg-[#e16162]/12 text-[#e16162] border border-[#e16162]/35",
    },
    CONTEST: {
      label: "Конкурс",
      className:
        "bg-[#9b87f5]/12 text-[#9b87f5] border border-[#9b87f5]/35",
    },
  };

  const badge = config[status] ?? {
    label: status,
    className: "bg-white/5 text-[#abd1c6] border border-white/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${badge.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {badge.label}
    </span>
  );
}
