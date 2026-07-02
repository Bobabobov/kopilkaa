import type { GoodDeedSubmissionStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export const GOOD_DEED_SUBMISSION_USER_SELECT = {
  id: true,
  name: true,
  username: true,
  avatar: true,
  email: true,
  vkLink: true,
  telegramLink: true,
  youtubeLink: true,
} as const;

export type GoodDeedSubmissionUserDto = {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
  email?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
};

export type GoodDeedSubmissionListItemDto = {
  id: string;
  taskKey: string;
  taskTitle: string;
  taskDescription: string;
  storyText: string;
  reward: number;
  weekKey: string;
  status: GoodDeedSubmissionStatus;
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  mediaCount: number;
  firstMediaUrl?: string | null;
  firstMediaType?: 'IMAGE' | 'VIDEO' | null;
  user: GoodDeedSubmissionUserDto;
};

export type GoodDeedSubmissionDetailDto = Omit<
  GoodDeedSubmissionListItemDto,
  'firstMediaUrl' | 'firstMediaType'
> & {
  media: { url: string; type: 'IMAGE' | 'VIDEO' }[];
};

export type GoodDeedSubmissionSort =
  | 'created_desc'
  | 'created_asc'
  | 'reward_desc';

function mapUser(
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
    email: string | null;
    vkLink: string | null;
    telegramLink: string | null;
    youtubeLink: string | null;
  },
): GoodDeedSubmissionUserDto {
  return {
    id: user.id,
    name: user.name || user.username || 'Пользователь',
    username: user.username,
    avatar: user.avatar,
    email: user.email,
    vkLink: user.vkLink,
    telegramLink: user.telegramLink,
    youtubeLink: user.youtubeLink,
  };
}

export function buildGoodDeedSubmissionWhere(
  q: string,
  status: 'ALL' | GoodDeedSubmissionStatus,
): Prisma.GoodDeedSubmissionWhereInput {
  const filters: Prisma.GoodDeedSubmissionWhereInput[] = [];

  if (status !== 'ALL') {
    filters.push({ status });
  }

  const trimmed = q.trim();
  if (trimmed) {
    filters.push({
      OR: [
        { taskTitle: { contains: trimmed } },
        { taskDescription: { contains: trimmed } },
        { storyText: { contains: trimmed } },
        { weekKey: { contains: trimmed } },
        { taskKey: { contains: trimmed } },
        { user: { name: { contains: trimmed } } },
        { user: { username: { contains: trimmed } } },
        { user: { email: { contains: trimmed } } },
      ],
    });
  }

  if (filters.length === 0) return {};
  if (filters.length === 1) return filters[0]!;
  return { AND: filters };
}

export function buildGoodDeedSubmissionOrderBy(
  sortBy: GoodDeedSubmissionSort,
): Prisma.GoodDeedSubmissionOrderByWithRelationInput {
  if (sortBy === 'created_asc') return { createdAt: 'asc' };
  if (sortBy === 'reward_desc') return { reward: 'desc' };
  return { createdAt: 'desc' };
}

export async function getGoodDeedSubmissionStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}> {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.goodDeedSubmission.count(),
    prisma.goodDeedSubmission.count({ where: { status: 'PENDING' } }),
    prisma.goodDeedSubmission.count({ where: { status: 'APPROVED' } }),
    prisma.goodDeedSubmission.count({ where: { status: 'REJECTED' } }),
  ]);

  return { total, pending, approved, rejected };
}

export async function listGoodDeedSubmissions(params: {
  page: number;
  limit: number;
  q: string;
  status: 'ALL' | GoodDeedSubmissionStatus;
  sortBy: GoodDeedSubmissionSort;
}): Promise<{ items: GoodDeedSubmissionListItemDto[]; total: number }> {
  const where = buildGoodDeedSubmissionWhere(params.q, params.status);
  const orderBy = buildGoodDeedSubmissionOrderBy(params.sortBy);
  const skip = (params.page - 1) * params.limit;

  const [rows, total] = await Promise.all([
    prisma.goodDeedSubmission.findMany({
      where,
      orderBy,
      skip,
      take: params.limit,
      select: {
        id: true,
        taskKey: true,
        taskTitle: true,
        taskDescription: true,
        storyText: true,
        reward: true,
        weekKey: true,
        status: true,
        adminComment: true,
        reviewedAt: true,
        createdAt: true,
        media: {
          orderBy: { sort: 'asc' },
          take: 1,
          select: { url: true, type: true },
        },
        _count: { select: { media: true } },
        user: { select: GOOD_DEED_SUBMISSION_USER_SELECT },
      },
    }),
    prisma.goodDeedSubmission.count({ where }),
  ]);

  const items = rows.map((row) => {
    const firstMedia = row.media[0];
    return {
      id: row.id,
      taskKey: row.taskKey,
      taskTitle: row.taskTitle,
      taskDescription: row.taskDescription,
      storyText: row.storyText || '',
      reward: row.reward,
      weekKey: row.weekKey,
      status: row.status,
      adminComment: row.adminComment,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      mediaCount: row._count.media,
      firstMediaUrl: firstMedia?.url ?? null,
      firstMediaType: firstMedia?.type ?? null,
      user: mapUser(row.user),
    };
  });

  return { items, total };
}

export async function getGoodDeedSubmissionDetail(
  id: string,
): Promise<GoodDeedSubmissionDetailDto | null> {
  const row = await prisma.goodDeedSubmission.findUnique({
    where: { id },
    select: {
      id: true,
      taskKey: true,
      taskTitle: true,
      taskDescription: true,
      storyText: true,
      reward: true,
      weekKey: true,
      status: true,
      adminComment: true,
      reviewedAt: true,
      createdAt: true,
      media: {
        orderBy: { sort: 'asc' },
        select: { url: true, type: true },
      },
      _count: { select: { media: true } },
      user: { select: GOOD_DEED_SUBMISSION_USER_SELECT },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    taskKey: row.taskKey,
    taskTitle: row.taskTitle,
    taskDescription: row.taskDescription,
    storyText: row.storyText || '',
    reward: row.reward,
    weekKey: row.weekKey,
    status: row.status,
    adminComment: row.adminComment,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    mediaCount: row._count.media,
    user: mapUser(row.user),
    media: row.media,
  };
}
