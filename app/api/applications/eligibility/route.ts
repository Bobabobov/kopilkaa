import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { buildApplicationEligibility } from '@/lib/applications/applicationEconomy';
import { loadUserEconomyContext } from '@/lib/applications/userEconomyContext';

function getWhitelistEmails(): string[] {
  const raw = process.env.WHITELIST_EMAILS || '';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(req: Request) {
  const session = await getAuthUser(req);
  if (!session) {
    return Response.json({ error: 'Требуется вход' }, { status: 401 });
  }

  try {
    const isAdmin = session.role === 'ADMIN';
    const requester = await prisma.user.findUnique({
      where: { id: session.uid },
      select: { email: true },
    });

    const whitelistEmails = getWhitelistEmails();
    const isWhitelisted = Boolean(
      requester?.email &&
        whitelistEmails.includes(requester.email.toLowerCase()),
    );
    const bypassEconomy = isAdmin || isWhitelisted;

    const economy = await loadUserEconomyContext(prisma, session.uid);
    if (!economy) {
      return Response.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const wallet = await computeGoodDeedBonusWallet(session.uid);

    const eligibility = buildApplicationEligibility({
      userId: session.uid,
      userLevel: economy.profileLevel,
      priorApplicationCount: economy.priorApplicationCount,
      lastApplicationCreatedAt: economy.lastApplicationCreatedAt,
      availableBonuses: wallet.availableBonuses,
      bypassEconomy,
    });

    return Response.json({
      success: true,
      data: eligibility,
    });
  } catch (error) {
    console.error('[GET /api/applications/eligibility]', error);
    return Response.json(
      { error: 'Не удалось загрузить условия публикации' },
      { status: 500 },
    );
  }
}
