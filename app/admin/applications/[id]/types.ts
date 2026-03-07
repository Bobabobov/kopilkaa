// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";

export type SameApplicationRef = {
  id: string;
  createdAt: string;
  user: { id: string; email: string | null; name: string | null };
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
  amount: number;
  payment: string;
  bankName?: string | null;
  status: ApplicationStatus;
  publishInStories: boolean;
  adminComment: string | null;
  filledMs?: number | null;
  storyEditMs?: number | null;
  submitterIp?: string | null;
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
  samePaymentApplications?: SameApplicationRef[];
  sameIpApplications?: SameApplicationRef[];
  review?: ApplicationReview | null;
  /** Последняя одобренная заявка пользователя и её отзыв (для проверки перед одобрением) */
  previousApprovedWithReview?: PreviousApprovedWithReview | null;
};
