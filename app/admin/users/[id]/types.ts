import type { AdminUserLinkRef } from '@/types/admin';
import type { UserBonusLedger } from '@/lib/admin/bonusLedger';

export type AdminUserApplicationRef = {
  id: string;
  title: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amount: number;
  category: string;
  createdAt: string;
  submitterIp: string | null;
  clientDevice: string | null;
  clientTimezone: string | null;
  deviceFingerprintShort: string | null;
  isFirstFree: boolean;
  submitBonusCost: number;
};

export type AdminUserDetail = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  lastSeen: string | null;
  lastCommentAt: string | null;
  level: number;
  experience: number;
  bonusesInvestedInExperience: number;
  isBanned: boolean;
  bannedUntil: string | null;
  bannedReason: string | null;
  bonusWithdrawalBlocked: boolean;
  adminEconomyResetAt: string | null;
  telegramUsername: string | null;
  telegramId: string | null;
  googleEmail: string | null;
  googleId: string | null;
  vkLink: string | null;
  telegramLink: string | null;
  youtubeLink: string | null;
  referralCode: string | null;
  hideEmail: boolean;
  hideFromHeroes: boolean;
  heroBadgeOverride: string | null;
  maxSequenceRecord: number;
  headerTheme: string | null;
  linkCount: number;
  auth: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasGoogle: boolean;
    hasTelegram: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  applicationStats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  applications: AdminUserApplicationRef[];
  links: {
    samePayment: AdminUserLinkRef[];
    sameIp: AdminUserLinkRef[];
    sameDevice: AdminUserLinkRef[];
  };
  wallet: {
    availableBonuses: number;
    grossBonuses: number;
    withdrawnBonuses: number;
    pendingWithdrawalBonuses: number;
    withdrawalBlocked: boolean;
    bonusesInvestedInExperience: number;
    totalEarnedBonuses: number;
  };
  reviews: {
    id: string;
    content: string;
    applicationId: string | null;
    applicationTitle: string | null;
    createdAt: string;
  }[];
  goodDeeds: {
    stats: { pending: number; approved: number; rejected: number; total: number };
    submissions: {
      id: string;
      taskTitle: string;
      status: string;
      reward: number;
      createdAt: string;
    }[];
    withdrawals: {
      stats: { pending: number; approved: number; rejected: number; total: number };
      items: {
        id: string;
        amountBonuses: number;
        status: string;
        bankName: string;
        createdAt: string;
      }[];
    };
  };
  referrals: {
    clicksCount: number;
    invitedCount: number;
    invited: {
      userId: string;
      name: string | null;
      email: string | null;
      username: string | null;
      registeredAt: string;
      bonusGrantedAt: string | null;
    }[];
    referredBy: {
      userId: string;
      name: string | null;
      email: string | null;
      username: string | null;
      registeredAt: string;
    } | null;
  };
  social: {
    friendsAccepted: number;
    friendsPending: number;
    donationsCount: number;
    donationsTotal: number;
  };
  achievements: {
    slug: string;
    name: string;
    rarity: string;
    unlockedAt: string;
  }[];
  loginStreak: {
    current: number;
    max: number;
    lastVisitDate: string | null;
  } | null;
  bonusLedger: UserBonusLedger;
  techTrace: {
    ips: string[];
    devices: { fingerprintShort: string | null; clientDevice: string | null }[];
  };
};
