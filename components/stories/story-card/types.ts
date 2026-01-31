import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

export interface Story {
  id: string;
  title: string;
  summary: string;
  amount?: number | null;
  createdAt?: string;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    hideEmail?: boolean;
    heroBadge?: HeroBadgeType | null;
  };
  _count?: {
    likes: number;
  };
  userLiked?: boolean;
}
