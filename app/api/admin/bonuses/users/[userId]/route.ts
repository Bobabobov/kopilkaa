import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import {
  adminAddUserLevel,
  adminResetUserLevel,
  adminSetUserLevel,
  AdminUserLevelInvalidTargetError,
  AdminUserLevelNotFoundError,
} from '@/lib/admin/userLevelAdmin';
import { MAX_ACTIVE_PROFILE_LEVEL } from '@/lib/level-config/shared';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const patchSchema = z
  .object({
    withdrawalBlocked: z.boolean().optional(),
    levelAction: z.enum(['reset', 'add']).optional(),
    targetLevel: z
      .number()
      .int()
      .min(1)
      .max(MAX_ACTIVE_PROFILE_LEVEL)
      .optional(),
  })
  .refine(
    (data) =>
      data.withdrawalBlocked !== undefined ||
      data.levelAction !== undefined ||
      data.targetLevel !== undefined,
    { message: 'Укажите withdrawalBlocked, levelAction или targetLevel' },
  );

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { userId } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Некорректные данные' },
        { status: 400 },
      );
    }

    const { withdrawalBlocked, levelAction, targetLevel } = parsed.data;
    let levelSnapshot = null;

    if (levelAction === 'reset') {
      levelSnapshot = await adminResetUserLevel(userId, admin.id);
    } else if (targetLevel !== undefined) {
      try {
        levelSnapshot = await adminSetUserLevel(userId, targetLevel);
      } catch (error) {
        if (error instanceof AdminUserLevelNotFoundError) {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error instanceof AdminUserLevelInvalidTargetError) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        throw error;
      }
    } else if (levelAction === 'add') {
      try {
        levelSnapshot = await adminAddUserLevel(userId);
      } catch (error) {
        if (error instanceof AdminUserLevelNotFoundError) {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
        if (error instanceof AdminUserLevelInvalidTargetError) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        throw error;
      }
    }

    let withdrawalBlockedValue: boolean | undefined;
    if (withdrawalBlocked !== undefined) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { bonusWithdrawalBlocked: withdrawalBlocked },
        select: {
          id: true,
          bonusWithdrawalBlocked: true,
        },
      });
      withdrawalBlockedValue = user.bonusWithdrawalBlocked;
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        withdrawalBlocked: withdrawalBlockedValue,
        level: levelSnapshot,
      },
    });
  } catch (error) {
    console.error(
      '[API Error] PATCH /api/admin/bonuses/users/[userId]',
      error,
    );
    return NextResponse.json(
      { error: 'Не удалось обновить пользователя' },
      { status: 500 },
    );
  }
}
