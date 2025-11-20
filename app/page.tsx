"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cachedFetch, getCachedStats, cacheStats } from "@/lib/cache";
import PixelBackground from "@/components/ui/PixelBackground";

// Lazy load heavy components
const HeroSection = dynamic(() => import("@/components/home/HeroSection"), {
  ssr: false,
  loading: () => <div className="h-screen bg-gradient-to-br from-[#004643] to-[#001e1d]" />
});

const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const RecentApplications = dynamic(() => import("@/components/home/RecentApplications"), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const FAQ = dynamic(() => import("@/components/home/FAQ"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    collected: 0,
    requests: 0,
    approved: 0,
    people: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Проверяем кэш
    const cachedStats = getCachedStats<Stats>();
    if (cachedStats) {
      setStats(cachedStats);
      setLoading(false);
      return;
    }

    // Загружаем статистику с кэшированием
    cachedFetch<{ stats: Stats }>("/api/stats", {}, 2 * 60 * 1000)
      .then((data) => {
        if (data && data.stats) {
          const newStats = {
            collected: data.stats.applications.total || 0,
            requests: data.stats.applications.pending || 0,
            approved: data.stats.applications.approved || 0,
            people: data.stats.users.total || 0,
          };
          setStats(newStats);
          cacheStats(newStats);
        }
      })
      .catch(() => {
        // При ошибке используем значения по умолчанию (уже установлены)
      })
      .finally(() => setLoading(false));
  }, []);

  // Предотвращаем hydration ошибки
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <PixelBackground />
        <div className="relative z-10">
          <HeroSection
            stats={{ collected: 0, requests: 0, approved: 0, people: 0 }}
            loading={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PixelBackground />
      <div className="relative z-10">
        <HeroSection stats={stats} loading={loading} />
        <HowItWorks />
        <RecentApplications />
        <FAQ />
      </div>
    </div>
  );
}
