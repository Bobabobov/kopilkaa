'use client';

import { motion } from 'framer-motion';
import { formatExperience } from '@/lib/format';
import type { UserLevelProgress } from '@/lib/userLevel';
import { resolveTierLevel } from '@/lib/level-config';
import { LevelProgressRing } from '@/components/profile/LevelProgressRing';

interface LevelsHeroProps {
  userLevel: UserLevelProgress;
}

export function LevelsHero({ userLevel }: LevelsHeroProps) {
  const { level, progressPercent, nextLevel, xpToNextLevel } = userLevel;

  return (
    <div className="relative overflow-hidden px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,188,96,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <LevelProgressRing
            level={level}
            progressPercent={progressPercent}
            size="lg"
            tierLevel={resolveTierLevel(level)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Система{' '}
            <span className="bg-gradient-to-r from-[#f9bc60] to-[#34d399] bg-clip-text text-transparent">
              уровней
            </span>
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-[#abd1c6]/80 sm:text-lg">
            Бонусы → опыт → уровень. Чем выше уровень — тем больше лимит
            гонорара и привилегий.
          </p>
          {xpToNextLevel > 0 ? (
            <p className="mt-4 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-[#abd1c6]">
              До уровня{' '}
              <span className="mx-1.5 font-semibold text-[#f9bc60]">
                {nextLevel}
              </span>
              осталось{' '}
              <span className="ml-1 font-semibold text-[#fffffe]">
                {formatExperience(xpToNextLevel)} опыта
              </span>
            </p>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
