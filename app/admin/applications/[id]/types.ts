// app/admin/applications/[id]/types.ts
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApplicationItem = {
  id: string;
  title: string;
  summary: string;
  story: string;
  amount: number;
  payment: string;
  status: ApplicationStatus;
  adminComment: string | null;
  createdAt: string;
  user: { email: string; id: string };
  images: { url: string; sort: number }[];
};


