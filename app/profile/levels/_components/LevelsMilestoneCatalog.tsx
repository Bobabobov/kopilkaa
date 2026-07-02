'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Construction, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getLevelsHubMilestones } from '@/lib/userLevel/levelsHubData';
import { cn } from '@/lib/utils';
import { LevelsSectionHeader } from './LevelsSectionHeader';
import { LevelsMilestoneCard } from './LevelsMilestoneCard';

interface LevelsMilestoneCatalogProps {
  currentLevel: number;
}

export function LevelsMilestoneCatalog({
  currentLevel,
}: LevelsMilestoneCatalogProps) {
  const milestones = getLevelsHubMilestones();
  const defaultSelected =
    milestones.find((item) => item.level >= currentLevel)?.level ??
    milestones[0]?.level ??
    1;
  const [selectedLevel, setSelectedLevel] = useState(defaultSelected);

  const selected = milestones.find((m) => m.level === selectedLevel);
  const activeMilestones = milestones.filter((m) => !m.inDevelopment);
  const upcomingMilestones = milestones.filter((m) => m.inDevelopment);

  return (
    <motion.section
      id="levels-catalog"
      aria-label="Каталог уровней"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <LevelsSectionHeader
        kicker="Справочник"
        title="Вехи и привилегии"
        subtitle="Выберите уровень слева — справа откроется описание"
      />

      <Card
        variant="darkGlass"
        padding="none"
        className="overflow-hidden border-white/[0.06] bg-[#004643]/15 backdrop-blur-xl"
      >
        <div className="flex flex-col lg:min-h-[480px] lg:flex-row">
          {/* Список уровней */}
          <nav
            className="border-b border-white/[0.06] lg:w-[240px] lg:shrink-0 lg:border-b-0 lg:border-r xl:w-[260px]"
            aria-label="Список уровней"
          >
            <div className="p-2 lg:flex lg:h-full lg:flex-col lg:p-3">
              <p className="hidden px-2 pb-2 text-xs font-medium text-[#abd1c6]/45 lg:block">
                Активные · {activeMilestones.length}
              </p>

              <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {activeMilestones.map((item) => {
                  const isSelected = selectedLevel === item.level;
                  const isUnlocked = currentLevel >= item.level;
                  const isCurrent = currentLevel === item.level;

                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setSelectedLevel(item.level)}
                      className={cn(
                        'group flex min-w-[140px] shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:min-w-0 lg:w-full',
                        isSelected
                          ? 'bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
                          : 'hover:bg-white/[0.04]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums',
                          isCurrent &&
                            'bg-[#f9bc60] text-[#001e1d] shadow-[0_0_16px_rgba(249,188,96,0.35)]',
                          !isCurrent &&
                            isUnlocked &&
                            'bg-emerald-500/15 text-emerald-400',
                          !isUnlocked &&
                            'bg-white/[0.04] text-[#abd1c6]/35',
                        )}
                      >
                        {isUnlocked ? (
                          item.level
                        ) : (
                          <Lock className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block truncate text-sm font-medium',
                            isSelected ? 'text-[#fffffe]' : 'text-[#abd1c6]/80',
                          )}
                        >
                          {item.headline}
                        </span>
                        {item.maxApplicationAmount != null ? (
                          <span className="block text-xs tabular-nums text-[#abd1c6]/45">
                            до {item.maxApplicationAmount} ₽
                          </span>
                        ) : null}
                      </span>
                      {isCurrent ? (
                        <span
                          className="hidden h-2 w-2 shrink-0 rounded-full bg-[#f9bc60] shadow-[0_0_8px_#f9bc60] lg:block"
                          aria-hidden
                        />
                      ) : isUnlocked ? (
                        <Check className="hidden h-3.5 w-3.5 shrink-0 text-emerald-500/60 lg:block" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {upcomingMilestones.length > 0 ? (
                <div className="mt-2 border-t border-white/[0.06] pt-2 lg:mt-auto">
                  <p className="px-2 pb-1.5 text-[10px] font-medium text-[#abd1c6]/40">
                    В разработке
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-1 lg:flex-col lg:gap-1">
                    {upcomingMilestones.map((item) => {
                      const isSelected = selectedLevel === item.level;
                      return (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setSelectedLevel(item.level)}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors lg:w-full',
                            isSelected
                              ? 'bg-white/[0.06] text-[#abd1c6]'
                              : 'text-[#abd1c6]/40 hover:bg-white/[0.03] hover:text-[#abd1c6]/60',
                          )}
                        >
                          <Construction className="h-3.5 w-3.5 shrink-0" />
                          <span>Ур. {item.level}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          {/* Детали */}
          <div className="min-w-0 flex-1 bg-[#001e1d]/20">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.level}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <LevelsMilestoneCard
                    detail={selected}
                    currentLevel={currentLevel}
                    isCurrent={currentLevel === selected.level}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
