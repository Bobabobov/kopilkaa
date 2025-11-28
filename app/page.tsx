"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cacheStats, getCachedStats } from "@/lib/cache";
import PixelBackground from "@/components/ui/PixelBackground";
import TopDonorsInline from "@/components/home/TopDonorsInline";

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
  collected: number; // всего в копилке
  requests: number;  // всего историй (заявок)
  approved: number;  // одобренных историй
  people: number;    // участников
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

    const load = async () => {
      try {
        setLoading(true);

        // сначала пробуем взять из нашего простого кэша,
        // чтобы не мигала статистика при быстрых переходах
        const cachedStats = getCachedStats<Stats>();
        if (cachedStats) {
          setStats(cachedStats);
        }

        const response = await fetch("/api/stats", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data && data.stats) {
          const collected =
            data.stats.donations?.balance ??
            data.stats.applications?.total ??
            0;

          const newStats: Stats = {
            collected,
            // всего историй = все заявки (любой статус)
            requests: data.stats.applications?.total || 0,
            // выплачено = количество одобренных заявок
            approved: data.stats.applications?.approved || 0,
            people: data.stats.users?.total || 0,
          };

          setStats(newStats);
          cacheStats(newStats, 5_000); // кэшируем всего на 5 секунд
        }
      } catch {
        // оставляем предыдущие значения
      } finally {
        setLoading(false);
      }
    };

    load();
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
        {/* Лёгкий блок про топ‑донатёров между статистикой и следующим разделом */}
        <TopDonorsInline />
        <HowItWorks />
        <RecentApplications />
        <FAQ />
      </div>
    </div>
  );
}
