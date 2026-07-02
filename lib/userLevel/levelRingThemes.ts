/** Визуальная тема кольца уровня по якорному тиру (1, 2, 3, 4, 5, 10, 15, 20) */
export type LevelRingTierTheme = {
  gradient: [string, string, string];
  auraClass: string;
  innerFill: string;
  trackStroke: string;
  /** Доп. толщина кольца для badge-размера */
  strokeBonus: number;
};

/** Единый цвет цифры и подписи бейджа (как на 3 уровне) */
export const LEVEL_BADGE_TEXT_CLASS = 'text-emerald-100';

export const LEVEL_RING_TIER_THEMES: Record<number, LevelRingTierTheme> = {
  1: {
    gradient: ['#e2e8f0', '#94a3b8', '#64748b'],
    auraClass: 'bg-slate-400/12',
    innerFill: 'rgba(15, 23, 42, 0.68)',
    trackStroke: 'rgba(148, 163, 184, 0.22)',
    strokeBonus: 0,
  },
  2: {
    gradient: ['#5eead4', '#2dd4bf', '#0f766e'],
    auraClass: 'bg-teal-400/12',
    innerFill: 'rgba(4, 47, 46, 0.68)',
    trackStroke: 'rgba(45, 212, 191, 0.22)',
    strokeBonus: 0,
  },
  3: {
    gradient: ['#6ee7b7', '#34d399', '#059669'],
    auraClass: 'bg-emerald-400/12',
    innerFill: 'rgba(2, 44, 34, 0.68)',
    trackStroke: 'rgba(52, 211, 153, 0.24)',
    strokeBonus: 0,
  },
  4: {
    gradient: ['#67e8f9', '#22d3ee', '#0891b2'],
    auraClass: 'bg-cyan-400/12',
    innerFill: 'rgba(8, 51, 68, 0.68)',
    trackStroke: 'rgba(34, 211, 238, 0.22)',
    strokeBonus: 0,
  },
  5: {
    gradient: ['#d4ebe3', '#abd1c6', '#4d8f7d'],
    auraClass: 'bg-[#abd1c6]/14',
    innerFill: 'rgba(0, 40, 37, 0.72)',
    trackStroke: 'rgba(171, 209, 198, 0.28)',
    strokeBonus: 0,
  },
  10: {
    gradient: ['#f9bc60', '#ffd089', '#34d399'],
    auraClass: 'bg-[#f9bc60]/12',
    innerFill: 'rgba(0, 30, 29, 0.62)',
    trackStroke: 'rgba(249, 188, 96, 0.28)',
    strokeBonus: 0.5,
  },
  15: {
    gradient: ['#ddd6fe', '#a78bfa', '#7c3aed'],
    auraClass: 'bg-violet-400/14',
    innerFill: 'rgba(30, 16, 51, 0.72)',
    trackStroke: 'rgba(167, 139, 250, 0.3)',
    strokeBonus: 0.5,
  },
  20: {
    gradient: ['#fde68a', '#fb923c', '#f43f5e'],
    auraClass: 'bg-orange-400/16',
    innerFill: 'rgba(42, 18, 8, 0.75)',
    trackStroke: 'rgba(251, 146, 60, 0.32)',
    strokeBonus: 1,
  },
};

export function getLevelRingTierTheme(tierLevel: number): LevelRingTierTheme {
  return LEVEL_RING_TIER_THEMES[tierLevel] ?? LEVEL_RING_TIER_THEMES[1];
}
