"use client";
import StatsCardsBase from "@/components/ui/StatsCards";

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return <StatsCardsBase variant="applications" stats={stats} />;
}
