/**
 * Общие типы админки. Используются в app/admin и в hooks/admin.
 * Размещение в types/ чтобы hooks не зависели от app/.
 */
import type { TrustLevel } from "@/lib/trustLevel";

export type ApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CONTEST";

export type ApplicationItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  publishInStories: boolean;
  adminComment: string | null;
  createdAt: string;
  countTowardsTrust: boolean;
  trustDecreasedAtDecision?: boolean;
  user: {
    email: string;
    id: string;
    name: string | null;
    avatar: string | null;
    avatarFrame: string | null;
    hideEmail: boolean;
    trustDelta?: number;
  };
  images: { url: string; sort: number }[];
};

export type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  contest: number;
  total: number;
  totalAmount: number;
};

export type StatusModal = {
  id: string;
  status: ApplicationStatus;
  comment: string;
  decreaseTrustOnDecision: boolean;
  publishInStories: boolean;
};

export type LightboxState = {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
};

export type AdminUserLinkRef = {
  id: string;
  email: string | null;
  name: string | null;
};

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  lastSeen: string | null;
  role: string;
  trustDelta?: number;
  trustLevel?: TrustLevel;
  effectiveApprovedApplications?: number;
  /** Микростатистика по заявкам для карточки уровня доверия и рейтинга. */
  levelStats?: {
    approvedTotal: number;
    approvedCounting: number;
    approvedWithoutLevel: number;
    rejectedTotal: number;
    rejectedWithLevelDecrease: number;
    trustScore: number;
  };
  /** Связи по реквизитам и IP (возможные мультиаккаунты). Есть только при запросе с withLinks=1. */
  links?: {
    samePayment: AdminUserLinkRef[];
    sameIp: AdminUserLinkRef[];
  };
}
