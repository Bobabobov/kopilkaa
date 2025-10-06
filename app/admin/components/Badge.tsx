// app/admin/components/Badge.tsx
import { statusRu, statusColor } from "@/lib/status";
import { ApplicationStatus } from "../types";

interface BadgeProps {
  status: ApplicationStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-xl text-xs ${statusColor(status)}`}>
      {statusRu[status]}
    </span>
  );
}