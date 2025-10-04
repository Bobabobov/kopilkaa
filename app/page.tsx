"use client";
import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import PixelBackground from "@/components/ui/PixelBackground";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ collected: 0, requests: 0, approved: 0, people: 0 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Загружаем статистику
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => {
        if (data && data.stats) {
          setStats({
            collected: data.stats.applications.total || 0,
            requests: data.stats.applications.pending || 0, 
            approved: data.stats.applications.approved || 0,
            people: data.stats.users.total || 0
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Предотвращаем hydration ошибки
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <PixelBackground />
        <div className="relative z-10">
          <HeroSection stats={{ collected: 0, requests: 0, approved: 0, people: 0 }} loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PixelBackground />
      <div className="relative z-10">
        <HeroSection stats={stats} loading={loading} />
      </div>
    </div>
  );
}