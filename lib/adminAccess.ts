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

  const allowedEmails = getAllowedEmails();
  if (!allowedEmails.length) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, email: true },
  });

  if (!user?.email) return null;

  if (!allowedEmails.includes(user.email.toLowerCase())) return null;

  return { id: user.id, email: user.email };
}


