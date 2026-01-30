import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import type { TrustLevel } from "@/lib/trustLevel";

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  lastSeen: string | null;
  role: string;
  badge?: HeroBadgeType | null;
  trustDelta?: number;
  trustLevel?: TrustLevel;
  effectiveApprovedApplications?: number;
}

export const VALID_BADGES: HeroBadgeType[] = [
  "observer",
  "member",
  "active",
  "hero",
  "honor",
  "legend",
  "tester",
  "custom",
];
