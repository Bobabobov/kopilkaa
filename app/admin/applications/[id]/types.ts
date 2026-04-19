// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";

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
  reportImages?: { url: string; sort: number }[];
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
    | "GAME_OR_SERVICE"
    | "EVERYDAY_SUPPORT";
  amount: number;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  publishInStories: boolean;
  adminComment: string | null;
  filledMs?: number | null;
  storyEditMs?: number | null;
  submitterIp?: string | null;
  clientDevice?: string | null;
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
  samePaymentApplications?: SameApplicationRef[];
  sameIpApplications?: SameApplicationRef[];
  review?: ApplicationReview | null;
  countTowardsTrust?: boolean;
  trustDecreasedAtDecision?: boolean;
  /** Последняя одобренная заявка пользователя и её отзыв (для проверки перед одобрением) */
  previousApprovedWithReview?: PreviousApprovedWithReview | null;
};
