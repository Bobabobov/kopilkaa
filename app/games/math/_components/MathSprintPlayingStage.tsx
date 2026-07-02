'use client';

import { motion } from 'framer-motion';
import { TIME_LIMIT_MS, type MathSprintDifficulty } from '@/lib/games/shared/mathSprint';
import { cn } from '@/lib/utils';
import { MathSprintDifficultyBadge } from './MathSprintDifficultyPicker';

interface AnswerFeedback {
  value: number;
  isCorrect: boolean;
}

interface MathSprintPlayingStageProps {
  difficulty: MathSprintDifficulty;
  questionText: string;
  options: number[];
  timeLeftMs: number;
  isRoundReady: boolean;
  isSubmitting: boolean;
  answerFeedback: AnswerFeedback | null;
  onAnswer: (value: number) => void;
}

export function MathSprintPlayingStage({
  difficulty,
  questionText,
  options,
  timeLeftMs,
  isRoundReady,
  isSubmitting,
  answerFeedback,
  onAnswer,
}: MathSprintPlayingStageProps) {
  const progressPercent = isRoundReady
    ? Math.max(0, Math.min(100, (timeLeftMs / TIME_LIMIT_MS) * 100))
    : 100;
  const isUrgent = progressPercent <= 35;

  return (
    <div className='flex flex-1 flex-col justify-between gap-6'>
      <div className='flex flex-col items-center justify-center py-4'>
        <div className='mb-4 flex flex-col items-center gap-2'>
          <MathSprintDifficultyBadge difficulty={difficulty} />
          <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600'>
            // compute_target
          </p>
        </div>
        <motion.p
          key={questionText}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className='font-mono text-4xl tracking-wider text-emerald-400 drop-shadow-[0_0_10px_#10b981] filter sm:text-5xl'
        >
          {questionText}
        </motion.p>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between font-mono text-xs text-zinc-600'>
          <span>timer_sync</span>
          <span
            className={cn(
              'tabular-nums',
              !isRoundReady
                ? 'text-violet-400'
                : isUrgent
                  ? 'text-red-400'
                  : 'text-emerald-400',
            )}
          >
            {!isRoundReady
              ? 'Старт…'
              : `${(timeLeftMs / 1000).toFixed(1)}s`}
          </span>
        </div>
        <div className='relative h-1 overflow-hidden rounded-full bg-zinc-800/60'>
          <motion.div
            className={cn(
              'h-full transform-gpu rounded-full will-change-transform',
              isUrgent
                ? 'bg-red-400 shadow-[0_0_15px_#f87171]'
                : 'bg-emerald-400 shadow-[0_0_15px_#10b981]',
            )}
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {options.map((option, index) => {
          const isFeedbackTarget =
            answerFeedback !== null && answerFeedback.value === option;
          const flashCorrect = isFeedbackTarget && answerFeedback.isCorrect;
          const flashWrong = isFeedbackTarget && !answerFeedback.isCorrect;

          return (
            <motion.button
              key={`${option}-${index}`}
              type='button'
              disabled={isSubmitting || !isRoundReady}
              whileHover={isSubmitting || !isRoundReady ? undefined : { scale: 1.02 }}
              whileTap={isSubmitting || !isRoundReady ? undefined : { scale: 0.95 }}
              onClick={() => onAnswer(option)}
              className={cn(
                'transform-gpu rounded-xl border border-zinc-800 bg-zinc-950/80 py-4 font-mono text-xl text-zinc-200 transition-all will-change-transform',
                'hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.08)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                flashCorrect &&
                  'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]',
                flashWrong &&
                  'border-red-500/50 bg-red-950/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
              )}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
