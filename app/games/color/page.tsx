import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { getColorConflictPlayerStats } from '@/lib/games/colorConflict';
import ColorConflictPageClient from './_components/ColorConflictPageClient';

export default async function ColorConflictPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/color',
        modal: 'auth/signup',
      }),
    );
  }

  const [wallet, stats] = await Promise.all([
    computeGoodDeedBonusWallet(session.uid),
    getColorConflictPlayerStats(session.uid),
  ]);

  return (
    <ColorConflictPageClient
      initialBalance={wallet.availableBonuses}
      initialDailyAttemptsUsed={stats.dailyAttemptsUsed}
      initialPurchasedAttemptsAvailable={stats.purchasedAttemptsAvailable}
      initialDailyAttemptPurchasesUsed={stats.dailyAttemptPurchasesUsed}
    />
  );
}
