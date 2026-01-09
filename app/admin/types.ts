// app/admin/types.ts
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
  user: {
    email: string;
    id: string;
    name: string | null;
    avatar: string | null;
    avatarFrame: string | null;
    hideEmail: boolean;
  };
  images: { url: string; sort: number }[];
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
};

export type LightboxState = {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
};
