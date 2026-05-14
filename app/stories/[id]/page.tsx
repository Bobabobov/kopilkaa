import type { Metadata } from "next";
import { cookies } from "next/headers";
import StoryPageClient from "./_components/StoryPageClient";
import type { Story } from "./_components/StoryPageClient";
import { getInternalApiBaseUrl } from "@/lib/siteOrigin";
import { logRouteCatchError } from "@/lib/api/parseApiError";

const baseUrl = getInternalApiBaseUrl();

async function fetchStory(
  id: string,
  cookieHeader: string,
): Promise<Story | null> {
  try {
    const res = await fetch(`${baseUrl}/api/stories/${id}`, {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as Story;
  } catch (error) {
    logRouteCatchError(`[StoryPage] fetchStory(${id})`, error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

function storyOgImages(story: Story, title: string) {
  const sorted = [...(story.images ?? [])].sort((a, b) => a.sort - b.sort);
  const href = story.previewImageUrl || sorted[0]?.url;
  if (!href) return undefined;
  return [{ url: href, alt: title.slice(0, 200) }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const path = `/stories/${id}`;

  if (id === "ad") {
    const desc =
      "Рекламная история в разделе историй платформы Копилка.";
    return {
      title: "Рекламная история",
      description: desc,
      alternates: { canonical: path },
      openGraph: {
        type: "article",
        title: "Рекламная история",
        description: desc,
        url: path,
        siteName: "Копилка",
        locale: "ru_RU",
      },
      twitter: {
        card: "summary_large_image",
        title: "Рекламная история",
        description: desc,
      },
    };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return {
      title: "История",
      robots: { index: false, follow: true },
    };
  }
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const story = await fetchStory(id, cookieHeader);
  if (!story) {
    return {
      title: "История не найдена",
      robots: { index: false, follow: true },
    };
  }
  const title = story.title || "История";
  const description =
    (story.summary && story.summary.slice(0, 160)) || undefined;
  const ogImages = storyOgImages(story, title);
  let publishedTime: string | undefined;
  if (story.createdAt) {
    const t = new Date(story.createdAt).getTime();
    if (!Number.isNaN(t)) {
      publishedTime = new Date(t).toISOString();
    }
  }
  const authorName = story.user?.name?.trim();
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description: description ?? undefined,
      siteName: "Копилка",
      locale: "ru_RU",
      publishedTime,
      authors: authorName ? [authorName] : undefined,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: ogImages?.map((img) => img.url),
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (id === "ad") {
    return (
      <StoryPageClient storyId="ad" initialStory={null} initialError={null} />
    );
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return (
      <StoryPageClient
        storyId={id}
        initialStory={null}
        initialError="Неправильный формат ID истории"
      />
    );
  }

  const initialStory = await fetchStory(id, cookieHeader);
  const initialError =
    initialStory === null ? "Не удалось загрузить историю" : null;

  return (
    <StoryPageClient
      storyId={id}
      initialStory={initialStory}
      initialError={initialError}
    />
  );
}
