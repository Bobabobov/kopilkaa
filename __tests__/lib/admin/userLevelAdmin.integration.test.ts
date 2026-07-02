import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import {
  adminAddUserLevel,
  adminResetUserLevel,
  adminSetUserLevel,
} from '@/lib/admin/userLevelAdmin';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';
import { buildApplicationEligibility } from '@/lib/applications/applicationEconomy';
import { loadUserEconomyContext } from '@/lib/applications/userEconomyContext';
import { resolveUserProfileLevel } from '@/lib/userLevel/resolveProfileLevel';
import { getUserLevelProgress } from '@/lib/userLevel/calculate';
import { toDisplayExperience } from '@/lib/userLevel/economy';
import { BONUS_TRANSACTION_TYPES } from '@/lib/bonusTransactions/constants';

const prisma = new PrismaClient();
const TEST_MARKER = 'level-reset-integration-test';

describe('admin level add + reset integration', () => {
  let userId: string;
  let adminId: string;

  beforeAll(async () => {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });
    if (!admin) throw new Error('Нет admin пользователя в БД');

    adminId = admin.id;

    const user = await prisma.user.create({
      data: {
        email: `${TEST_MARKER}@test.local`,
        name: TEST_MARKER,
        passwordHash: 'test',
        level: 1,
        experience: 0,
      },
      select: { id: true },
    });
    userId = user.id;
  });

  afterAll(async () => {
    if (userId) {
      await prisma.bonusTransaction.deleteMany({ where: { userId } });
      await prisma.application.deleteMany({ where: { userId } });
      await prisma.goodDeedBonusGrant.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }
    await prisma.$disconnect();
  });

  it('должно поднять до 2 уровня и вернуть на 1 со стартовыми бонусами', async () => {
    const added = await adminAddUserLevel(userId);
    expect(added.level).toBe(2);

    const afterAdd = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    });
    expect(resolveUserProfileLevel(afterAdd)).toBe(2);

    const progressAt2 = getUserLevelProgress(
      toDisplayExperience(afterAdd!.experience),
    );
    expect(progressAt2.level).toBe(2);

    const reset = await adminResetUserLevel(userId, adminId);
    expect(reset.level).toBe(1);
    expect(reset.starterBonusesGranted).toBe(30);

    const afterReset = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    });
    expect(afterReset?.level).toBe(1);
    expect(afterReset?.experience).toBe(0);
    expect(resolveUserProfileLevel(afterReset)).toBe(1);

    const progressAt1 = getUserLevelProgress(
      toDisplayExperience(afterReset!.experience),
    );
    expect(progressAt1.level).toBe(1);
    expect(progressAt1.progressPercent).toBe(0);
  });

  it('должно вернуть 30 бонусов и первую бесплатную заявку после сброса с историей трат', async () => {
    await prisma.goodDeedBonusGrant.create({
      data: {
        userId,
        amountBonuses: 30,
        comment: 'стартовый пакет тест',
      },
    });

    const application = await prisma.application.create({
      data: {
        userId,
        title: TEST_MARKER,
        summary: 'test summary',
        story: 'test story',
        payment: '79991234567',
        amount: 1000,
        status: 'PENDING',
      },
    });

    await prisma.bonusTransaction.create({
      data: {
        userId,
        applicationId: application.id,
        amount: 30,
        type: BONUS_TRANSACTION_TYPES.APPLICATION_SUBMIT_FEE,
        description: 'тестовая публикация',
      },
    });

    const walletBefore = await computeGoodDeedBonusWallet(userId);
    expect(walletBefore.availableBonuses).toBe(0);

    await adminAddUserLevel(userId);
    await adminResetUserLevel(userId, adminId);

    const afterReset = await prisma.user.findUnique({
      where: { id: userId },
      select: { adminEconomyResetAt: true, level: true, experience: true },
    });
    expect(afterReset?.adminEconomyResetAt).toBeInstanceOf(Date);

    const walletAfter = await computeGoodDeedBonusWallet(userId);
    expect(walletAfter.availableBonuses).toBe(30);

    const economy = await loadUserEconomyContext(prisma, userId);
    expect(economy?.priorApplicationCount).toBe(0);

    const eligibility = buildApplicationEligibility({
      userId,
      userLevel: economy!.profileLevel,
      priorApplicationCount: economy!.priorApplicationCount,
      lastApplicationCreatedAt: economy!.lastApplicationCreatedAt,
      availableBonuses: walletAfter.availableBonuses,
    });
    expect(eligibility.isFirstApplication).toBe(true);
    expect(eligibility.submitCost).toBe(0);
  });

  it('должно убрать бесплатную заявку после повышения до 2 уровня без публикации', async () => {
    await adminResetUserLevel(userId, adminId);
    await adminAddUserLevel(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { adminEconomyResetAt: true, level: true, experience: true },
    });
    expect(resolveUserProfileLevel(user)).toBe(2);

    const wallet = await computeGoodDeedBonusWallet(userId);
    const economy = await loadUserEconomyContext(prisma, userId);
    expect(economy?.priorApplicationCount).toBe(0);

    const eligibility = buildApplicationEligibility({
      userId,
      userLevel: economy!.profileLevel,
      priorApplicationCount: economy!.priorApplicationCount,
      lastApplicationCreatedAt: economy!.lastApplicationCreatedAt,
      availableBonuses: wallet.availableBonuses,
    });
    expect(eligibility.isFirstApplication).toBe(true);
    expect(eligibility.submitCost).toBe(30);
    expect(eligibility.canSubmit).toBe(true);
  });

  it('должно установить выбранный уровень при повышении и понижении', async () => {
    await adminResetUserLevel(userId, adminId);

    const raised = await adminSetUserLevel(userId, 3);
    expect(raised.level).toBe(3);

    const afterRaise = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    });
    expect(resolveUserProfileLevel(afterRaise)).toBe(3);

    const lowered = await adminSetUserLevel(userId, 2);
    expect(lowered.level).toBe(2);

    const afterLower = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    });
    expect(resolveUserProfileLevel(afterLower)).toBe(2);
  });
});
