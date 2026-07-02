'use client';

import { motion } from 'framer-motion';
import { Check, Construction, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MAX_ACTIVE_PROFILE_LEVEL, getLevelPathDetails } from '@/lib/level-config';
import { cn } from '@/lib/utils';
import { LevelsSectionHeader } from './LevelsSectionHeader';

interface LevelsAscensionPathProps {
  currentLevel: number;
}

export function LevelsAscensionPath({ currentLevel }: LevelsAscensionPathProps) {
  const nodes = getLevelPathDetails().filter((n) => !n.inDevelopment);
  const fillPercent = Math.min(
    100,
    Math.round(
      ((currentLevel - 1) / Math.max(1, MAX_ACTIVE_PROFILE_LEVEL - 1)) * 100,
    ),
  );

  return (
    <motion.section
      id="levels-path"
      aria-label="Путь восхождения"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <LevelsSectionHeader
        kicker="Карта"
        title="Путь восхождения"
        subtitle="Активные уровни платформы и лимиты гонорара"
      />

      <Card
        variant="darkGlass"
        padding="md"
        className="border-white/[0.06] bg-[#004643]/20 backdrop-blur-xl"
      >
        <div className="relative mb-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#abd1c6]/60 via-[#f9bc60] to-emerald-400"
            initial={{ width: 0 }}
            whileInView={{ width: `${fillPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-3">
          {nodes.map((node, index) => {
            const isUnlocked = currentLevel >= node.level;
            const isCurrent = currentLevel === node.level;

            return (
              <motion.div
                key={node.level}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className={cn(
                  'relative rounded-xl px-3.5 py-3.5 transition-colors sm:px-4',
                  isCurrent
                    ? 'bg-[#f9bc60]/10 ring-1 ring-[#f9bc60]/30'
                    : 'bg-white/[0.03]',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
                      isCurrent && 'bg-[#f9bc60]/20 text-[#f9bc60]',
                      !isCurrent &&
                        isUnlocked &&
                        'bg-emerald-500/15 text-emerald-400',
                      !isUnlocked && 'bg-white/[0.05] text-[#abd1c6]/35',
                    )}
                  >
                    {isUnlocked ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#fffffe]">
                      Ур. {node.level}
                    </p>
                    <p className="truncate text-xs text-[#abd1c6]/55">
                      {node.headline}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium tabular-nums text-[#f9bc60]">
                  до {node.maxApplicationAmount} ₽
                </p>
                {isCurrent ? (
                  <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide text-[#f9bc60]/80">
                    Вы здесь
                  </span>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-[#abd1c6]/50">
          <Construction className="h-3.5 w-3.5 shrink-0" />
          Уровни 10, 15 и 20 — в разработке
        </p>
      </Card>
    </motion.section>
  );
}
