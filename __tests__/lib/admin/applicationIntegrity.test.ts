import { describe, expect, it } from "vitest";
import { buildApplicationIntegrity } from "@/lib/admin/applicationIntegrity";

describe("buildApplicationIntegrity", () => {
  it("должно вернуть чистую заявку когда нет совпадений", () => {
    const result = buildApplicationIntegrity({
      applicationId: "a1",
      userId: "u1",
      submitterIp: "10.0.0.1",
      markedAsDeceiver: false,
      sameIpMatches: [],
      samePaymentMatches: [],
    });

    expect(result.isClean).toBe(true);
    expect(result.verdict).toBe("Заявка чистая");
    expect(result.reasons[0]?.message).toContain("не найдено");
  });

  it("должно указать подозрение по IP других аккаунтов", () => {
    const result = buildApplicationIntegrity({
      applicationId: "a1",
      userId: "u1",
      submitterIp: "10.0.0.5",
      markedAsDeceiver: false,
      sameIpMatches: [
        {
          kind: "application",
          id: "a2",
          userId: "u2",
          userName: "Иван",
          userEmail: "ivan@test.ru",
          userAvatar: "/uploads/a.png",
          title: "Другая заявка",
          status: "PENDING",
        },
      ],
      samePaymentMatches: [],
    });

    expect(result.isClean).toBe(false);
    expect(result.verdict).toBe("Есть подозрения");
    const ipReason = result.reasons.find((r) => r.key === "same-ip");
    expect(ipReason?.message).toContain("10.0.0.5");
    expect(ipReason?.accounts?.[0]?.userLabel).toBe("Иван");
    expect(ipReason?.accounts?.[0]?.userId).toBe("u2");
  });

  it("должно игнорировать совпадения того же пользователя", () => {
    const result = buildApplicationIntegrity({
      applicationId: "a1",
      userId: "u1",
      submitterIp: "10.0.0.5",
      markedAsDeceiver: false,
      sameIpMatches: [
        {
          kind: "application",
          id: "a2",
          userId: "u1",
          userName: "Сам",
          userEmail: null,
          userAvatar: null,
          title: "Старая заявка",
          status: "APPROVED",
        },
      ],
      samePaymentMatches: [],
    });

    expect(result.isClean).toBe(true);
  });

  it("должно указать совпадение реквизитов и метку обманщика", () => {
    const result = buildApplicationIntegrity({
      applicationId: "a1",
      userId: "u1",
      submitterIp: null,
      markedAsDeceiver: true,
      sameIpMatches: [],
      samePaymentMatches: [
        {
          kind: "withdrawal",
          id: "w1",
          userId: "u3",
          userName: null,
          userEmail: "other@test.ru",
          userAvatar: null,
        },
      ],
    });

    expect(result.isClean).toBe(false);
    expect(
      result.reasons.some((r) => r.message.includes("Обманывал")),
    ).toBe(true);
    expect(
      result.reasons.some((r) => r.message.includes("выводами бонусов")),
    ).toBe(true);
    expect(
      result.reasons.find((r) => r.key === "same-payment-withdrawals")
        ?.accounts?.[0]?.userLabel,
    ).toBe("other@test.ru");
  });
});
