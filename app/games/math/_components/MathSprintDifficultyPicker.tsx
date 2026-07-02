'use client';

import { motion } from 'framer-motion';
import {
  MATH_SPRINT_DIFFICULTIES,
  TIME_LIMIT_MS,
  type MathSprintDifficulty,
} from '@/lib/games/mathSprint';
import { cn } from '@/lib/utils';

const DIFFICULTY_ORDER: MathSprintDifficulty[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_HINTS: Record<MathSprintDifficulty, string> = {
  easy: 'До 42 в +/− · табличное × 4–10',
  medium: 'Двузначные +/− · × до 17×12 · ÷ без остатка',
  hard: 'Сотни в +/− · × до 49×12 · крупное ÷',
};

const DIFFICULTY_STYLES: Record<
  MathSprintDifficulty,
  { active: string; idle: string }
> = {
  easy: {
    active:
      'border-emerald-500/40 bg-emerald-950/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    idle: 'border-zinc-800 text-zinc-400 hover:border-emerald-500/20 hover:text-zinc-200',
  },
  medium: {
    active:
      'border-orange-500/40 bg-orange-950/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    idle: 'border-zinc-800 text-zinc-400 hover:border-orange-500/20 hover:text-zinc-200',
  },
  hard: {
    active:
      'border-red-500/30 bg-red-950/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    idle: 'border-zinc-800 text-zinc-400 hover:border-red-500/20 hover:text-zinc-200',
  },
};

const DIFFICULTY_BADGE_STYLES: Record<MathSprintDifficulty, string> = {
  easy: 'border-emerald-500/35 bg-emerald-950/60 text-emerald-400',
  medium: 'border-orange-500/35 bg-orange-950/50 text-orange-400',
  hard: 'border-red-500/30 bg-red-950/50 text-red-400',
};

interface MathSprintDifficultyBadgeProps {
  difficulty: MathSprintDifficulty;
  className?: string;
}

export function MathSprintDifficultyBadge({
  difficulty,
  className,
}: MathSprintDifficultyBadgeProps) {
  const config = MATH_SPRINT_DIFFICULTIES[difficulty];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]',
        DIFFICULTY_BADGE_STYLES[difficulty],
        className,
      )}
    >
      {config.label}
    </span>
  );
}

interface MathSprintDifficultyPickerProps {
  difficulty: MathSprintDifficulty;
  onChange: (difficulty: MathSprintDifficulty) => void;
  disabled?: boolean;
}

export function MathSprintDifficultyPicker({
  difficulty,
  onChange,
  disabled = false,
}: MathSprintDifficultyPickerProps) {
  const activeConfig = MATH_SPRINT_DIFFICULTIES[difficulty];
  const netProfit = activeConfig.reward - activeConfig.cost;

  return (
    <div className='space-y-3'>
      <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500'>
        Уровень сложности
      </p>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1'>
        {DIFFICULTY_ORDER.map((level) => {
          const config = MATH_SPRINT_DIFFICULTIES[level];
          const isActive = level === difficulty;
          const styles = DIFFICULTY_STYLES[level];

          return (
            <motion.button
              key={level}
              type='button'
              disabled={disabled}
              onClick={() => onChange(level)}
              whileTap={disabled ? undefined : { scale: 0.97 }}
              className={cn(
                'transform-gpu rounded-xl border px-4 py-3 text-left transition-all will-change-transform',
                'border-b-[3px] active:border-b active:translate-y-[2px]',
                disabled && 'cursor-not-allowed opacity-50',
                isActive ? styles.active : styles.idle,
              )}
            >
              <span className='block text-sm font-bold tracking-wide'>
                {config.label}
              </span>
              <span
                className={cn(
                  'mt-0.5 block font-mono text-xs',
                  isActive ? 'opacity-90' : 'text-zinc-600',
                )}
              >
                {config.cost} → +{config.reward}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        key={difficulty}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-2.5 text-xs leading-relaxed text-zinc-400'
      >
        <span className='font-mono text-zinc-300'>
          {activeConfig.cost} бонусов → +{activeConfig.reward}
        </span>
        <span className='text-emerald-500/80'> (+{netProfit} чистыми)</span>
        <br />
        {DIFFICULTY_HINTS[difficulty]} · {(TIME_LIMIT_MS / 1000).toFixed(0)} с
        на ответ
      </motion.p>
    </div>
  );
}
