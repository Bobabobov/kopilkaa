// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SameApplicationRef = {
  id: string;
  createdAt: string;
  user: { id: string; email: string | null; name: string | null };
  /** Необязательные поля для более подробного описания связанных заявок */
  status?: ApplicationStatus;
  title?: string | null;
  amount?: number | null;
  summary?: string | null;
};

export type ApplicationReview = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: { url: string; sort: number }[];
};

export type PreviousApprovedWithReview = {
  id: string;
  title: string;
  createdAt: string;
  review: {
    id: string;
    content: string;
    createdAt: string;
    images: { url: string; sort: number }[];
  } | null;
};

export type ApplicationItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  /** Категория помощи из формы подачи */
  category?:
    | "FOOD_DRINKS"
    | "HOUSEHOLD_ESSENTIALS"
    | "TRANSPORT_COMMS"
    | "SMALL_GIFT"
    | "EVERYDAY_SUPPORT";
  amount: number;
  desiredAmount?: number | null;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  adminComment: string | null;
  filledMs?: number | null;
  storyEditMs?: number | null;
  submitterIp?: string | null;
  clientDevice?: string | null;
  clientTimezone?: string | null;
  deviceFingerprint?: string | null;
  createdAt: string;
  user: {
    email: string;
    id: string;
    name?: string | null;
    avatar?: string | null;
    phoneVerified?: boolean;
  };
  images: { url: string; sort: number }[];
  samePaymentApplications?: SameApplicationRef[];
  sameIpApplications?: SameApplicationRef[];
  sameDeviceApplications?: SameApplicationRef[];
  review?: ApplicationReview | null;
  /** Последняя одобренная заявка пользователя и её отзыв (для проверки перед одобрением) */
  previousApprovedWithReview?: PreviousApprovedWithReview | null;
  economy?: import('./_components/ApplicationEconomyBlock').ApplicationEconomyAdminInfo;
};
