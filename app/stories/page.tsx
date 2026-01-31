import { cookies } from "next/headers";
import StoriesPageClient from "./_components/StoriesPageClient";
import type { Story } from "@/hooks/stories/useStories";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchTopStories(): Promise<Story[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    const res = await fetch(`${baseUrl}/api/stories/top?limit=3`, {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export default async function StoriesPage() {
  const initialTopStories = await fetchTopStories();
  return <StoriesPageClient initialTopStories={initialTopStories} />;
}
