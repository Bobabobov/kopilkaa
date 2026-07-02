'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { BonusGeneratorPhase } from './BonusGeneratorVisual';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';

interface BonusGeneratorAmbientProps {
  phase: BonusGeneratorPhase;
  resultLabel?: BonusGeneratorRunResult['label'] | null;
  className?: string;
}

const PARTICLE_COUNT = 12;

function getGlowClass(
  phase: BonusGeneratorPhase,
  resultLabel?: BonusGeneratorRunResult['label'] | null,
): string {
  if (phase === 'result' && resultLabel === 'mega') {
    return 'from-[#f9bc60]/45 via-[#f9bc60]/15 to-transparent';
  }
  if (phase === 'result' && resultLabel && ['boost', 'super'].includes(resultLabel)) {
    return 'from-[#f9bc60]/30 via-[#e8a84a]/10 to-transparent';
  }
  if (phase === 'running') {
    return 'from-[#abd1c6]/28 via-[#f9bc60]/14 to-transparent';
  }
  return 'from-[#abd1c6]/10 via-[#004643]/5 to-transparent';
}

export function BonusGeneratorAmbient({
  phase,
  resultLabel = null,
  className,
}: BonusGeneratorAmbientProps) {
  const reducedMotion = useReducedMotion();
  const isRunning = phase === 'running';
  const isResult = phase === 'result';

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 34 + (index % 3) * 10;
        return {
          id: index,
          left: 50 + Math.cos(angle) * radius * 0.55,
          top: 50 + Math.sin(angle) * radius * 0.5,
          delay: index * 0.16,
        };
      }),
    [],
  );

  if (reducedMotion) {
    return (
      <div
        className={cn(
          'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
          className,
        )}
        aria-hidden
      >
        <div
          className={cn(
            'absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-gradient-to-b',
            getGlowClass(phase, resultLabel),
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-52 bg-gradient-to-b transition-opacity duration-700',
          getGlowClass(phase, resultLabel),
          isRunning || isResult ? 'opacity-100' : 'opacity-65',
        )}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className='absolute h-1 w-1 rounded-full bg-[#f9bc60]/80'
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            opacity: isRunning ? [0.1, 0.85, 0.1] : [0.05, 0.35, 0.05],
            scale: isRunning ? [0.6, 1.4, 0.6] : [0.8, 1, 0.8],
          }}
          transition={{
            duration: isRunning ? 0.85 : 2.8,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {isRunning && (
        <>
          <motion.div
            className='absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-[#f9bc60]/60 to-transparent'
            animate={{ y: [-64, 64], opacity: [0, 0.75, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className='absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9bc60]/12 blur-2xl'
            animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
    </div>
  );
}
