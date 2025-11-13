// components/achievements/AchievementCard.tsx
"use client";

import { Achievement, UserAchievement } from '@/lib/achievements/types';
import { RARITY_COLORS, RARITY_NAMES } from '@/lib/achievements/types';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  showProgress?: boolean;
  progress?: number;
  maxProgress?: number;
  onClick?: () => void;
  className?: string;
}

export function AchievementCard({
  achievement,
  userAchievement,
  showProgress = false,
  progress = 0,
  maxProgress = 1,
  onClick,
  className = '',
}: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;
  
  const IconComponent = LucideIcons[achievement.icon as keyof typeof LucideIcons] || LucideIcons.Star;
  
  // Сокращенные названия редкости для экономии места
  const getShortRarityName = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'Обычн.';
      case 'RARE': return 'Редкое';
      case 'EPIC': return 'Эпич.';
      case 'LEGENDARY': return 'Легенд.';
      case 'EXCLUSIVE': return 'Экскл.';
      default: return rarity;
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 cursor-pointer
        ${isUnlocked 
          ? 'border-white/20 hover:border-white/30' 
          : 'border-white/10 hover:border-white/20'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {/* Редкость - полоска сверху */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: RARITY_COLORS[achievement.rarity] }}
      />
      
      {/* Иконка достижения */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${isUnlocked 
              ? 'bg-white/10' 
              : 'bg-white/5'
            }
          `}
          style={{
            color: isUnlocked ? RARITY_COLORS[achievement.rarity] : '#94a1b2',
          }}
        >
          <IconComponent size="lg" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`
              text-lg font-semibold break-words flex-1 min-w-0
              ${isUnlocked ? 'text-[#fffffe]' : 'text-[#94a1b2]'}
            `}>
              {achievement.name}
            </h3>
            
            {isUnlocked && (
              <div className="text-[#abd1c6] text-xl flex-shrink-0 mt-0.5">
                ✓
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 flex-wrap overflow-hidden">
            <span
              className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap inline-block max-w-[120px] truncate"
              style={{
                backgroundColor: `${RARITY_COLORS[achievement.rarity]}20`,
                color: RARITY_COLORS[achievement.rarity],
              }}
              title={RARITY_NAMES[achievement.rarity]}
            >
              {getShortRarityName(achievement.rarity)}
            </span>
            
            {achievement.isExclusive && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f9bc60]/20 text-[#f9bc60] whitespace-nowrap inline-block max-w-[100px] truncate">
                Эксклюзив
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Описание */}
      <p className={`
        text-sm leading-relaxed mb-4 break-words overflow-hidden
        ${isUnlocked ? 'text-[#abd1c6]' : 'text-[#94a1b2]'}
      `}>
        {achievement.description}
      </p>
      
      {/* Прогресс */}
      {showProgress && !isUnlocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#94a1b2]">
            <span>Прогресс</span>
            <span>{progress}/{maxProgress}</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: RARITY_COLORS[achievement.rarity],
              }}
            />
          </div>
        </div>
      )}
      
      {/* Дата получения */}
      {isUnlocked && userAchievement?.unlockedAt && (
        <div className="text-xs text-[#94a1b2] mt-4 pt-4 border-t border-white/10">
          Получено: {new Date(userAchievement.unlockedAt).toLocaleDateString('ru-RU')}
        </div>
      )}
      
      {/* Эффект разблокировки */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{
              background: `linear-gradient(45deg, transparent 30%, ${RARITY_COLORS[achievement.rarity]}20 50%, transparent 70%)`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
