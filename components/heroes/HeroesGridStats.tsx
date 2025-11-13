// components/heroes/HeroesGridStats.tsx
"use client";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: Date;
  isSubscriber: boolean;
}

interface HeroesGridStatsProps {
  heroes: Hero[];
}

export default function HeroesGridStats({ heroes }: HeroesGridStatsProps) {
  const totalHeroes = heroes.length;
  const totalDonated = heroes.reduce((sum, hero) => sum + hero.totalDonated, 0);
  const subscribersCount = heroes.filter(hero => hero.isSubscriber).length;
  const averageDonation = totalHeroes > 0 ? Math.round(totalDonated / totalHeroes) : 0;

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
      <h2 className="text-2xl font-bold mb-8" style={{ color: "#fffffe" }}>
        Статистика
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(0, 70, 67, 0.6)",
              borderColor: "rgba(171, 209, 198, 0.3)",
            }}
          >
            <div
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-base" style={{ color: "#abd1c6" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
