'use client';

import { GamesBalanceStrip } from './GamesBalanceStrip';
import { GamesCatalog } from './GamesCatalog';
import { GamesDailyQuestsWidget } from './GamesDailyQuestsWidget';
import { GamesDevelopmentDisclaimer } from './GamesDevelopmentDisclaimer';
import { GamesGuestGate } from './GamesGuestGate';
import { GamesHero } from './GamesHero';
import { GamesHowItWorks } from './GamesHowItWorks';
import { GamesGlobalLeaderboards } from './GamesGlobalLeaderboards';
import { GamesLiveWinTicker } from './GamesLiveWinTicker';
import { GamesLobbyShell } from './GamesLobbyShell';

interface GamesPageClientProps {
  isAuthenticated: boolean;
  availableBonuses: number;
}

export default function GamesPageClient({
  isAuthenticated,
  availableBonuses,
}: GamesPageClientProps) {
  if (!isAuthenticated) {
    return <GamesGuestGate />;
  }

  return (
    <GamesLobbyShell>
      <GamesHero />

      <div className='mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12 md:pb-16 lg:px-8'>
        <GamesDevelopmentDisclaimer />

        <div className='mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-2 md:gap-6'>
          <GamesBalanceStrip availableBonuses={availableBonuses} />
          <GamesDailyQuestsWidget />
        </div>

        <GamesLiveWinTicker />
        <GamesGlobalLeaderboards />
        <GamesCatalog availableBonuses={availableBonuses} />
        <GamesHowItWorks />
      </div>
    </GamesLobbyShell>
  );
}
