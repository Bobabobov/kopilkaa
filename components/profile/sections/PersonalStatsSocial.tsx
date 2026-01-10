import { PersonalStatCard } from "./PersonalStatCard";
import type { PersonalStatsViewModel } from "../hooks/usePersonalStats";

interface PersonalStatsSocialProps {
  vm: PersonalStatsViewModel;
}

export function PersonalStatsSocial({ vm }: PersonalStatsSocialProps) {
  const { stats } = vm;
  return (
    <div className="grid gap-2 sm:gap-3 md:gap-4 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
      <PersonalStatCard label="Друзья" value={stats.activity.friendsCount} icon="Users" color="#8B5CF6" hint="Общее число друзей" />
      <PersonalStatCard
        label="Лайков получено"
        value={stats.activity.likesReceived}
        icon="ThumbsUp"
        color="#22c55e"
        hint="Сколько лайков на ваши истории"
      />
      <PersonalStatCard
        label="Лайков поставлено"
        value={stats.activity.likesGiven}
        icon="Heart"
        color="#f472b6"
        hint="Сколько лайков вы поставили"
      />
      <PersonalStatCard
        label="Дней активности"
        value={stats.activity.daysActive}
        icon="Flame"
        color="#f59e0b"
        hint="Счётчик активных дней"
      />
    </div>
  );
}
