'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GENERATOR_RUN_ANIMATION_MS } from '@/lib/games/bonusGenerator';
import { BonusGeneratorAmbient } from './BonusGeneratorAmbient';
import { BonusGeneratorParticles } from './BonusGeneratorParticles';
import { BonusGeneratorVisual, type BonusGeneratorPhase } from './BonusGeneratorVisual';
import { BonusGeneratorSynthesisHud } from './BonusGeneratorSynthesisHud';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface BonusGeneratorStageProps {
  phase: BonusGeneratorPhase;
  isMegaBonus: boolean;
  result?: BonusGeneratorRunResult | null;
  resultLabel?: BonusGeneratorRunResult['label'] | null;
  canActivate: boolean;
  onActivate: () => void;
}

export function BonusGeneratorStage({
  phase,
  isMegaBonus,
  result = null,
  resultLabel = null,
  canActivate,
  onActivate,
}: BonusGeneratorStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const rippleId = useRef(0);
  const runIdRef = useRef(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-8, 8]);
  const parallaxY = useTransform(springY, [-1, 1], [-6, 6]);

  useEffect(() => {
    if (phase === 'idle') {
      setSynthesisProgress(0);
      return;
    }

    if (phase === 'result') {
      setSynthesisProgress(100);
      return;
    }

    const runId = ++runIdRef.current;
    const start = performance.now();
    let frameId = 0;

    setSynthesisProgress(0);

    const tick = (now: number) => {
      if (runId !== runIdRef.current) return;

      const elapsed = Math.max(0, now - start);
      const next = Math.min(100, (elapsed / GENERATOR_RUN_ANIMATION_MS) * 100);
      setSynthesisProgress(next);
      if (next < 100) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => {
      runIdRef.current += 1;
      window.cancelAnimationFrame(frameId);
    };
  }, [phase]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      pointerX.set(nx);
      pointerY.set(ny);
    },
    [pointerX, pointerY],
  );

  const handlePointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const spawnRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 900);
  }, []);

  const handleStageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      spawnRipple(event);
    },
    [spawnRipple],
  );

  return (
    <div
      ref={stageRef}
      className='relative my-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-zinc-900/30 px-4 py-8 shadow-[0_0_25px_rgba(245,158,11,0.15)] backdrop-blur-md sm:px-8 sm:py-10'
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleStageClick}
      role='presentation'
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.07]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(171,209,198,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(171,209,198,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <BonusGeneratorParticles phase={phase} />
      <BonusGeneratorAmbient phase={phase} resultLabel={resultLabel} />

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className='pointer-events-none absolute rounded-full border border-[#f9bc60]/50 bg-[#f9bc60]/10'
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.7 }}
          animate={{ width: 220, height: 220, x: -110, y: -110, opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      ))}

      <motion.div className='relative z-20' style={{ x: parallaxX, y: parallaxY }}>
        <BonusGeneratorVisual
          phase={phase}
          isMegaBonus={isMegaBonus}
          result={result}
          resultLabel={resultLabel}
          canActivate={canActivate}
          onActivate={onActivate}
          synthesisProgress={synthesisProgress}
        />
      </motion.div>

      {phase !== 'result' && (
        <BonusGeneratorSynthesisHud phase={phase} progress={synthesisProgress} />
      )}
    </div>
  );
}
