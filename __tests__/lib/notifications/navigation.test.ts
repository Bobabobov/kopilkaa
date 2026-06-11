import { describe, expect, it } from "vitest";
import {
  getNotificationHref,
  getStatusModalActionLabel,
} from "@/lib/notifications/navigation";
import type { Notification } from "@/components/notifications/types";

function statusNotification(
  overrides: Partial<Notification> & Pick<Notification, "type">,
): Notification {
  return {
    id: "n1",
    title: "T",
    message: "M",
    timestamp: "1 мин",
    createdAt: new Date().toISOString(),
    isRead: false,
    ...overrides,
  };
}

describe("getNotificationHref", () => {
  it("должно вести на историю при одобренной заявке", () => {
    const href = getNotificationHref(
      statusNotification({
        type: "application_status",
        applicationId: "app1",
        status: "APPROVED",
      }),
    );
    expect(href).toBe("/stories/app1");
  });

  it("должно вести на заявки при отклонённой заявке", () => {
    const href = getNotificationHref(
      statusNotification({
        type: "application_status",
        applicationId: "app1",
        status: "REJECTED",
      }),
    );
    expect(href).toBe("/applications");
  });

  it("должно вести на добрые дела для выплат и отчётов", () => {
    expect(
      getNotificationHref(
        statusNotification({ type: "withdrawal_status", withdrawalId: "w1" }),
      ),
    ).toBe("/good-deeds");
    expect(
      getNotificationHref(
        statusNotification({
          type: "good_deed_submission_status",
          goodDeedSubmissionId: "s1",
        }),
      ),
    ).toBe("/good-deeds");
  });
});

describe("getStatusModalActionLabel", () => {
  it("должно вернуть подписи для разных типов", () => {
    expect(
      getStatusModalActionLabel(
        statusNotification({
          type: "application_status",
          status: "APPROVED",
          applicationId: "a",
        }),
      ),
    ).toBe("Открыть историю");

    expect(
      getStatusModalActionLabel(
        statusNotification({ type: "good_deed_submission_status" }),
      ),
    ).toBe("К добрым делам");
  });
});
