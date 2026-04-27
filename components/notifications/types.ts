// components/notifications/types.ts

export interface Notification {
  id: string;
  type:
    | "like"
    | "system"
    | "application_status"
    | "withdrawal_status"
    | "good_deed_submission_status"
    | "friend_request";
  title: string;
  message: string;
  adminComment?: string | null;
  avatar?: string | null;
  timestamp: string;
  createdAt: string;
  isRead: boolean;
  rarity?: string;
  applicationId?: string;
  withdrawalId?: string;
  goodDeedSubmissionId?: string;
  status?: "APPROVED" | "REJECTED" | "CONTEST";
  friendshipId?: string;
  requesterId?: string;
}

export type NotificationType = Notification["type"];
