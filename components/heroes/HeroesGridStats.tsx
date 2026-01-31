// components/heroes/HeroesGridStats.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatRub } from "@/lib/format";

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
  const { totalHeroes, totalDonated, subscribersCount, averageDonation } =
    stats;

  const statsData = [
    {
      label: "Участников проекта",
      value: totalHeroes,
      color: "#f9bc60",
      icon: "Users",
    },
    {
      label: "Общий объём поддержки",
      value: formatRub(totalDonated),
      color: "#abd1c6",
      icon: "CreditCard",
    },
    {
      label: "Активно поддержавшие",
      value: subscribersCount,
      color: "#e16162",
      icon: "Heart",
    },
    {
      label: "Средний вклад",
      value: formatRub(averageDonation),
      color: "#f9bc60",
      icon: "TrendingUp",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
      {statsData.map((stat) => {
        const Icon =
          LucideIcons[stat.icon as keyof typeof LucideIcons] ||
          LucideIcons.Star;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 to-white/3 px-4 py-4 sm:px-5 sm:py-5 shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-[#94a1b2] truncate">
                  {stat.label}
                </div>
                <div className="mt-1 text-lg sm:text-xl md:text-2xl font-bold text-[#fffffe] break-words">
                  <span style={{ color: stat.color }}>{stat.value}</span>
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: `0 0 16px ${stat.color}22` }}
              >
                <Icon size="sm" className="text-[#abd1c6]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
