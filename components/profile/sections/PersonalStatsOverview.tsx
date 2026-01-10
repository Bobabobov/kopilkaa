import { LucideIcons } from "@/components/ui/LucideIcons";
import { PersonalStatCard } from "./PersonalStatCard";
import type { PersonalStatsViewModel } from "../hooks/usePersonalStats";

interface PersonalStatsOverviewProps {
  vm: PersonalStatsViewModel;
}

export function PersonalStatsOverview({ vm }: PersonalStatsOverviewProps) {
  const {
    stats,
    achievementsLabel,
    friendsLabel,
    totalApplications,
    approvedPercent,
    rejectedPercent,
    pendingPercent,
    successHint,
  } = vm;

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="grid gap-2.5 sm:gap-3 md:gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] items-start">
        <PersonalStatCard label="Всего заявок" value={stats.applications.total} icon="FileText" color="#3B82F6" />
        <PersonalStatCard label="Одобрено" value={stats.applications.approved} icon="CheckCircle2" color="#10B981" />
        <PersonalStatCard label={friendsLabel} value={stats.activity.friendsCount} icon="Users" color="#8B5CF6" />
        <PersonalStatCard label={achievementsLabel} value={stats.achievements.total} icon="Award" color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-3 sm:gap-4 md:gap-5 items-start">
        <div className="p-4 sm:p-5 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/10 self-start">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LucideIcons.FileText className="w-4 h-4 text-[#f9bc60]" />
              <p className="text-sm font-semibold text-[#fffffe]">Распределение заявок</p>
            </div>
            <p className="text-xs text-[#abd1c6]">
              Всего: <span className="text-[#fffffe] font-semibold">{totalApplications}</span>
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Одобрено", value: approvedPercent, color: "#22c55e" },
              { label: "В процессе", value: pendingPercent, color: "#f59e0b" },
              { label: "Отклонено", value: rejectedPercent, color: "#ef4444" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-[#abd1c6] mb-1">
                  <span>{item.label}</span>
                  <span className="text-[#fffffe] font-semibold">{item.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#abd1c6]/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
