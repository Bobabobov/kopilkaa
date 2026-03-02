// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";

export type SameApplicationRef = {
  id: string;
  createdAt: string;
  user: { id: string; email: string | null; name: string | null };
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
};
