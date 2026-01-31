import type { Metadata } from "next";
import { cookies } from "next/headers";
import StoryPageClient from "./_components/StoryPageClient";
import type { Story } from "./_components/StoryPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchStory(id: string, cookieHeader: string): Promise<Story | null> {
  try {
    const res = await fetch(`${baseUrl}/api/stories/${id}`, {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as Story;
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === "ad") {
    return {
      title: "Рекламная история",
      description: "Рекламная история в разделе историй платформы Копилка.",
    };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return { title: "История" };
  }
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const story = await fetchStory(id, cookieHeader);
  if (!story) {
    return { title: "История не найдена" };
  }
  const title = story.title || "История";
  const description =
    (story.summary && story.summary.slice(0, 160)) || undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
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
      <StoryPageClient
        storyId="ad"
        initialStory={null}
        initialError={null}
      />
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
