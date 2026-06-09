import type { RecentApplicationItem } from "@/lib/applications/getRecentApplications";
import type { TopDonorItem } from "@/lib/donations/getTopDonors";

export type HeroStats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

export interface HeroSectionProps {
  stats: HeroStats;
}

export interface HomePageContentProps {
  initialStats: HeroStats;
  recentApplications: RecentApplicationItem[];
  topDonors: TopDonorItem[];
}
