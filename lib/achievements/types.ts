// lib/achievements/types.ts
export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'EXCLUSIVE';
export type AchievementType = 'STREAK' | 'APPLICATIONS' | 'GAMES' | 'SOCIAL' | 'SPECIAL' | 'COMMUNITY' | 'CREATIVITY';
export type AchievementKind = 'NORMAL' | 'META';

export interface Achievement {
  id: string;
  slug?: string | null;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  type: AchievementType;
  kind?: AchievementKind;
  isExclusive: boolean;
  isHidden?: boolean;
  isSeasonal?: boolean;
  maxCount: number;
  isActive: boolean;
  // В базе поле может быть null, поэтому учитываем и Date, и null, и отсутствие
  validFrom?: Date | null;
  validTo?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  // В базе эти поля могут быть null, поэтому учитываем это в типе
  grantedBy?: string | null;
  grantedByName?: string | null;
  achievement?: Achievement;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  current?: number;
  target?: number;
  unlockedAt?: Date;
  progressPercentage: number;
}

export interface AchievementCategory {
  type: AchievementType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  completionPercentage: number;
  achievementsByRarity: Record<AchievementRarity, number>;
  achievementsByType: Record<AchievementType, number>;
  recentAchievements: UserAchievement[];
}

// Константы для редкости
export const RARITY_COLORS: Record<AchievementRarity, string> = {
  COMMON: '#94a1b2',    // серый
  RARE: '#abd1c6',      // бирюзовый
  EPIC: '#e16162',      // красный
  LEGENDARY: '#f9bc60', // золотой
  EXCLUSIVE: '#ff6b6b', // ярко-красный
};

export const RARITY_NAMES: Record<AchievementRarity, string> = {
  COMMON: 'Обычное',
  RARE: 'Редкое',
  EPIC: 'Эпическое',
  LEGENDARY: 'Легендарное',
  EXCLUSIVE: 'Эксклюзивное',
};

// Категории достижений
export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  {
    type: 'STREAK',
    name: 'Серии',
    description: 'Достижения за ежедневную активность',
    icon: 'Flame',
    color: '#e16162',
  },
  {
    type: 'APPLICATIONS',
    name: 'Заявки',
    description: 'Достижения за создание и помощь',
    icon: 'FileText',
    color: '#abd1c6',
  },
  {
    type: 'GAMES',
    name: 'Игры',
    description: 'Достижения в мини-играх',
    icon: 'Gamepad2',
    color: '#f9bc60',
  },
  {
    type: 'SOCIAL',
    name: 'Социальные',
    description: 'Достижения за общение',
    icon: 'Users',
    color: '#94a1b2',
  },
  {
    type: 'SPECIAL',
    name: 'Особые',
    description: 'Уникальные достижения',
    icon: 'Star',
    color: '#e16162',
  },
  {
    type: 'COMMUNITY',
    name: 'Сообщество',
    description: 'Достижения за помощь другим',
    icon: 'Heart',
    color: '#f9bc60',
  },
  {
    type: 'CREATIVITY',
    name: 'Творчество',
    description: 'Достижения за креативность',
    icon: 'Palette',
    color: '#abd1c6',
  },
];
