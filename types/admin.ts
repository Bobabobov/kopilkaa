/**
 * Общие типы админки. Используются в app/admin и в hooks/admin.
 * Размещение в types/ чтобы hooks не зависели от app/.
 */
import type { TrustLevel } from "@/lib/trustLevel";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApplicationItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  adminComment: string | null;
  createdAt: string;
  countTowardsTrust: boolean;
  trustDecreasedAtDecision?: boolean;
  clientDevice?: string | null;
  user: {
    email: string;
    id: string;
    name: string | null;
    username?: string | null;
    avatar: string | null;
    avatarFrame: string | null;
    hideEmail: boolean;
    trustDelta?: number;
  };
  images: { url: string; sort: number }[];
  integrity?: ApplicationIntegrity;
};

export type ApplicationIntegrityLink = {
  kind: "application" | "withdrawal";
  id: string;
  userId: string;
  userLabel: string;
  userAvatar: string | null;
  title?: string;
  status?: ApplicationStatus;
};

export type ApplicationIntegrityAccount = {
  userId: string;
  userLabel: string;
  userAvatar: string | null;
};

export type ApplicationIntegrityReason = {
  key: string;
  message: string;
  accounts?: ApplicationIntegrityAccount[];
};

export type ApplicationIntegrity = {
  isClean: boolean;
  verdict: string;
  reasons: ApplicationIntegrityReason[];
  submitterIp: string | null;
  sameIpCount: number;
  samePaymentCount: number;
  links: {
    sameIp: ApplicationIntegrityLink[];
    samePayment: ApplicationIntegrityLink[];
  };
};

export type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  totalAmount: number;
};

export type StatusModal = {
  id: string;
  status: ApplicationStatus;
  comment: string;
  decreaseTrustOnDecision: boolean;
  linkedAccounts?: ApplicationIntegrityAccount[];
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
  /** Для регистрации по почте: false — ждёт подтверждения ссылки. OAuth обычно true. */
  emailVerified?: boolean;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  lastSeen: string | null;
  role: string;
  markedAsDeceiver?: boolean;
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
  /** Связи по реквизитам и IP (возможные мультиаккаунты). Запрос с withLinks=1; поиск по всей базе заявок и выводов. */
  links?: {
    samePayment: AdminUserLinkRef[];
    sameIp: AdminUserLinkRef[];
  };
}
