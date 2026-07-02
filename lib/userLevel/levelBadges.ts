import { resolveTierLevel, getLevelRules } from '@/lib/level-config';

export type LevelBadgeIcon =
  | 'Sparkles'
  | 'Rocket'
  | 'Coins'
  | 'TrendingUp'
  | 'Star'
  | 'Check'
  | 'Award'
  | 'Medal'
  | 'Crown'
  | 'Trophy'
  | 'Flame';

export type LevelBadgeStyle = {
  border: string;
  background: string;
  text: string;
  icon: string;
  iconShell: string;
  levelPill: string;
  glow?: string;
  /** Акцентная полоска слева — визуальный якорь тира */
  accentBar: string;
};

export type LevelBadgeInfo = {
  level: number;
  tierLevel: number;
  label: string;
  title: string;
  icon: LevelBadgeIcon;
  style: LevelBadgeStyle;
  inDevelopment: boolean;
};

/** Короткие названия бейджа для каждого уровня 1–20 */
const LEVEL_BADGE_LABELS: Record<number, string> = {
  1: 'Новичок',
  2: 'Участник',
  3: 'Автор',
  4: 'Союзник',
  5: 'Постоянный',
  6: 'Активный',
  7: 'Опытный',
  8: 'Надёжный',
  9: 'Уверенный',
  10: 'Ветеран',
  11: 'Знаток',
  12: 'Эксперт',
  13: 'Мастер историй',
  14: 'Признанный',
  15: 'Мастер',
  16: 'Наставник',
  17: 'Хранитель',
  18: 'Покровитель',
  19: 'Почётный',
  20: 'Легенда',
};

/** Подзаголовок для тултипа */
const LEVEL_BADGE_TITLES: Record<number, string> = {
  1: 'Старт на платформе',
  2: 'Гибкая публикация',
  3: 'Вывод гонорара',
  4: 'Рост лимита',
  5: 'Уверенный уровень',
  6: 'Рост в сообществе',
  7: 'Опытный автор',
  8: 'Надёжный участник',
  9: 'Путь к ветерану',
  10: 'Расширенные возможности',
  11: 'Глубокое погружение',
  12: 'Эксперт платформы',
  13: 'Мастер историй',
  14: 'Признание сообщества',
  15: 'Максимальный лимит',
  16: 'Наставник добра',
  17: 'Хранитель традиций',
  18: 'Покровитель платформы',
  19: 'Почётный статус',
  20: 'Новый этап',
};

const TIER_BADGE_STYLES: Record<number, LevelBadgeStyle> = {
  1: {
    border: 'border-slate-300/25',
    background:
      'bg-gradient-to-r from-slate-600/35 via-slate-500/20 to-slate-600/30',
    text: 'text-slate-50',
    icon: 'text-slate-100',
    iconShell: 'bg-slate-400/25 ring-slate-200/30',
    levelPill: 'bg-slate-950/35 text-slate-50 ring-slate-300/20',
    accentBar: 'from-slate-300/80 via-slate-200/50 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_14px_rgba(15,23,42,0.35)]',
  },
  2: {
    border: 'border-teal-300/30',
    background:
      'bg-gradient-to-r from-teal-600/30 via-teal-500/18 to-cyan-600/25',
    text: 'text-teal-50',
    icon: 'text-teal-100',
    iconShell: 'bg-teal-400/25 ring-teal-200/35',
    levelPill: 'bg-teal-950/35 text-teal-50 ring-teal-300/25',
    accentBar: 'from-teal-300/85 via-teal-200/55 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_16px_rgba(13,148,136,0.22)]',
  },
  3: {
    border: 'border-emerald-300/35',
    background:
      'bg-gradient-to-r from-emerald-600/32 via-emerald-500/20 to-green-600/26',
    text: 'text-emerald-50',
    icon: 'text-emerald-100',
    iconShell: 'bg-emerald-400/28 ring-emerald-200/35',
    levelPill: 'bg-emerald-950/38 text-emerald-50 ring-emerald-300/28',
    accentBar: 'from-emerald-300/90 via-emerald-200/55 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_18px_rgba(16,185,129,0.28)]',
  },
  4: {
    border: 'border-cyan-300/32',
    background:
      'bg-gradient-to-r from-cyan-600/28 via-sky-500/18 to-cyan-600/24',
    text: 'text-cyan-50',
    icon: 'text-cyan-100',
    iconShell: 'bg-cyan-400/25 ring-cyan-200/32',
    levelPill: 'bg-cyan-950/35 text-cyan-50 ring-cyan-300/24',
    accentBar: 'from-cyan-300/85 via-sky-200/50 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_16px_rgba(6,182,212,0.24)]',
  },
  5: {
    border: 'border-[#abd1c6]/35',
    background:
      'bg-gradient-to-r from-[#5a9a88]/35 via-[#abd1c6]/18 to-[#4d8f7d]/30',
    text: 'text-[#f0faf6]',
    icon: 'text-[#e8f5f0]',
    iconShell: 'bg-[#abd1c6]/22 ring-[#d4ebe3]/35',
    levelPill: 'bg-[#001e1d]/45 text-[#f0faf6] ring-[#abd1c6]/28',
    accentBar: 'from-[#abd1c6]/90 via-[#d4ebe3]/55 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_18px_rgba(171,209,198,0.22)]',
  },
  10: {
    border: 'border-[#f9bc60]/40',
    background:
      'bg-gradient-to-r from-[#c48a2a]/38 via-[#f9bc60]/22 to-[#e8a84a]/32',
    text: 'text-[#fff9ef]',
    icon: 'text-[#fff3d6]',
    iconShell: 'bg-[#f9bc60]/28 ring-[#ffe4b0]/40',
    levelPill: 'bg-[#001e1d]/48 text-[#fff8eb] ring-[#f9bc60]/32',
    accentBar: 'from-[#f9bc60]/95 via-[#ffe4b0]/60 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_6px_22px_rgba(249,188,96,0.32)]',
  },
  15: {
    border: 'border-violet-300/38',
    background:
      'bg-gradient-to-r from-violet-600/34 via-purple-500/20 to-fuchsia-600/28',
    text: 'text-violet-50',
    icon: 'text-violet-100',
    iconShell: 'bg-violet-400/28 ring-violet-200/38',
    levelPill: 'bg-violet-950/42 text-violet-50 ring-violet-300/30',
    accentBar: 'from-violet-300/90 via-fuchsia-200/55 to-transparent',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_24px_rgba(139,92,246,0.34)]',
  },
  20: {
    border: 'border-amber-300/42',
    background:
      'bg-gradient-to-r from-amber-500/36 via-orange-500/24 to-rose-500/30',
    text: 'text-amber-50',
    icon: 'text-amber-100',
    iconShell: 'bg-amber-400/30 ring-amber-200/42',
    levelPill: 'bg-[#001e1d]/50 text-amber-50 ring-amber-300/35',
    accentBar: 'from-amber-300/95 via-orange-200/60 to-rose-300/40',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_28px_rgba(251,191,36,0.38)]',
  },
};

const TIER_BADGE_ICONS: Record<number, LevelBadgeIcon> = {
  1: 'Sparkles',
  2: 'Rocket',
  3: 'Coins',
  4: 'TrendingUp',
  5: 'Star',
  10: 'Award',
  15: 'Crown',
  20: 'Trophy',
};

const MID_TIER_ICONS: Record<number, LevelBadgeIcon> = {
  6: 'Check',
  7: 'Flame',
  8: 'Star',
  9: 'Medal',
  11: 'Medal',
  12: 'Award',
  13: 'Crown',
  14: 'Trophy',
  16: 'Crown',
  17: 'Award',
  18: 'Medal',
  19: 'Trophy',
};

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return 1;
  return Math.max(1, Math.floor(level));
}

function resolveBadgeLabel(level: number): string {
  if (level <= 20) {
    return LEVEL_BADGE_LABELS[level] ?? `Уровень ${level}`;
  }
  return LEVEL_BADGE_LABELS[20];
}

function resolveBadgeTitle(level: number): string {
  if (level <= 20) {
    return LEVEL_BADGE_TITLES[level] ?? `Уровень ${level}`;
  }
  return `${LEVEL_BADGE_TITLES[20]} · ур. ${level}`;
}

function resolveBadgeIcon(level: number, tierLevel: number): LevelBadgeIcon {
  return MID_TIER_ICONS[level] ?? TIER_BADGE_ICONS[tierLevel] ?? 'Star';
}

/** Бейдж уровня профиля для шапки и карточек */
export function getLevelBadgeInfo(level: number): LevelBadgeInfo {
  const safeLevel = clampLevel(level);
  const tierLevel = resolveTierLevel(safeLevel);
  const style = TIER_BADGE_STYLES[tierLevel] ?? TIER_BADGE_STYLES[1];

  return {
    level: safeLevel,
    tierLevel,
    label: resolveBadgeLabel(safeLevel),
    title: resolveBadgeTitle(safeLevel),
    icon: resolveBadgeIcon(safeLevel, tierLevel),
    style,
    inDevelopment: getLevelRules(safeLevel).inDevelopment,
  };
}

export function formatLevelBadgeAriaLabel(info: LevelBadgeInfo): string {
  return `Уровень профиля ${info.level}: ${info.label}. ${info.title}`;
}
