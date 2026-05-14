import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { isUsernameIdentifier } from "@/lib/userResolve";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import UserProfilePageClient from "./UserProfilePageClient";

type Props = {
  params: Promise<{ userId: string }>;
};

type ProfileMetaOk = {
  kind: "ok";
  displayName: string;
  username: string | null;
  avatar: string | null;
};

type ProfileMetaResult =
  | ProfileMetaOk
  | { kind: "notFound" }
  | { kind: "error" };

async function fetchProfileMeta(rawIdentifier: string): Promise<ProfileMetaResult> {
  const normalized = String(rawIdentifier ?? "").trim();
  if (!normalized) {
    return { kind: "notFound" };
  }

  try {
    const user = isUsernameIdentifier(normalized)
      ? await prisma.user.findUnique({
          where: { username: normalized.slice(1).trim().toLowerCase() },
          select: {
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
        })
      : await prisma.user.findUnique({
          where: { id: normalized },
          select: {
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
        });

    if (!user) {
      return { kind: "notFound" };
    }

    let displayName: string;
    if (user.name) {
      displayName = user.name;
    } else if (user.username) {
      displayName = `@${user.username}`;
    } else if (user.email) {
      displayName = user.email.split("@")[0] || "Профиль";
    } else {
      displayName = "Профиль";
    }

    return {
      kind: "ok",
      displayName,
      username: user.username,
      avatar: user.avatar,
    };
  } catch (error) {
    logRouteCatchError(`[ProfilePage] fetchProfileMeta(${normalized})`, error);
    return { kind: "error" };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const path = `/profile/${userId}`;

  const meta = await fetchProfileMeta(userId);

  if (meta.kind === "error") {
    return {
      title: { absolute: "Профиль | Копилка" },
      robots: { index: false, follow: true },
    };
  }

  if (meta.kind === "notFound") {
    return {
      title: { absolute: "Профиль не найден | Копилка" },
      description:
        "Такого пользователя нет на платформе Копилка.",
      robots: { index: false, follow: true },
    };
  }

  const { displayName, username, avatar } = meta;
  const fullTitle = `${displayName} | Копилка`;
  const description = `Профиль пользователя ${displayName} на платформе Копилка`;
  const ogImages = avatar
    ? [{ url: avatar, alt: displayName.slice(0, 200) }]
    : undefined;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      title: fullTitle,
      description,
      url: path,
      siteName: "Копилка",
      locale: "ru_RU",
      username: username ?? undefined,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages?.map((img) => img.url),
    },
  };
}

export default function UserProfilePage() {
  return <UserProfilePageClient />;
}
