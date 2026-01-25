interface AchievementsStatsProps {
  unlocked: number;
  total: number;
  completion: number;
}

export function AchievementsStats({
  unlocked,
  total,
  completion,
}: AchievementsStatsProps) {
  return (
    <div className="px-6 py-4 border-b border-[#abd1c6]/20 bg-[#abd1c6]/5">
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#f9bc60] mb-1">
            {unlocked}
          </div>
          <div className="text-sm text-[#abd1c6]">Получено</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#abd1c6] mb-1">{total}</div>
          <div className="text-sm text-[#abd1c6]">Всего</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#e16162] mb-1">
            {Math.round(completion)}%
          </div>
          <div className="text-sm text-[#abd1c6]">Прогресс</div>
        </div>
      </div>
    </div>
  );
}
