import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import GamesPageClient from './_components/GamesPageClient';

export const metadata: Metadata = {
  title: 'Игровое лобби',
  description:
    'Внутренние игровые модули платформы: тренируйте реакцию и умножайте бонусы активности.',
};

export const dynamic = 'force-dynamic';

/**
 * Серверная точка входа лобби.
 * Баланс и сессия загружаются только на сервере — клиент не содержит игровой логики.
 */
export default async function GamesPage() {
  const session = await getSession();

  if (!session) {
    return <GamesPageClient isAuthenticated={false} availableBonuses={0} />;
  }

  const { availableBonuses } = await computeGoodDeedBonusWallet(session.uid);

  return (
    <GamesPageClient
      isAuthenticated
      availableBonuses={availableBonuses}
    />
  );
}
