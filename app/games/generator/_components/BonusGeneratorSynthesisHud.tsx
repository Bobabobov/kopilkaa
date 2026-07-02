'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BonusGeneratorPhase } from './BonusGeneratorVisual';

interface BonusGeneratorSynthesisHudProps {
  phase: BonusGeneratorPhase;
  progress: number;
}

const SYNTHESIS_STEPS = [
  { threshold: 0, label: 'Инициализация модуля' },
  { threshold: 18, label: 'Резервирование бонусов' },
  { threshold: 42, label: 'Синтез ядра генератора' },
  { threshold: 68, label: 'Расчёт вознаграждения' },
  { threshold: 88, label: 'Фиксация в журнале' },
] as const;

function resolveStepLabel(phase: BonusGeneratorPhase, progress: number): string {
  if (phase === 'idle') return 'Готов к синтезу';
  if (phase === 'result') return 'Синтез завершён';

  let label = SYNTHESIS_STEPS[0].label;
  for (const step of SYNTHESIS_STEPS) {
    if (progress >= step.threshold) {
      label = step.label;
    }
  }
  return label;
}

export function BonusGeneratorSynthesisHud({
  phase,
  progress,
}: BonusGeneratorSynthesisHudProps) {
  const isRunning = phase === 'running';
  const isResult = phase === 'result';
  const displayProgress = Math.max(
    0,
    Math.min(100, isResult ? 100 : isRunning ? progress : 0),
  );
  const stepLabel = resolveStepLabel(phase, displayProgress);

  return (
    <div className='pointer-events-none relative z-10 mx-auto mt-6 w-full max-w-sm px-2'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <Badge
          variant={isResult ? 'success' : isRunning ? 'default' : 'secondary'}
          className={cn(isRunning && 'animate-pulse')}
        >
          {stepLabel}
        </Badge>
        <span className='text-xs font-medium tabular-nums text-[#abd1c6]'>
          {Math.round(displayProgress)}%
        </span>
      </div>

      <Progress value={displayProgress} className='h-2' />

      {isRunning && (
        <div className='mt-4 space-y-2 rounded-xl border border-white/[0.06] bg-black/20 p-3'>
          <Skeleton className='h-2 w-[92%]' />
          <Skeleton className='h-2 w-[78%]' />
          <Skeleton className='h-2 w-[85%]' />
        </div>
      )}
    </div>
  );
}
