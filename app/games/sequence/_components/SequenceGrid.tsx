'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SequenceGridProps {
  activeIndex: number | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
  inputEnabled: boolean;
}

export function SequenceGrid({
  activeIndex,
  disabled,
  onCellClick,
  inputEnabled,
}: SequenceGridProps) {
  return (
    <div
      className='mx-auto grid w-full max-w-md grid-cols-3 gap-3 sm:max-w-lg sm:gap-4'
      role='group'
      aria-label='Игровое поле 3 на 3'
    >
      {Array.from({ length: 9 }).map((_, index) => {
        const isActive = activeIndex === index;
        const isClickable = inputEnabled && !disabled;

        return (
          <motion.button
            key={index}
            type='button'
            disabled={!isClickable}
            onClick={() => onCellClick(index)}
            aria-label={`Клетка ${index + 1}`}
            animate={{
              scale: isActive ? 0.95 : 1,
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'transform-gpu aspect-square rounded-xl border transition-all duration-150 will-change-transform',
              'bg-emerald-950/20 border-emerald-500/10',
              isClickable &&
                'cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-950/35',
              !isClickable && 'cursor-default',
              isActive &&
                'border-emerald-400 bg-emerald-400 shadow-[0_0_35px_#10b981]',
              isActive &&
                index % 2 === 1 &&
                'border-orange-400 bg-orange-400 shadow-[0_0_35px_#fb923c]',
            )}
          />
        );
      })}
    </div>
  );
}
