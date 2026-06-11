import { describe, expect, it } from "vitest";
import {
  mapUserNotificationRow,
  parseNotificationPayload,
} from "@/lib/notifications/userNotificationTypes";

describe("parseNotificationPayload", () => {
  it("должно вернуть пустой объект когда payload пустой", () => {
    expect(parseNotificationPayload(null)).toEqual({});
    expect(parseNotificationPayload("")).toEqual({});
  });

  it("должно распарсить linkedAccounts из JSON", () => {
    const payload = {
      linkedAccounts: [
        { userId: "u1", userLabel: "User 1", userAvatar: null },
      ],
      applicationId: "app1",
    };
    expect(parseNotificationPayload(JSON.stringify(payload))).toEqual(payload);
  });
});

describe("mapUserNotificationRow", () => {
  const baseRow = {
    id: "n1",
    type: "application_status",
    entityId: "app1",
    status: "REJECTED",
    title: "Заявка отклонена",
    message: "❌ Отклонена",
    adminComment: "Мультиаккаунт",
    payload: JSON.stringify({
      applicationId: "app1",
      linkedAccounts: [
        { userId: "u2", userLabel: "Другой", userAvatar: "/a.png" },
      ],
    }),
    createdAt: new Date("2026-06-10T12:00:00.000Z"),
    modalDismissedAt: null,
    timestamp: "только что",
  };

  it("должно смапить заявку с linkedAccounts и статусом из БД", () => {
    const notification = mapUserNotificationRow(baseRow);

    expect(notification.type).toBe("application_status");
    expect(notification.status).toBe("REJECTED");
    expect(notification.applicationId).toBe("app1");
    expect(notification.linkedAccounts).toHaveLength(1);
    expect(notification.isRead).toBe(false);
  });

  it("должно помечать isRead когда modalDismissedAt задан", () => {
    const notification = mapUserNotificationRow({
      ...baseRow,
      modalDismissedAt: new Date(),
    });

    expect(notification.isRead).toBe(true);
  });

  it("должно смапить good_deed_submission_status", () => {
    const notification = mapUserNotificationRow({
      ...baseRow,
      type: "good_deed_submission_status",
      entityId: "sub1",
      status: "APPROVED",
      payload: JSON.stringify({ goodDeedSubmissionId: "sub1" }),
    });

    expect(notification.type).toBe("good_deed_submission_status");
    expect(notification.goodDeedSubmissionId).toBe("sub1");
    expect(notification.status).toBe("APPROVED");
  });
});
