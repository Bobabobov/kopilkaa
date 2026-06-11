import { describe, expect, it } from "vitest";
import {
  isRejectAdminComment,
  resolveApplicationNotificationStatus,
} from "@/lib/admin/applicationCommentStatus";
import { buildMultiAccountRejectComment } from "@/lib/admin/buildMultiAccountRejectComment";

describe("resolveApplicationNotificationStatus", () => {
  it("должно показать отказ когда в БД APPROVED, а комментарий — мультиаккаунт", () => {
    const comment = buildMultiAccountRejectComment([
      { userId: "u1", userLabel: "test", userAvatar: null },
    ]);

    expect(resolveApplicationNotificationStatus("APPROVED", comment)).toBe(
      "REJECTED",
    );
  });

  it("должно оставить отказ в БД даже при тексте одобрения в комментарии", () => {
    expect(
      resolveApplicationNotificationStatus(
        "REJECTED",
        "Заявка одобрена. Спасибо за подробное и честное описание ситуации.",
      ),
    ).toBe("REJECTED");
  });

  it("должно оставить одобрение при согласованном комментарии", () => {
    expect(
      resolveApplicationNotificationStatus(
        "APPROVED",
        "Заявка одобрена. Спасибо за историю.",
      ),
    ).toBe("APPROVED");
  });
});

describe("isRejectAdminComment", () => {
  it("должно распознать шаблон отказа", () => {
    expect(
      isRejectAdminComment(
        "Заявка отклонена: использование нескольких аккаунтов запрещено правилами платформы.",
      ),
    ).toBe(true);
  });
});
