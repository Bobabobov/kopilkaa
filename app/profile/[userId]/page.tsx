import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { isUsernameIdentifier } from "@/lib/userResolve";
import UserProfilePageClient from "./UserProfilePageClient";

type Props = {
  params: Promise<{ userId: string }>;
};

async function getUserDisplayName(identifier: string): Promise<string | null> {
  const normalized = String(identifier ?? "").trim();
  if (!normalized) return null;

  const user = isUsernameIdentifier(normalized)
    ? await prisma.user.findUnique({
        where: { username: normalized.slice(1).trim().toLowerCase() },
        select: { name: true, username: true, email: true },
      })
    : await prisma.user.findUnique({
        where: { id: normalized },
        select: { name: true, username: true, email: true },
      });

  if (!user) return null;
  if (user.name) return user.name;
  if (user.username) return `@${user.username}`;
  if (user.email) return user.email.split("@")[0] || "Профиль";
  return "Профиль";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const displayName = await getUserDisplayName(userId);
  const title = displayName ? `${displayName} | Копилка` : "Профиль";
  return {
    title,
    description: displayName
      ? `Профиль пользователя ${displayName} на платформе Копилка`
      : "Профиль на платформе Копилка",
    openGraph: {
      title,
    },
  };
}

export default function UserProfilePage() {
  return <UserProfilePageClient />;
}
