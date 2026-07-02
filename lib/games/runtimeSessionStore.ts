import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

type DbClient = Prisma.TransactionClient | typeof prisma;

export interface RuntimeSessionRecord<TPayload> {
  userId: string;
  gameKey: string;
  payload: TPayload;
  expiresAtMs: number;
}

function getRuntimeSessionDelegate(
  db: DbClient,
): Prisma.GameRuntimeSessionDelegate {
  return (db as typeof prisma).gameRuntimeSession;
}

async function cleanupExpired(db: DbClient): Promise<void> {
  await getRuntimeSessionDelegate(db).deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

export async function saveRuntimeSession<TPayload>(
  input: RuntimeSessionRecord<TPayload>,
  db: DbClient = prisma,
): Promise<void> {
  await cleanupExpired(db);

  await getRuntimeSessionDelegate(db).upsert({
    where: {
      userId_gameKey: {
        userId: input.userId,
        gameKey: input.gameKey,
      },
    },
    create: {
      userId: input.userId,
      gameKey: input.gameKey,
      payloadJson: JSON.stringify(input.payload),
      expiresAt: new Date(input.expiresAtMs),
    },
    update: {
      payloadJson: JSON.stringify(input.payload),
      expiresAt: new Date(input.expiresAtMs),
    },
  });
}

export async function peekRuntimeSession<TPayload>(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<TPayload | null> {
  await cleanupExpired(db);

  const row = await getRuntimeSessionDelegate(db).findUnique({
    where: {
      userId_gameKey: {
        userId,
        gameKey,
      },
    },
    select: {
      payloadJson: true,
      expiresAt: true,
    },
  });

  if (!row || row.expiresAt.getTime() <= Date.now()) {
    if (row) {
      await deleteRuntimeSession(userId, gameKey, db);
    }
    return null;
  }

  return JSON.parse(row.payloadJson) as TPayload;
}

export async function takeRuntimeSession<TPayload>(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<TPayload | null> {
  const payload = await peekRuntimeSession<TPayload>(userId, gameKey, db);
  if (!payload) {
    return null;
  }

  await deleteRuntimeSession(userId, gameKey, db);
  return payload;
}

export async function deleteRuntimeSession(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<void> {
  await getRuntimeSessionDelegate(db).deleteMany({
    where: {
      userId,
      gameKey,
    },
  });
}
