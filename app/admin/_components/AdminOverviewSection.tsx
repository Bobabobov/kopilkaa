import { motion } from "framer-motion";
import type { Stats } from "@/types/admin";
import StatsCards from "./StatsCards";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface AdminOverviewSectionProps {
  stats: Stats | null;
  pendingCount: number;
  newestId: string | null;
  newestTitle: string | null;
  newestAgeHours: number | null;
}

export function AdminOverviewSection({
  stats,
  pendingCount,
  newestId,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-2">
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

        {newestId ? (
          <Link
            href={`/admin/applications/${newestId}`}
            className="rounded-2xl border border-[#abd1c6]/25 bg-[#abd1c6]/10 p-4 transition-all hover:border-[#f9bc60]/35 hover:bg-[#abd1c6]/12 group"
            title="Открыть последнюю новую заявку"
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#abd1c6]">
                <LucideIcons.Inbox size="sm" />
                <span className="text-xs font-black uppercase tracking-wide">
                  Последняя новая
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f9bc60] opacity-80 group-hover:opacity-100 transition-opacity">
                Открыть
                <LucideIcons.ArrowRight size="xs" className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-[#fffffe] truncate group-hover:text-[#f9bc60] transition-colors">
              {newestTitle || "Без названия"}
            </div>
            <div className="text-xs text-[#abd1c6] mt-0.5">
              {newestAgeHours == null ? "-" : `${newestAgeHours} ч назад`}
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 flex items-center gap-2 text-[#abd1c6]">
              <LucideIcons.Inbox size="sm" />
              <span className="text-xs font-black uppercase tracking-wide">
                Последняя новая
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-[#fffffe]/80">
              Нет новых заявок
            </div>
            <div className="text-xs text-[#abd1c6]/80">—</div>
          </div>
        )}
      </div>

      {stats && <StatsCards stats={stats} />}
    </motion.div>
  );
}

