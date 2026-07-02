import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import {
  getSequencePlayerStats,
} from '@/lib/games/sequenceGame';
import SequencePageClient from './_components/SequencePageClient';

export const dynamic = 'force-dynamic';

export default async function SequenceGamePage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/sequence',
        modal: 'auth/signup',
      }),
    );
  }

  const [wallet, stats] = await Promise.all([
    computeGoodDeedBonusWallet(session.uid),
    getSequencePlayerStats(session.uid),
  ]);

  return (
    <SequencePageClient
      initialBalance={wallet.availableBonuses}
      initialMaxRecord={stats.maxSequenceRecord}
      initialDailyAttemptsUsed={stats.dailyAttemptsUsed}
      initialPurchasedAttemptsAvailable={stats.purchasedAttemptsAvailable}
      initialDailyAttemptPurchasesUsed={stats.dailyAttemptPurchasesUsed}
    />
  );
}
