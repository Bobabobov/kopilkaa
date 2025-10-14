// components/achievements/AchievementStats.tsx
"use client";

import { AchievementStats as AchievementStatsType } from '@/lib/achievements/types';
import { RARITY_COLORS, RARITY_NAMES } from '@/lib/achievements/types';
import { LucideIcons } from '@/components/ui/LucideIcons';

interface AchievementStatsProps {
  stats: AchievementStatsType;
  className?: string;
}

export function AchievementStats({ stats, className = '' }: AchievementStatsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Общая статистика */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-[#fffffe] mb-4 flex items-center gap-2">
          <LucideIcons.Stats className="text-[#abd1c6]" size="md" />
          Общая статистика
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#f9bc60] mb-1">
              {stats.unlockedAchievements}
            </div>
            <div className="text-sm text-[#abd1c6]">
              Получено достижений
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[#abd1c6] mb-1">
              {stats.totalAchievements}
            </div>
            <div className="text-sm text-[#abd1c6]">
              Всего достижений
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[#e16162] mb-1">
              {Math.round(stats.completionPercentage)}%
            </div>
            <div className="text-sm text-[#abd1c6]">
              Завершено
            </div>
          </div>
        </div>
        
        {/* Прогресс-бар */}
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-[#abd1c6] to-[#f9bc60]"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Статистика по редкости */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-[#fffffe] mb-4 flex items-center gap-2">
          <LucideIcons.Star className="text-[#f9bc60]" size="md" />
          По редкости
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(stats.achievementsByRarity).map(([rarity, count]) => (
            <div
              key={rarity}
              className="bg-white/5 rounded-xl p-3 text-center"
            >
              <div
                className="text-lg font-bold mb-1"
                style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}
              >
                {count}
              </div>
              <div className="text-xs text-[#abd1c6]">
                {RARITY_NAMES[rarity as keyof typeof RARITY_NAMES]}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Статистика по типам */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-[#fffffe] mb-4 flex items-center gap-2">
          <LucideIcons.LayoutGrid className="text-[#abd1c6]" size="md" />
          По категориям
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats.achievementsByType).map(([type, count]) => (
            <div key={type} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-[#f9bc60] mb-1">
                {count}
              </div>
              <div className="text-xs text-[#abd1c6] capitalize">
                {type.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Последние достижения */}
      {stats.recentAchievements.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-[#fffffe] mb-4 flex items-center gap-2">
            <LucideIcons.Clock className="text-[#abd1c6]" size="md" />
            Последние достижения
          </h3>
          
          <div className="space-y-3">
            {stats.recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${RARITY_COLORS[achievement.achievement?.rarity || 'COMMON']}20`,
                    color: RARITY_COLORS[achievement.achievement?.rarity || 'COMMON'],
                  }}
                >
                  <LucideIcons.Star size="sm" />
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#fffffe]">
                    {achievement.achievement?.name}
                  </div>
                  <div className="text-xs text-[#94a1b2]">
                    {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                
                <div className="text-[#abd1c6]">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
