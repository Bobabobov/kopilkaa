'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleSpec {
  id: number;
  left: number;
  size: number;
  maxOpacity: number;
  duration: number;
  delay: number;
  driftX: number;
}

const PARTICLE_COUNT = 30;

/** Скорость парения: 10–20 px/с при ~900px высоты viewport → ~45–90 с на цикл */
function createParticleSpecs(): ParticleSpec[] {
  const viewportEstimatePx = 900;

  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const speedPxPerSec = 10 + Math.random() * 10;
    const duration = (viewportEstimatePx * 1.15) / speedPxPerSec;

    return {
      id,
      left: Math.random() * 100,
      size: Math.random() > 0.45 ? 2 : 1,
      maxOpacity: 0.1 + Math.random() * 0.2,
      duration,
      delay: Math.random() * duration,
      driftX: (Math.random() - 0.5) * 30,
    };
  });
}

interface ParticlesBackgroundProps {
  enabled: boolean;
}

export function ParticlesBackground({ enabled }: ParticlesBackgroundProps) {
  const particles = useMemo(() => createParticleSpecs(), []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className='pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden'
      aria-hidden
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className='absolute bottom-0 rounded-full bg-emerald-400 transform-gpu will-change-transform'
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 3}px rgba(52, 211, 153, 0.35)`,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: '-115vh',
            x: particle.driftX,
            opacity: [0, particle.maxOpacity, particle.maxOpacity * 0.85, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.12, 0.72, 1],
          }}
        />
      ))}
    </div>
  );
}
