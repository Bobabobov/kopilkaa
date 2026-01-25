import { prisma } from "@/lib/db";

function normalizeUsername(username: string): string {
  return username.trim().replace(/^@+/, "").toLowerCase();
}

export function isUsernameIdentifier(identifier: string): boolean {
  return identifier.trim().startsWith("@");
}

/**
 * Resolves a route param like "@username" OR a raw id into a real user id.
 * - "@username" -> looks up user by username and returns their id (or null)
 * - "cuid..."   -> verifies user exists by id and returns it (or null)
 */
export async function resolveUserIdFromIdentifier(
  identifierRaw: string,
): Promise<string | null> {
  const identifier = String(identifierRaw ?? "").trim();
  if (!identifier) return null;

  if (isUsernameIdentifier(identifier)) {
    const username = normalizeUsername(identifier);
    if (!username) return null;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    return user?.id ?? null;
  }

  // Treat as id, but verify it exists (so callers can safely 404)
  const user = await prisma.user.findUnique({
    where: { id: identifier },
    select: { id: true },
  });
  return user?.id ?? null;
}
