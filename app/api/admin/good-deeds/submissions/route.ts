import { NextRequest, NextResponse } from 'next/server';
import type { GoodDeedSubmissionStatus } from '@prisma/client';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import {
  listGoodDeedSubmissions,
  type GoodDeedSubmissionSort,
} from '@/lib/admin/goodDeedSubmissions';

export const dynamic = 'force-dynamic';

function parseStatus(value: string | null): 'ALL' | GoodDeedSubmissionStatus {
  if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
    return value;
  }
  return 'ALL';
}

function parseSort(value: string | null): GoodDeedSubmissionSort {
  if (value === 'created_asc' || value === 'reward_desc') return value;
  return 'created_desc';
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get('limit') || 20)),
    );
    const q = (searchParams.get('q') || '').trim();
    const status = parseStatus(searchParams.get('status'));
    const sortBy = parseSort(searchParams.get('sortBy'));

    const { items, total } = await listGoodDeedSubmissions({
      page,
      limit,
      q,
      status,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        sortBy,
      },
    });
  } catch (error) {
    console.error('[API Error] GET /api/admin/good-deeds/submissions', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить задания для модерации' },
      { status: 500 },
    );
  }
}
