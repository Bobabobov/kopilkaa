import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { getUserLevelProgress } from '@/lib/userLevel';
import { toDisplayExperience } from '@/lib/userLevel/economy';
import LevelsPageClient from './_components/LevelsPageClient';

export const metadata: Metadata = {
  title: 'Система уровней',
  description:
    'Интерактивный гид по уровням профиля Копилки: графики прогрессии, вехи, привилегии и ответы на вопросы.',
  alternates: {
    canonical: '/profile/levels',
  },
  openGraph: {
    title: 'Система уровней | Копилка',
    description:
      'Графики, карта вех и подробное описание привилегий по уровням профиля.',
    url: '/profile/levels',
    siteName: 'Копилка',
    type: 'website',
  },
};

export default async function ProfileLevelsPage() {
  const session = await getSession();

  if (!session) {
    return <LevelsPageClient isAuthenticated={false} />;
  }

  const [user, wallet] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.uid },
      select: { experience: true },
    }),
    computeGoodDeedBonusWallet(session.uid),
  ]);

  const userLevel = getUserLevelProgress(
    toDisplayExperience(user?.experience ?? 0),
  );

  return (
    <LevelsPageClient
      isAuthenticated
      availableBonuses={wallet.availableBonuses}
      userLevel={userLevel}
    />
  );
}
