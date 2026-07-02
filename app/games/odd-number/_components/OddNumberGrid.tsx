'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { OddNumberCell } from '@/lib/games/shared/oddNumberSchulte';

interface OddNumberGridProps {
  cells: OddNumberCell[];
  disabled: boolean;
  completedValues: ReadonlySet<number>;
  wrongIndex: number | null;
  onCellClick: (index: number) => void;
}

export function OddNumberGrid({
  cells,
  disabled,
  completedValues,
  wrongIndex,
  onCellClick,
}: OddNumberGridProps) {
  return (
    <div
      className='mx-auto grid w-full max-w-sm grid-cols-4 gap-2 sm:max-w-md sm:gap-2.5'
      role='group'
      aria-label='Таблица Шульте 4 на 4'
    >
      {cells.map((cell) => {
        const isCompleted = completedValues.has(cell.value);
        const isWrong = wrongIndex === cell.index;
        const isActive = !disabled && !isCompleted && !isWrong;

        return (
          <motion.button
            key={cell.index}
            type='button'
            disabled={disabled || isCompleted}
            onClick={() => onCellClick(cell.index)}
            aria-label={`Число ${cell.value}${isCompleted ? ', пройдено' : ''}`}
            aria-disabled={isCompleted || undefined}
            animate={{
              scale: isCompleted ? 0.92 : 1,
              opacity: isCompleted ? 0.45 : 1,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            whileTap={isActive ? { scale: 0.94 } : undefined}
            className={cn(
              'transform-gpu aspect-square rounded-lg border font-mono text-lg font-bold will-change-transform sm:rounded-xl sm:text-xl',
              isActive &&
                'cursor-pointer border-sky-500/20 bg-sky-950/30 text-sky-100 hover:border-sky-400/45 hover:bg-sky-950/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]',
              isCompleted &&
                'pointer-events-none cursor-default border-zinc-700/90 bg-zinc-900 text-zinc-600 shadow-none',
              disabled && !isCompleted && !isWrong &&
                'cursor-default border-sky-500/15 bg-sky-950/25 text-sky-100/90',
              isWrong &&
                'border-red-400/70 bg-red-500/25 text-red-100 shadow-[0_0_24px_rgba(239,68,68,0.35)]',
            )}
          >
            {cell.value}
          </motion.button>
        );
      })}
    </div>
  );
}
