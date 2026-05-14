import { cookies } from "next/headers";
import StoriesPageClient from "./_components/StoriesPageClient";
import type { Story } from "@/hooks/stories/useStories";
import { getInternalApiBaseUrl } from "@/lib/siteOrigin";
import { logRouteCatchError } from "@/lib/api/parseApiError";

const baseUrl = getInternalApiBaseUrl();

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
    const res = await fetchWithCookies(`${baseUrl}/api/stories/top?limit=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    logRouteCatchError("[StoriesPage] fetchTopStories", error);
    return [];
  }
}

interface FirstPageResult {
  items: Story[];
  hasMore: boolean;
}

async function fetchStoriesSummary(): Promise<number | null> {
  try {
    const res = await fetchWithCookies(`${baseUrl}/api/stories/summary`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.totalPaid === "number" ? data.totalPaid : null;
  } catch (error) {
    logRouteCatchError("[StoriesPage] fetchStoriesSummary", error);
    return null;
  }
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
  } catch (error) {
    logRouteCatchError("[StoriesPage] fetchFirstStoriesPage", error);
    return { items: [], hasMore: false };
  }
}

export default async function StoriesPage() {
  const [initialTopStories, firstPage, initialTotalPaid] = await Promise.all([
    fetchTopStories(),
    fetchFirstStoriesPage(),
    fetchStoriesSummary(),
  ]);
  return (
    <StoriesPageClient
      initialTopStories={initialTopStories}
      initialStories={firstPage.items}
      initialStoriesHasMore={firstPage.hasMore}
      initialTotalPaid={initialTotalPaid}
    />
  );
}
