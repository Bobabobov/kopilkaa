import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

type DbClient = Prisma.TransactionClient | typeof prisma;

export interface RuntimeSessionRecord<TPayload> {
  userId: string;
  gameKey: string;
  payload: TPayload;
  expiresAtMs: number;
}

let tableReadyPromise: Promise<void> | null = null;

async function ensureRuntimeSessionsTable(db: DbClient): Promise<void> {
  if (tableReadyPromise) {
    return tableReadyPromise;
  }

  tableReadyPromise = (async () => {
    await db.$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS game_runtime_sessions (
        user_id TEXT NOT NULL,
        game_key TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        expires_at_ms BIGINT NOT NULL,
        updated_at_ms BIGINT NOT NULL,
        PRIMARY KEY (user_id, game_key)
      )
      `,
    );
  })();

  await tableReadyPromise;
}

async function cleanupExpired(db: DbClient): Promise<void> {
  await db.$executeRaw`
    DELETE FROM game_runtime_sessions
    WHERE expires_at_ms <= ${Date.now()}
  `;
}

export async function saveRuntimeSession<TPayload>(
  input: RuntimeSessionRecord<TPayload>,
  db: DbClient = prisma,
): Promise<void> {
  await ensureRuntimeSessionsTable(db);
  await cleanupExpired(db);

  await db.$executeRaw`
    INSERT INTO game_runtime_sessions (
      user_id,
      game_key,
      payload_json,
      expires_at_ms,
      updated_at_ms
    )
    VALUES (
      ${input.userId},
      ${input.gameKey},
      ${JSON.stringify(input.payload)},
      ${input.expiresAtMs},
      ${Date.now()}
    )
    ON CONFLICT (user_id, game_key)
    DO UPDATE SET
      payload_json = excluded.payload_json,
      expires_at_ms = excluded.expires_at_ms,
      updated_at_ms = excluded.updated_at_ms
  `;
}

export async function peekRuntimeSession<TPayload>(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<TPayload | null> {
  await ensureRuntimeSessionsTable(db);
  await cleanupExpired(db);

  const rows = await db.$queryRaw<Array<{ payload_json: string }>>`
    SELECT payload_json
    FROM game_runtime_sessions
    WHERE user_id = ${userId}
      AND game_key = ${gameKey}
      AND expires_at_ms > ${Date.now()}
    LIMIT 1
  `;

  if (!rows[0]?.payload_json) {
    return null;
  }

  return JSON.parse(rows[0].payload_json) as TPayload;
}

export async function takeRuntimeSession<TPayload>(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<TPayload | null> {
  await ensureRuntimeSessionsTable(db);
  await cleanupExpired(db);

  const payload = await peekRuntimeSession<TPayload>(userId, gameKey, db);
  if (!payload) {
    return null;
  }

  await db.$executeRaw`
    DELETE FROM game_runtime_sessions
    WHERE user_id = ${userId}
      AND game_key = ${gameKey}
  `;

  return payload;
}

export async function deleteRuntimeSession(
  userId: string,
  gameKey: string,
  db: DbClient = prisma,
): Promise<void> {
  await ensureRuntimeSessionsTable(db);
  await db.$executeRaw`
    DELETE FROM game_runtime_sessions
    WHERE user_id = ${userId}
      AND game_key = ${gameKey}
  `;
}
