// app/heroes/page.tsx
"use client";

import { useState, useEffect } from "react";
import PixelBackground from "@/components/ui/PixelBackground";
import HeroesHero from "@/components/heroes/HeroesHero";
import HeroesContent from "@/components/heroes/HeroesContent";
import HeroesLoading from "@/components/heroes/HeroesLoading";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: Date;
  isSubscriber: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/heroes");
      if (!response.ok) {
        throw new Error("Ошибка загрузки героев");
      }
      const data = await response.json();
      setHeroes(data.heroes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HeroesLoading />;
  }

  return (
    <div className="min-h-screen">
      <PixelBackground />
      <div className="relative z-10">
        <HeroesHero />
        <HeroesContent heroes={heroes} error={error} onRetry={fetchHeroes} />
      </div>
    </div>
  );
}
