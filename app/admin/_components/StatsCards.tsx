// app/admin/components/StatsCards.tsx
import { Stats } from "../types";
import StatsCardsBase from "@/components/ui/StatsCards";

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return <StatsCardsBase variant="admin" stats={stats} />;
}
