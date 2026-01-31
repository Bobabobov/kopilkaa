import type { Metadata } from "next";
import HeroesPageClient from "./_components/HeroesPageClient";
import type { Hero, HeroesStats } from "./_components/HeroesPageClient";

export const metadata: Metadata = {
  title: "Герои",
  description:
    "Участники платформы Копилка, поддержавшие проект. Рейтинг по размещению профиля.",
};

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchHeroesFirstPage(): Promise<{
  topThree: Hero[];
  items: Hero[];
  stats: HeroesStats;
  listTotal: number;
  pages: number;
}> {
  try {
    const res = await fetch(
      `${baseUrl}/api/heroes?page=1&limit=24&sortBy=total`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      throw new Error("Heroes fetch failed");
    }
    const data = await res.json();
    return {
      topThree: data.topThree ?? [],
      items: data.items ?? [],
      stats: data.stats ?? {
        totalHeroes: 0,
        totalDonated: 0,
        subscribersCount: 0,
        averageDonation: 0,
      },
      listTotal: data.listTotal ?? 0,
      pages: data.pages ?? 0,
    };
  } catch {
    return {
      topThree: [],
      items: [],
      stats: {
        totalHeroes: 0,
        totalDonated: 0,
        subscribersCount: 0,
        averageDonation: 0,
      },
      listTotal: 0,
      pages: 0,
    };
  }
}

export default async function HeroesPage() {
  const initial = await fetchHeroesFirstPage();

  return (
    <HeroesPageClient
      initialTopThree={initial.topThree}
      initialHeroes={initial.items}
      initialStats={initial.stats}
      initialListTotal={initial.listTotal}
      initialPages={initial.pages}
    />
  );
}
