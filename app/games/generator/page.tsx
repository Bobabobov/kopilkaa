import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import BonusGeneratorPageClient from './_components/BonusGeneratorPageClient';

export const dynamic = 'force-dynamic';

export default async function BonusGeneratorPage() {
  const session = await getSession();

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/games/generator',
        modal: 'auth/signup',
      }),
    );
  }

  const wallet = await computeGoodDeedBonusWallet(session.uid);

  return (
    <BonusGeneratorPageClient initialBalance={wallet.availableBonuses} />
  );
}
