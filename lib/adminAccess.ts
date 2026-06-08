import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type AllowedAdminUser = {
  id: string;
  email: string;
};

function getAllowedEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAllowedAdminUser(): Promise<AllowedAdminUser | null> {
  const session = await getSession();
  if (!session?.uid) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, email: true, role: true },
  });

  if (!user) return null;

  const isAdmin = await isUserAllowedAdmin(user.id, session.role, user);
  if (!isAdmin) return null;

  return { id: user.id, email: user.email ?? "" };
}

type AdminUserSnapshot = {
  email: string | null;
  role: string;
};

/**
 * Админ: роль ADMIN в сессии/БД или email из ADMIN_EMAILS (как доступ к /admin).
 */
export async function isUserAllowedAdmin(
  userId: string,
  sessionRole?: string | null,
  cachedUser?: AdminUserSnapshot | null,
): Promise<boolean> {
  if (sessionRole === "ADMIN") return true;

  const user =
    cachedUser ??
    (await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true },
    }));

  if (!user) return false;
  if (user.role === "ADMIN") return true;

  const allowedEmails = getAllowedEmails();
  if (!allowedEmails.length || !user.email) return false;

  return allowedEmails.includes(user.email.toLowerCase());
}
