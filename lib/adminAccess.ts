import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DEFAULT_ADMIN_EMAIL = "bobov097@gmail.com";

export type AllowedAdminUser = {
  id: string;
  email: string;
};

export async function getAllowedAdminUser(): Promise<AllowedAdminUser | null> {
  const session = await getSession();
  if (!session?.uid) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, email: true },
  });

  if (!user?.email) return null;

  const allowed = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
  if (user.email.toLowerCase() !== allowed) return null;

  return { id: user.id, email: user.email };
}


