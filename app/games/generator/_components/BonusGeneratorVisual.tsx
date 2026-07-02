'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';
import { BonusGeneratorEnergyStreams } from './BonusGeneratorEnergyStreams';
import { BonusGeneratorCoreAction } from './BonusGeneratorCoreAction';
import { BonusGeneratorResultPanel } from './BonusGeneratorResultPanel';

export type BonusGeneratorPhase = 'idle' | 'running' | 'result';

interface BonusGeneratorVisualProps {
  phase: BonusGeneratorPhase;
  isMegaBonus: boolean;
  result?: BonusGeneratorRunResult | null;
  resultLabel?: BonusGeneratorRunResult['label'] | null;
  canActivate?: boolean;
  onActivate?: () => void;
  synthesisProgress?: number;
}

function getCoreAccent(
  phase: BonusGeneratorPhase,
  isMegaBonus: boolean,
  resultLabel?: BonusGeneratorRunResult['label'] | null,
): string {
  if (phase === 'result' && isMegaBonus) {
    return 'border-[#f9bc60]/80 shadow-[0_0_60px_rgba(249,188,96,0.45)]';
  }
  if (phase === 'result' && resultLabel && ['boost', 'super'].includes(resultLabel)) {
    return 'border-[#f9bc60]/55 shadow-[0_0_40px_rgba(249,188,96,0.28)]';
  }
  if (phase === 'running') {
    return 'border-[#abd1c6]/50 shadow-[0_0_40px_rgba(171,209,198,0.25)]';
  }
  return 'border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.35)]';
}

export function BonusGeneratorVisual({
  phase,
  isMegaBonus,
  result = null,
  resultLabel = null,
  canActivate = false,
  onActivate,
  synthesisProgress = 0,
}: BonusGeneratorVisualProps) {
  const reducedMotion = useReducedMotion();
  const isRunning = phase === 'running';
  const isResult = phase === 'result';
  const isIdle = phase === 'idle';
  const showMega = isResult && isMegaBonus;
  const coreInteractive = Boolean(canActivate && onActivate && !isRunning && !isResult);
  const fillHeight = isRunning
    ? Math.max(0, Math.min(100, synthesisProgress))
    : isResult
      ? 100
      : 12;

  const orbitNodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return {
          id: index,
          x: Math.cos(angle) * 100,
          y: Math.sin(angle) * 100,
          delay: index * 0.1,
        };
      }),
    [],
  );

  return (
    <div className='relative mx-auto flex w-full max-w-md flex-col items-center'>
      <div
        className={cn(
          'relative w-full',
          isResult
            ? 'flex flex-col items-center px-2 py-3 sm:px-4'
            : 'flex h-[20rem] items-center justify-center sm:h-[22rem]',
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute rounded-3xl border border-[#abd1c6]/12 bg-[#001e1d]/30',
            isResult
              ? 'inset-x-0 inset-y-0'
              : 'left-1/2 top-1/2 h-[15.5rem] w-[15.5rem] -translate-x-1/2 -translate-y-1/2 sm:h-[16.5rem] sm:w-[16.5rem]',
          )}
        />

        <span
          className={cn(
            'pointer-events-none absolute h-5 w-5 border-l-2 border-t-2 border-[#abd1c6]/35',
            isResult ? 'left-3 top-3 sm:left-4 sm:top-4' : 'left-[12%] top-[18%]',
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute h-5 w-5 border-r-2 border-t-2 border-[#abd1c6]/35',
            isResult ? 'right-3 top-3 sm:right-4 sm:top-4' : 'right-[12%] top-[18%]',
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute h-5 w-5 border-b-2 border-l-2 border-[#abd1c6]/35',
            isResult ? 'bottom-3 left-3 sm:bottom-4 sm:left-4' : 'bottom-[18%] left-[12%]',
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute h-5 w-5 border-b-2 border-r-2 border-[#abd1c6]/35',
            isResult ? 'bottom-3 right-3 sm:bottom-4 sm:right-4' : 'bottom-[18%] right-[12%]',
          )}
        />

        <div
          className={cn(
            'relative flex w-full items-center justify-center',
            isResult ? 'h-[10rem] sm:h-[11rem]' : 'h-full',
          )}
        >
        <motion.div
          className={cn(
            'pointer-events-none absolute rounded-full border border-dashed border-[#abd1c6]/18',
            isResult ? 'h-[8.5rem] w-[8.5rem]' : 'h-[14rem] w-[14rem]',
          )}
          animate={
            reducedMotion
              ? undefined
              : { rotate: isRunning ? 360 : isIdle ? 360 : 0 }
          }
          transition={{
            duration: isRunning ? 4.5 : 40,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <BonusGeneratorEnergyStreams active={isRunning} />

        {!reducedMotion && (
          <motion.div
            className='pointer-events-none absolute inset-0'
            animate={{ rotate: isRunning ? -360 : 0 }}
            transition={{
              duration: isRunning ? 3.2 : 0,
              repeat: isRunning ? Infinity : 0,
              ease: 'linear',
            }}
          >
            {orbitNodes.map((node) => (
              <motion.span
                key={node.id}
                className='absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#f9bc60]/80 shadow-[0_0_6px_rgba(249,188,96,0.5)]'
                style={{ marginLeft: -3, marginTop: -3 }}
                animate={
                  isRunning
                    ? {
                        x: [node.x, node.x * 0.2, node.x],
                        y: [node.y, node.y * 0.2, node.y],
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.3, 0.8],
                      }
                    : { x: node.x, y: node.y, opacity: isResult ? 0.7 : 0.3, scale: 1 }
                }
                transition={{
                  duration: 1.1,
                  repeat: isRunning ? Infinity : 0,
                  delay: node.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}

        {showMega && !reducedMotion && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.span
                key={index}
                className='pointer-events-none absolute left-1/2 top-1/2 h-px w-28 origin-left bg-gradient-to-r from-[#f9bc60]/90 to-transparent'
                style={{ rotate: `${(index / 8) * 360}deg` }}
                animate={{ opacity: [0.2, 0.85, 0.2], scaleX: [0.4, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}

        <motion.div
          role={coreInteractive ? 'button' : undefined}
          tabIndex={coreInteractive ? 0 : undefined}
          aria-label={coreInteractive ? 'Запустить генератор бонусов' : undefined}
          aria-disabled={coreInteractive ? undefined : true}
          onClick={(event) => {
            event.stopPropagation();
            if (coreInteractive) {
              onActivate?.();
            }
          }}
          onKeyDown={(event) => {
            if (!coreInteractive) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              onActivate?.();
            }
          }}
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-full border',
            isResult ? 'h-24 w-24' : 'h-36 w-36 sm:h-40 sm:w-40',
            getCoreAccent(phase, isMegaBonus, resultLabel),
            coreInteractive &&
              'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]',
          )}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: isRunning ? [1, 1.04, 1] : showMega ? [1, 1.06, 1] : 1,
                }
          }
          transition={{
            duration: isRunning ? 0.7 : 1.8,
            repeat: isRunning || showMega ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <div className='absolute inset-0 bg-[linear-gradient(165deg,rgba(0,30,29,0.95)_0%,rgba(0,70,67,0.9)_100%)]' />

          <motion.div
            className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f9bc60]/55 via-[#f9bc60]/25 to-transparent'
            animate={{ height: `${fillHeight}%` }}
            transition={{ duration: isRunning ? 0.35 : 0.5, ease: 'easeOut' }}
          />

          {isRunning && !reducedMotion && (
            <motion.div
              className='pointer-events-none absolute inset-0 opacity-40'
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(171,209,198,0.12) 3px, rgba(171,209,198,0.12) 4px)',
              }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_50%)]' />

          <motion.div
            className='relative z-10 flex items-center justify-center'
            key={`${phase}-${resultLabel ?? 'idle'}`}
            initial={isResult ? { scale: 0.5, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          >
            {showMega ? (
              <LucideIcons.Crown size='2xl' className='text-[#f9bc60] drop-shadow-[0_0_14px_rgba(249,188,96,0.7)]' />
            ) : isResult && resultLabel === 'none' ? (
              <LucideIcons.Minus size='xl' className='text-[#abd1c6]' />
            ) : isResult && resultLabel && ['boost', 'super'].includes(resultLabel) ? (
              <LucideIcons.Zap size='xl' className='text-[#f9bc60] drop-shadow-[0_0_12px_rgba(249,188,96,0.55)]' />
            ) : isRunning ? (
              <LucideIcons.Loader2 size='xl' className='animate-spin text-[#f9bc60]' />
            ) : (
              <LucideIcons.Sparkles
                size='xl'
                className='text-[#f9bc60] drop-shadow-[0_0_10px_rgba(249,188,96,0.45)]'
              />
            )}
          </motion.div>
        </motion.div>

        {isRunning && !reducedMotion && (
          <motion.div
            className={cn(
              'pointer-events-none absolute rounded-full border border-[#f9bc60]/30',
              isResult ? 'h-[9rem] w-[9rem]' : 'h-[14.5rem] w-[14.5rem]',
            )}
            animate={{ scale: [0.92, 1.08], opacity: [0.45, 0] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        </div>

        {isResult && result && (
          <div className='relative z-10 w-full px-1 pb-1 sm:px-2'>
            <BonusGeneratorResultPanel result={result} variant='core' />
          </div>
        )}
      </div>

      {onActivate && (
        <BonusGeneratorCoreAction
          phase={phase}
          canActivate={canActivate}
          onActivate={onActivate}
        />
      )}
    </div>
  );
}
