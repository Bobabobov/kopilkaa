'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import './coinFrameAnimation.css';

export const COIN_FRAME_SRCS = Array.from(
  { length: 6 },
  (_, index) => `/coin/co/${index + 1}.png`,
) as readonly string[];

type Props = {
  className?: string;
  imageClassName?: string;
  alt?: string;
};

export function CoinFrameAnimation({
  className,
  imageClassName,
  alt = '',
}: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'coin-frame-root relative h-10 w-10 shrink-0 drop-shadow-[0_4px_14px_rgba(249,188,96,0.35)]',
        className,
      )}
      aria-hidden={alt === '' ? true : undefined}
    >
      {COIN_FRAME_SRCS.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : ''}
          decoding='async'
          draggable={false}
          className={cn(
            'coin-frame-layer',
            !reducedMotion && `coin-frame-layer--${index}`,
            reducedMotion && index === 0 && 'opacity-100',
            imageClassName,
          )}
        />
      ))}
    </div>
  );
}
