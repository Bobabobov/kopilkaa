'use client';

import { motion } from 'framer-motion';
import {
  COLOR_CONFLICT_DIFFICULTIES,
  type ColorConflictDifficulty,
} from '@/lib/games/colorConflict';
import { cn } from '@/lib/utils';

const DIFFICULTY_ORDER: ColorConflictDifficulty[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_HINTS: Record<ColorConflictDifficulty, string> = {
  easy: '5 раундов · базовые цвета · нажми цвет надписи',
  medium: '10 раундов · слово и краска не совпадают',
  hard: '15 раундов · минимум времени · одна ошибка = конец',
};

const DIFFICULTY_STYLES: Record<
  ColorConflictDifficulty,
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
      'border-violet-500/40 bg-violet-950/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
    idle: 'border-zinc-800 text-zinc-400 hover:border-violet-500/20 hover:text-zinc-200',
  },
};

interface ColorConflictDifficultyPickerProps {
  difficulty: ColorConflictDifficulty;
  onChange: (difficulty: ColorConflictDifficulty) => void;
  disabled?: boolean;
}

export function ColorConflictDifficultyPicker({
  difficulty,
  onChange,
  disabled = false,
}: ColorConflictDifficultyPickerProps) {
  const activeConfig = COLOR_CONFLICT_DIFFICULTIES[difficulty];
  const netProfit = activeConfig.reward - activeConfig.cost;

  return (
    <div className='space-y-3'>
      <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500'>
        Уровень сложности
      </p>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1'>
        {DIFFICULTY_ORDER.map((level) => {
          const config = COLOR_CONFLICT_DIFFICULTIES[level];
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
        {DIFFICULTY_HINTS[difficulty]} · серия {activeConfig.seriesTarget} ·{' '}
        {(activeConfig.timeLimitMs / 1000).toFixed(1)} с на раунд
      </motion.p>
    </div>
  );
}
