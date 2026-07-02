import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { getQuickBalancePlayerStats } from '@/lib/games/quickBalance';
import QuickBalancePageClient from './_components/QuickBalancePageClient';

export const dynamic = 'force-dynamic';

export default async function QuickBalancePage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/quick-balance',
        modal: 'auth/signup',
      }),
    );
  }

  const [wallet, stats] = await Promise.all([
    computeGoodDeedBonusWallet(session.uid),
    getQuickBalancePlayerStats(session.uid),
  ]);

  return (
    <QuickBalancePageClient
      initialBalance={wallet.availableBonuses}
      initialDailyAttemptsUsed={stats.dailyAttemptsUsed}
      initialPurchasedAttemptsAvailable={stats.purchasedAttemptsAvailable}
      initialDailyAttemptPurchasesUsed={stats.dailyAttemptPurchasesUsed}
    />
  );
}
