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
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
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
        
        <div className="flex-1">
          <h3 className={`
            text-lg font-semibold mb-1
            ${isUnlocked ? 'text-[#fffffe]' : 'text-[#94a1b2]'}
          `}>
            {achievement.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${RARITY_COLORS[achievement.rarity]}20`,
                color: RARITY_COLORS[achievement.rarity],
              }}
            >
              {RARITY_NAMES[achievement.rarity]}
            </span>
            
            {achievement.isExclusive && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f9bc60]/20 text-[#f9bc60]">
                Эксклюзив
              </span>
            )}
          </div>
        </div>
        
        {isUnlocked && (
          <div className="text-[#abd1c6] text-2xl">
            ✓
          </div>
        )}
      </div>
      
      {/* Описание */}
      <p className={`
        text-sm leading-relaxed mb-4
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
