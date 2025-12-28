// components/heroes/HeroesGridStats.tsx
"use client";

interface Hero {
  id: string;
}

interface HeroesGridStatsProps {
  stats: {
    totalHeroes: number;
    totalDonated: number;
    subscribersCount: number;
    averageDonation: number;
  };
}

export default function HeroesGridStats({ stats }: HeroesGridStatsProps) {
  const { totalHeroes, totalDonated, subscribersCount, averageDonation } = stats;

  const statsData = [
    {
      label: "Всего",
      value: totalHeroes,
      color: "#f9bc60",
    },
    {
      label: "Собрано",
      value: `₽${totalDonated.toLocaleString()}`,
      color: "#abd1c6",
    },
    {
      label: "Подписчиков",
      value: subscribersCount,
      color: "#e16162",
    },
    {
      label: "Средний донат",
      value: `₽${averageDonation}`,
      color: "#f9bc60",
    },
  ];

  return (
    <div className="text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 px-4" style={{ color: "#fffffe" }}>
        Статистика
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(0, 70, 67, 0.6)",
              borderColor: "rgba(171, 209, 198, 0.3)",
            }}
          >
            <div
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 break-words"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm md:text-base" style={{ color: "#abd1c6" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
