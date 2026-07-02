'use client';

import Link from 'next/link';
import { LevelsShell } from './LevelsShell';
import { LevelsHero } from './LevelsHero';
import { LevelsQuickNav } from './LevelsQuickNav';
import { LevelsDashboard } from './LevelsDashboard';
import { LevelsAscensionPath } from './LevelsAscensionPath';
import { LevelsEarnSection } from './LevelsEarnSection';
import { LevelsChartsSection } from './LevelsChartsSection';
import { LevelsMilestoneCatalog } from './LevelsMilestoneCatalog';
import { LevelsHowItWorks } from './LevelsHowItWorks';
import { LevelsGuestGate } from './LevelsGuestGate';
import type { UserLevelProgress } from '@/lib/userLevel';

interface LevelsPageClientProps {
  isAuthenticated: boolean;
  availableBonuses?: number;
  userLevel?: UserLevelProgress;
}

export default function LevelsPageClient({
  isAuthenticated,
  availableBonuses = 0,
  userLevel,
}: LevelsPageClientProps) {
  if (!isAuthenticated || !userLevel) {
    return <LevelsGuestGate />;
  }

  return (
    <LevelsShell>
      <LevelsHero userLevel={userLevel} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 md:pb-16 lg:px-8">
        <LevelsQuickNav />

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          <LevelsDashboard
            userLevel={userLevel}
            availableBonuses={availableBonuses}
          />
          <LevelsAscensionPath currentLevel={userLevel.level} />
          <LevelsEarnSection />
          <LevelsChartsSection userLevel={userLevel} />
          <LevelsMilestoneCatalog currentLevel={userLevel.level} />
          <LevelsHowItWorks />

          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
            <Link
              href="/profile#profile-wallet"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f9bc60] via-amber-400 to-[#e8a545] px-8 font-mono text-xs font-bold uppercase tracking-widest text-[#001e1d] shadow-lg shadow-[#f9bc60]/25 transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto"
            >
              Вложить бонусы
            </Link>
            <Link
              href="/profile"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[#abd1c6]/25 bg-[#004643]/50 px-8 font-mono text-xs font-semibold uppercase tracking-widest text-[#abd1c6] transition-colors hover:border-[#f9bc60]/30 hover:text-[#f9bc60] sm:w-auto"
            >
              В профиль
            </Link>
          </div>
        </div>
      </div>
    </LevelsShell>
  );
}
