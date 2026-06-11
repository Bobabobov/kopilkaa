import type { Notification } from "@/components/notifications/types";

export function getNotificationHref(notification: Notification): string | null {
  if (
    notification.type === "application_status" &&
    notification.applicationId
  ) {
    return notification.status === "APPROVED"
      ? `/stories/${notification.applicationId}`
      : "/applications";
  }

  if (
    notification.type === "withdrawal_status" ||
    notification.type === "good_deed_submission_status"
  ) {
    return "/good-deeds";
  }

  if (
    (notification.type === "like" ||
      notification.type === "story_comment") &&
    notification.applicationId
  ) {
    const hash =
      notification.type === "story_comment" ? "#story-comments" : "";
    return `/stories/${notification.applicationId}${hash}`;
  }

  if (notification.type === "friend_request") {
    return "/friends?tab=received";
  }

  return null;
}

export function getStatusModalActionLabel(
  notification: Notification,
): string {
  if (
    notification.type === "withdrawal_status" ||
    notification.type === "good_deed_submission_status"
  ) {
    return "К добрым делам";
  }
  if (
    notification.type === "application_status" &&
    notification.status === "APPROVED"
  ) {
    return "Открыть историю";
  }
  return "Открыть заявки";
}

export function getStatusModalStatusLine(notification: Notification): string {
  if (notification.type === "withdrawal_status") {
    return "Обновление по выплате";
  }
  if (notification.type === "good_deed_submission_status") {
    return "Обновление по доброму делу";
  }
  return "Обновление по заявке";
}
