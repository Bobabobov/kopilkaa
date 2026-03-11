import { motion } from "framer-motion";
import type { Stats } from "@/types/admin";
import StatsCards from "./StatsCards";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdminOverviewSectionProps {
  stats: Stats | null;
  pendingCount: number;
  urgentCount: number;
  newestTitle: string | null;
  newestAgeHours: number | null;
}

export function AdminOverviewSection({
  stats,
  pendingCount,
  urgentCount,
  newestTitle,
  newestAgeHours,
}: AdminOverviewSectionProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-2">
        <div className="rounded-2xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 p-4">
          <div className="mb-1 flex items-center gap-2 text-[#f9bc60]">
            <LucideIcons.Clock size="sm" />
            <span className="text-xs font-black uppercase tracking-wide">
              В очереди
            </span>
          </div>
          <div className="text-2xl font-black text-[#fffffe]">{pendingCount}</div>
          <div className="text-xs text-[#abd1c6]">статус “В обработке”</div>
        </div>

        <div className="rounded-2xl border border-[#e16162]/25 bg-[#e16162]/10 p-4">
          <div className="mb-1 flex items-center gap-2 text-[#e16162]">
            <LucideIcons.AlertTriangle size="sm" />
            <span className="text-xs font-black uppercase tracking-wide">
              Приоритет
            </span>
          </div>
          <div className="text-2xl font-black text-[#fffffe]">{urgentCount}</div>
          <div className="text-xs text-[#abd1c6]">
            от 100 000 руб. среди “В обработке”
          </div>
        </div>

        <div className="rounded-2xl border border-[#abd1c6]/25 bg-[#abd1c6]/10 p-4">
          <div className="mb-1 flex items-center gap-2 text-[#abd1c6]">
            <LucideIcons.Inbox size="sm" />
            <span className="text-xs font-black uppercase tracking-wide">
              Последняя новая
            </span>
          </div>
          <div className="text-sm sm:text-base font-black text-[#fffffe] truncate">
            {newestTitle || "Нет"}
          </div>
          <div className="text-xs text-[#abd1c6]">
            {newestAgeHours == null ? "-" : `${newestAgeHours} ч назад`}
          </div>
        </div>
      </div>

      {stats && <StatsCards stats={stats} />}
    </motion.div>
  );
}

