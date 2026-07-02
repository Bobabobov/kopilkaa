'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BonusGeneratorEnergyStreamsProps {
  active: boolean;
}

const STREAM_COUNT = 6;

export function BonusGeneratorEnergyStreams({
  active,
}: BonusGeneratorEnergyStreamsProps) {
  const reducedMotion = useReducedMotion();

  const streams = useMemo(
    () =>
      Array.from({ length: STREAM_COUNT }, (_, index) => {
        const angle = (index / STREAM_COUNT) * 360;
        return { id: index, angle, delay: index * 0.12 };
      }),
    [],
  );

  if (reducedMotion) return null;

  return (
    <>
      {streams.map((stream) => (
        <motion.span
          key={stream.id}
          className='pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-20 origin-left rounded-full bg-gradient-to-r from-[#f9bc60] via-[#f9bc60]/60 to-transparent'
          style={{ rotate: `${stream.angle}deg` }}
          animate={
            active
              ? {
                  scaleX: [0.2, 1, 0.35],
                  opacity: [0.15, 0.95, 0.2],
                  x: [72, 8, 72],
                }
              : { scaleX: 0.45, opacity: 0.12, x: 56 }
          }
          transition={{
            duration: active ? 0.95 : 2.4,
            repeat: active ? Infinity : 0,
            delay: stream.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}
