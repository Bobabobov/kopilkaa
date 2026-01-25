"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface BugReportFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const STATUSES = [
  { value: "all", label: "Все" },
  { value: "OPEN", label: "Открыт" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "RESOLVED", label: "Решено" },
  { value: "CLOSED", label: "Закрыт" },
];

export default function BugReportFilters({
  statusFilter,
  onStatusChange,
}: BugReportFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#004643]/40 to-[#001e1d]/20 border border-[#abd1c6]/20"
    >
      <div className="flex items-center gap-2">
        <LucideIcons.Filter size="sm" className="text-[#abd1c6]" />
        <span className="text-sm font-medium text-[#abd1c6]">Фильтры:</span>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 bg-[#001e1d]/40 border border-[#abd1c6]/20 rounded-lg text-sm text-[#fffffe] focus:outline-none focus:border-[#f9bc60] transition-colors"
      >
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
