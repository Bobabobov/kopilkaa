import { describe, expect, it } from "vitest";
import {
  buildMultiAccountRejectComment,
  collectLinkedAccounts,
} from "@/lib/admin/buildMultiAccountRejectComment";

describe("buildMultiAccountRejectComment", () => {
  it("должно перечислить связанные аккаунты", () => {
    const text = buildMultiAccountRejectComment([
      { userId: "u2", userLabel: "Иван", userAvatar: null },
      { userId: "u3", userLabel: "petr@test.ru", userAvatar: null },
    ]);

    expect(text).toContain("нескольких аккаунтов запрещено");
    expect(text).toContain("Иван");
    expect(text).toContain("petr@test.ru");
  });

  it("должно сообщить если связей нет", () => {
    const text = buildMultiAccountRejectComment([]);
    expect(text).toContain("не обнаружены");
  });
});

describe("collectLinkedAccounts", () => {
  it("должно собрать уникальные аккаунты из integrity", () => {
    const accounts = collectLinkedAccounts({
      isClean: false,
      verdict: "Есть подозрения",
      reasons: [
        {
          key: "same-ip",
          message: "test",
          accounts: [
            { userId: "u2", userLabel: "А", userAvatar: null },
          ],
        },
      ],
      submitterIp: "1.1.1.1",
      sameIpCount: 1,
      samePaymentCount: 0,
      links: {
        sameIp: [],
        samePayment: [
          {
            kind: "application",
            id: "a2",
            userId: "u3",
            userLabel: "Б",
            userAvatar: null,
          },
        ],
      },
    });

    expect(accounts).toHaveLength(2);
    expect(accounts.map((a) => a.userLabel)).toEqual(["А", "Б"]);
  });
});
