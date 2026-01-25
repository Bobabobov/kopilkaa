import { PersonalStatCard } from "./PersonalStatCard";
import type { PersonalStatsViewModel } from "../hooks/usePersonalStats";

interface PersonalStatsAchievementsProps {
  vm: PersonalStatsViewModel;
}

export function PersonalStatsAchievements({
  vm,
}: PersonalStatsAchievementsProps) {
  const { stats } = vm;
  return (
    <div className="grid gap-2 sm:gap-3 md:gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
      <PersonalStatCard
        label="Всего"
        value={stats.achievements.total}
        icon="Award"
        color="#f59e0b"
      />
      <PersonalStatCard
        label="Обычные"
        value={stats.achievements.common}
        icon="Star"
        color="#6b7280"
      />
      <PersonalStatCard
        label="Редкие"
        value={stats.achievements.rare}
        icon="Medal"
        color="#3b82f6"
      />
      <PersonalStatCard
        label="Эпические"
        value={stats.achievements.epic}
        icon="Trophy"
        color="#a855f7"
      />
      <PersonalStatCard
        label="Легендарные"
        value={stats.achievements.legendary}
        icon="Crown"
        color="#f59e0b"
      />
    </div>
  );
}
