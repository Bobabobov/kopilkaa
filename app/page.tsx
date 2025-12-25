import StatsLoader from "@/components/home/StatsLoader";
import HomePageClient from "@/components/home/HomePageClient";

// Fallback статистика для случая ошибки
const fallbackStats = {
  collected: 0,
  requests: 0,
  approved: 0,
  people: 0,
};

export default async function HomePage() {
  // Загружаем статистику на сервере с кэшированием через Next.js
  let stats = fallbackStats;
  
  try {
    stats = await StatsLoader();
  } catch (error) {
    console.error("Error loading stats:", error);
    // Используем fallback, чтобы страница всегда рендерилась
  }

  return <HomePageClient initialStats={stats} />;
}
