import type { Metadata } from "next";
import { cookies } from "next/headers";
import StoriesPageClient from "./_components/StoriesPageClient";
import type { Story } from "@/hooks/stories/useStories";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Истории платформы",
  description:
    "Истории пользователей, которым платформа Копилка оказала финансовую поддержку.",
  openGraph: {
    title: "Истории платформы",
    description:
      "Истории пользователей, которым платформа Копилка оказала финансовую поддержку.",
  },
};

async function fetchWithCookies(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
}

async function fetchTopStories(): Promise<Story[]> {
  try {
    const res = await fetchWithCookies(`${baseUrl}/api/stories/top?limit=3`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

interface FirstPageResult {
  items: Story[];
  hasMore: boolean;
}

async function fetchFirstStoriesPage(): Promise<FirstPageResult> {
  try {
    const res = await fetchWithCookies(
      `${baseUrl}/api/stories?page=1&limit=12`,
    );
    if (!res.ok) return { items: [], hasMore: false };
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const pages = Number(data.pages) || 0;
    return { items, hasMore: pages > 1 };
  } catch {
    return { items: [], hasMore: false };
  }
}

export default async function StoriesPage() {
  const [initialTopStories, firstPage] = await Promise.all([
    fetchTopStories(),
    fetchFirstStoriesPage(),
  ]);
  return (
    <StoriesPageClient
      initialTopStories={initialTopStories}
      initialStories={firstPage.items}
      initialStoriesHasMore={firstPage.hasMore}
    />
  );
}
