'use client';

import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LEVEL_PATH_MILESTONES,
  getLevelMilestoneDetails,
} from '@/lib/level-config';
import { ProfileLevelMilestonePanel } from './ProfileLevelMilestonePanel';

interface ProfileLevelRoadmapProps {
  currentLevel: number;
  availableBonuses?: number;
  hideDetailWhen?: (level: number) => boolean;
  mode?: 'profile' | 'guide';
  className?: string;
}

export function ProfileLevelRoadmap({
  currentLevel,
  availableBonuses = 0,
  hideDetailWhen,
  mode = 'profile',
  className,
}: ProfileLevelRoadmapProps) {
  const milestones = getLevelMilestoneDetails();
  const defaultSelected =
    LEVEL_PATH_MILESTONES.find((level) => level >= currentLevel) ??
    LEVEL_PATH_MILESTONES[LEVEL_PATH_MILESTONES.length - 1];
  const [selectedLevel, setSelectedLevel] = useState<number>(defaultSelected);

  const selectedDetail =
    milestones.find((item) => item.level === selectedLevel) ?? milestones[0];

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className="relative -mx-1 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Вехи пути уровней"
      >
        <div className="flex min-w-max items-center gap-1 sm:gap-2">
          {milestones.map((item, index) => {
            const isSelected = selectedLevel === item.level;
            const isUnlocked = currentLevel >= item.level;
            const isCurrent = currentLevel === item.level;
            const isLast = index === milestones.length - 1;

            return (
              <div key={item.level} className="flex items-center">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`milestone-panel-${item.level}`}
                  id={`milestone-tab-${item.level}`}
                  onClick={() => setSelectedLevel(item.level)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors sm:px-3',
                    isSelected
                      ? 'bg-[#f9bc60]/12 ring-1 ring-[#f9bc60]/35'
                      : 'hover:bg-white/[0.04]',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums',
                      isCurrent &&
                        'border-[#f9bc60] bg-[#f9bc60]/20 text-[#fffffe] shadow-[0_0_14px_rgba(249,188,96,0.3)]',
                      !isCurrent &&
                        isUnlocked &&
                        !item.inDevelopment &&
                        'border-[#abd1c6]/50 bg-[#abd1c6]/15 text-[#abd1c6]',
                      !isUnlocked &&
                        'border-white/10 bg-black/25 text-[#94a1b2]/70',
                      item.inDevelopment &&
                        !isCurrent &&
                        'border-dashed border-white/15',
                    )}
                  >
                    {isUnlocked && !item.inDevelopment ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-semibold sm:text-xs',
                      isSelected ? 'text-[#f9bc60]' : 'text-[#94a1b2]',
                    )}
                  >
                    Ур. {item.level}
                  </span>
                </button>

                {!isLast && (
                  <span
                    className={cn(
                      'mx-0.5 h-px w-4 shrink-0 sm:w-6',
                      currentLevel >= milestones[index + 1].level
                        ? 'bg-[#abd1c6]/40'
                        : 'bg-white/10',
                    )}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDetail &&
        !(hideDetailWhen?.(selectedDetail.level) ?? false) && (
        <div
          id={`milestone-panel-${selectedDetail.level}`}
          role="tabpanel"
          aria-labelledby={`milestone-tab-${selectedDetail.level}`}
        >
          <ProfileLevelMilestonePanel
            detail={selectedDetail}
            currentLevel={currentLevel}
            availableBonuses={availableBonuses}
            mode={mode}
            className="scroll-mt-4"
          />
        </div>
      )}
    </div>
  );
}
