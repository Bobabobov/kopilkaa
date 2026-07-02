'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getLevelRingTierTheme, LEVEL_BADGE_TEXT_CLASS } from '@/lib/userLevel/levelRingThemes';

interface LevelProgressRingProps {
  level: number;
  progressPercent: number;
  size?: 'badge' | 'xs' | 'sm' | 'md' | 'lg';
  showPercent?: boolean;
  /** Скрыть подпись «Ур.» над цифрой (для компактного бейджа в шапке) */
  showLevelPrefix?: boolean;
  /** emblem — декоративное кольцо без семантики прогресс-бара */
  displayMode?: 'progress' | 'emblem';
  /** Якорный тир уровня — меняет палитру кольца */
  tierLevel?: number;
  className?: string;
  ariaLabel?: string;
}

const SIZE_CONFIG = {
  badge: {
    dim: 68,
    radius: 27,
    stroke: 4,
    levelText: 'text-lg',
    percentText: 'text-[8px]',
    prefixText: 'text-[9px]',
  },
  xs: {
    dim: 88,
    radius: 36,
    stroke: 5,
    levelText: 'text-xl',
    percentText: 'text-[9px]',
    prefixText: 'text-[11px]',
  },
  sm: {
    dim: 112,
    radius: 46,
    stroke: 6,
    levelText: 'text-2xl',
    percentText: 'text-[10px]',
    prefixText: 'text-[11px]',
  },
  md: {
    dim: 148,
    radius: 62,
    stroke: 7,
    levelText: 'text-4xl',
    percentText: 'text-xs',
    prefixText: 'text-[11px]',
  },
  lg: {
    dim: 184,
    radius: 78,
    stroke: 8,
    levelText: 'text-5xl',
    percentText: 'text-sm',
    prefixText: 'text-[11px]',
  },
} as const;

export function LevelProgressRing({
  level,
  progressPercent,
  size = 'lg',
  showPercent = true,
  showLevelPrefix = true,
  displayMode = 'progress',
  tierLevel,
  className,
  ariaLabel,
}: LevelProgressRingProps) {
  const uid = useId().replace(/:/g, '');
  const reducedMotion = useReducedMotion();
  const config = SIZE_CONFIG[size];
  const { dim, radius, stroke, levelText, percentText, prefixText } = config;
  const tierTheme = tierLevel != null ? getLevelRingTierTheme(tierLevel) : null;
  const ringStroke = stroke + (tierTheme?.strokeBonus ?? 0);
  const center = dim / 2;
  const circumference = 2 * Math.PI * radius;
  const isEmblem = displayMode === 'emblem';
  const safePercent = isEmblem
    ? 100
    : Math.max(0, Math.min(100, progressPercent));
  const strokeOffset = circumference - (safePercent / 100) * circumference;
  const gradId = `level-ring-grad-${uid}`;
  const glowId = `level-ring-glow-${uid}`;
  const gradientStops = tierTheme?.gradient ?? ['#f9bc60', '#ffd089', '#34d399'];
  const resolvedAriaLabel =
    ariaLabel ??
    (isEmblem
      ? `Уровень ${level}`
      : `Уровень ${level}, прогресс ${safePercent} процентов`);

  return (
    <div
      className={cn('relative inline-flex shrink-0', className)}
      role={isEmblem ? 'img' : 'progressbar'}
      aria-valuenow={isEmblem ? undefined : safePercent}
      aria-valuemin={isEmblem ? undefined : 0}
      aria-valuemax={isEmblem ? undefined : 100}
      aria-label={resolvedAriaLabel}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-2xl',
          tierTheme?.auraClass ?? 'bg-[#f9bc60]/[0.07]',
          tierLevel === 20 && !reducedMotion && 'animate-pulse',
        )}
        aria-hidden
      />

      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="-rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStops[0]} />
            <stop offset="55%" stopColor={gradientStops[1]} />
            <stop offset="100%" stopColor={gradientStops[2]} />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={tierTheme?.trackStroke ?? 'rgba(255,255,255,0.1)'}
          strokeWidth={ringStroke}
        />

        <circle
          cx={center}
          cy={center}
          r={radius - ringStroke}
          fill={tierTheme?.innerFill ?? 'rgba(0,30,29,0.55)'}
        />

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={ringStroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          filter={`url(#${glowId})`}
          initial={
            reducedMotion
              ? { strokeDashoffset: strokeOffset }
              : { strokeDashoffset: circumference }
          }
          animate={{ strokeDashoffset: strokeOffset }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
          }
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLevelPrefix ? (
          <span
            className={cn(
              'font-medium tracking-wide text-[#abd1c6]/70',
              prefixText,
            )}
          >
            Ур.
          </span>
        ) : null}
        <span
          className={cn(
            'font-bold tabular-nums leading-none tracking-tight',
            isEmblem && tierLevel != null
              ? LEVEL_BADGE_TEXT_CLASS
              : 'text-[#fffffe]',
            showLevelPrefix ? '-mt-0.5' : '',
            levelText,
          )}
        >
          {level}
        </span>
        {showPercent && safePercent < 100 ? (
          <span
            className={cn(
              'mt-1 font-semibold tabular-nums text-[#f9bc60]',
              percentText,
            )}
          >
            {safePercent}%
          </span>
        ) : showPercent && safePercent >= 100 ? (
          <span className={cn('mt-1 font-medium text-emerald-400', percentText)}>
            MAX
          </span>
        ) : null}
      </div>
    </div>
  );
}
