import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { getOddNumberPlayerStats } from '@/lib/games/oddNumberSchulte';
import OddNumberPageClient from './_components/OddNumberPageClient';

export const dynamic = 'force-dynamic';

export default async function OddNumberPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/odd-number',
        modal: 'auth/signup',
      }),
    );
  }

  const [wallet, stats] = await Promise.all([
    computeGoodDeedBonusWallet(session.uid),
    getOddNumberPlayerStats(session.uid),
  ]);

  return (
    <OddNumberPageClient
      initialBalance={wallet.availableBonuses}
      initialDailyAttemptsUsed={stats.dailyAttemptsUsed}
      initialPurchasedAttemptsAvailable={stats.purchasedAttemptsAvailable}
      initialDailyAttemptPurchasesUsed={stats.dailyAttemptPurchasesUsed}
    />
  );
}
