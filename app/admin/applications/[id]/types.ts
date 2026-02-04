// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";

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
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
};
