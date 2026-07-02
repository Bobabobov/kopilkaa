/**
 * Общие типы админки. Используются в app/admin и в hooks/admin.
 * Размещение в types/ чтобы hooks не зависели от app/.
 */

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApplicationEconomySummary = {
  userLevel: number;
  userLevelAtSubmit: number | null;
  helpLimit: number;
  submitBonusCost: number;
  isFirstFree: boolean;
  requestedAmount?: number;
  desiredAmount?: number | null;
};

export type ApplicationItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  desiredAmount?: number | null;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  adminComment: string | null;
  createdAt: string;
  clientDevice?: string | null;
  deviceFingerprint?: string | null;
  user: {
    email: string;
    id: string;
    name: string | null;
    username?: string | null;
    avatar: string | null;
    avatarFrame: string | null;
    hideEmail: boolean;
    level?: number;
  };
  images: { url: string; sort: number }[];
  economy?: ApplicationEconomySummary;
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
  sameDeviceCount: number;
  links: {
    sameIp: ApplicationIntegrityLink[];
    samePayment: ApplicationIntegrityLink[];
    sameDevice: ApplicationIntegrityLink[];
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
  effectiveApprovedApplications?: number;
  applicationStats?: {
    approvedTotal: number;
    rejectedTotal: number;
  };
  /** Связи по реквизитам и IP (возможные мультиаккаунты). Запрос с withLinks=1; поиск по всей базе заявок и выводов. */
  links?: {
    samePayment: AdminUserLinkRef[];
    sameIp: AdminUserLinkRef[];
  };
}
