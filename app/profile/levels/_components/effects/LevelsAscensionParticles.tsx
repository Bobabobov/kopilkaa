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

const PARTICLE_COUNT = 24;

function createParticleSpecs(): ParticleSpec[] {
  const viewportEstimatePx = 900;

  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const speedPxPerSec = 8 + Math.random() * 12;
    const duration = (viewportEstimatePx * 1.2) / speedPxPerSec;

    return {
      id,
      left: Math.random() * 100,
      size: Math.random() > 0.5 ? 2 : 1,
      maxOpacity: 0.08 + Math.random() * 0.18,
      duration,
      delay: Math.random() * duration,
      driftX: (Math.random() - 0.5) * 24,
    };
  });
}

interface LevelsAscensionParticlesProps {
  enabled: boolean;
}

export function LevelsAscensionParticles({
  enabled,
}: LevelsAscensionParticlesProps) {
  const particles = useMemo(() => createParticleSpecs(), []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute bottom-0 rounded-full bg-[#f9bc60]"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: '110%', opacity: 0, x: 0 }}
          animate={{
            y: '-15%',
            opacity: [0, particle.maxOpacity, particle.maxOpacity, 0],
            x: particle.driftX,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
