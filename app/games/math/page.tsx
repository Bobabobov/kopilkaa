import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { getMathSprintPlayerStats } from '@/lib/games/mathSprint';
import MathSprintPageClient from './_components/MathSprintPageClient';

export const dynamic = 'force-dynamic';

export default async function MathSprintPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/math',
        modal: 'auth/signup',
      }),
    );
  }

  const [wallet, stats] = await Promise.all([
    computeGoodDeedBonusWallet(session.uid),
    getMathSprintPlayerStats(session.uid),
  ]);

  return (
    <MathSprintPageClient
      initialBalance={wallet.availableBonuses}
      initialDailyAttemptsUsed={stats.dailyAttemptsUsed}
      initialPurchasedAttemptsAvailable={stats.purchasedAttemptsAvailable}
      initialDailyAttemptPurchasesUsed={stats.dailyAttemptPurchasesUsed}
    />
  );
}
