// lib/achievements/rarity.ts
import { AchievementRarity } from '@prisma/client';
import { RARITY_NAMES, RARITY_COLORS } from './types';

export function getRarityLabel(rarity: AchievementRarity): string {
  return RARITY_NAMES[rarity] || rarity;
}

export function getRarityColor(rarity: AchievementRarity): string {
  return RARITY_COLORS[rarity] || '#94a1b2';
}
