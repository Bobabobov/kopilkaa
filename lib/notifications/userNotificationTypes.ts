import type { Notification } from "@/components/notifications/types";
import type { ApplicationIntegrityAccount } from "@/types/admin";

export const STATUS_NOTIFICATION_TYPES = [
  "application_status",
  "withdrawal_status",
  "good_deed_submission_status",
] as const;

export type StatusNotificationType = (typeof STATUS_NOTIFICATION_TYPES)[number];

export type StatusNotificationPayload = {
  linkedAccounts?: ApplicationIntegrityAccount[];
  applicationId?: string;
  withdrawalId?: string;
  goodDeedSubmissionId?: string;
};

export function isStatusNotificationType(
  type: string,
): type is StatusNotificationType {
  return (STATUS_NOTIFICATION_TYPES as readonly string[]).includes(type);
}

export function parseNotificationPayload(
  raw: string | null | undefined,
): StatusNotificationPayload {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as StatusNotificationPayload;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function mapUserNotificationRow(row: {
  id: string;
  type: string;
  entityId: string;
  status: string;
  title: string;
  message: string;
  adminComment: string | null;
  payload: string | null;
  createdAt: Date;
  updatedAt?: Date;
  modalDismissedAt: Date | null;
  timestamp: string;
}): Notification {
  const payload = parseNotificationPayload(row.payload);
  const status = row.status as "APPROVED" | "REJECTED";
  const eventAt = row.updatedAt ?? row.createdAt;

  const base: Notification = {
    id: row.id,
    type: row.type as Notification["type"],
    title: row.title,
    message: row.message,
    adminComment: row.adminComment,
    avatar: null,
    createdAt: eventAt.toISOString(),
    timestamp: row.timestamp,
    isRead: row.modalDismissedAt !== null,
    status,
  };

  if (row.type === "application_status") {
    return {
      ...base,
      applicationId: row.entityId,
      linkedAccounts: payload.linkedAccounts,
    };
  }

  if (row.type === "withdrawal_status") {
    return { ...base, withdrawalId: row.entityId };
  }

  if (row.type === "good_deed_submission_status") {
    return { ...base, goodDeedSubmissionId: row.entityId };
  }

  return base;
}
