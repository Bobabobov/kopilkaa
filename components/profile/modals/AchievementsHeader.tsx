import { LucideIcons } from "@/components/ui/LucideIcons";

interface AchievementsHeaderProps {
  count: number;
  stats?: {
    unlockedAchievements: number;
    totalAchievements: number;
  } | null;
  onClose: () => void;
}

export function AchievementsHeader({ count, stats, onClose }: AchievementsHeaderProps) {
  return (
    <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
            <LucideIcons.Trophy size="lg" className="text-[#001e1d]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#fffffe]">Все достижения</h2>
            <p className="text-[#abd1c6]">
              {count}{" "}
              {count === 1 ? "достижение" : count < 5 ? "достижения" : "достижений"}
              {stats && (
                <span className="ml-2">
                  • {stats.unlockedAchievements} из {stats.totalAchievements} получено
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
        >
          <LucideIcons.X size="sm" className="text-[#fffffe]" />
        </button>
      </div>
    </div>
  );
}
