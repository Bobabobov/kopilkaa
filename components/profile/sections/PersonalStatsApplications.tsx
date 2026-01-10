import { PersonalStatCard } from "./PersonalStatCard";
import type { PersonalStatsViewModel } from "../hooks/usePersonalStats";

interface PersonalStatsApplicationsProps {
  vm: PersonalStatsViewModel;
}

export function PersonalStatsApplications({ vm }: PersonalStatsApplicationsProps) {
  const { stats } = vm;
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="grid gap-2 sm:gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        <PersonalStatCard label="Всего" value={stats.applications.total} icon="FileText" color="#3b82f6" />
        <PersonalStatCard label="Одобрено" value={stats.applications.approved} icon="Check" color="#22c55e" />
        <PersonalStatCard label="Отклонено" value={stats.applications.rejected} icon="X" color="#ef4444" />
        <PersonalStatCard label="В процессе" value={stats.applications.pending} icon="Clock" color="#f59e0b" />
        <PersonalStatCard
          label="Сумма заявок"
          value={stats.applications.totalAmount.toLocaleString("ru-RU")}
          icon="Wallet"
          color="#f97316"
        />
        <PersonalStatCard
          label="Процент одобрения"
          value={`${stats.applications.approvalRate || 0}%`}
          icon="PieChart"
          color="#22c55e"
        />
      </div>
    </div>
  );
}
