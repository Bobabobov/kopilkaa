'use client';

import { useMemo } from 'react';
import Particles, {
  ParticlesProvider,
  useParticlesProvider,
} from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { useReducedMotion } from 'framer-motion';
import type { BonusGeneratorPhase } from './BonusGeneratorVisual';

const PARTICLES_ID = 'bonus-generator-particles';

interface BonusGeneratorParticlesProps {
  phase: BonusGeneratorPhase;
}

function BonusGeneratorParticlesCanvas({ phase }: BonusGeneratorParticlesProps) {
  const { loaded } = useParticlesProvider();

  const options = useMemo<ISourceOptions>(() => {
    const isRunning = phase === 'running';
    const isResult = phase === 'result';

    return {
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: 'transparent' } },
      particles: {
        number: {
          value: isRunning ? 58 : isResult ? 38 : 24,
          density: { enable: true, width: 520, height: 420 },
        },
        color: { value: ['#f9bc60', '#abd1c6', '#fffffe'] },
        opacity: {
          value: { min: 0.08, max: isRunning ? 0.72 : 0.42 },
          animation: {
            enable: true,
            speed: isRunning ? 1.4 : 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 0.6, max: isRunning ? 2.8 : 1.8 },
        },
        move: {
          enable: true,
          speed: isRunning ? 1.8 : 0.55,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: {
          enable: isRunning,
          distance: 108,
          color: '#abd1c6',
          opacity: 0.14,
          width: 0.8,
        },
        shape: { type: 'circle' },
      },
      interactivity: {
        detectsOn: 'canvas',
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
    };
  }, [phase]);

  if (!loaded) {
    return null;
  }

  return (
    <Particles
      id={PARTICLES_ID}
      className='pointer-events-none absolute inset-0 z-0 [&_canvas]:pointer-events-none'
      style={{ pointerEvents: 'none' }}
      options={options}
    />
  );
}

export function BonusGeneratorParticles({ phase }: BonusGeneratorParticlesProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return null;
  }

  return (
    <ParticlesProvider init={loadSlim}>
      <BonusGeneratorParticlesCanvas phase={phase} />
    </ParticlesProvider>
  );
}
