import { describe, expect, it } from "vitest";
import { parseAdminComment } from "@/components/notifications/parseAdminComment";

describe("parseAdminComment", () => {
  it("должно отделить список аккаунтов от основного текста", () => {
    const result = parseAdminComment(
      "Заявка отклонена: мультиаккаунт.\n\nОбнаружены связи с другими аккаунтами:\n— Иван\n— Петр",
    );

    expect(result.body).toContain("мультиаккаунт");
    expect(result.linkedAccounts).toEqual(["Иван", "Петр"]);
  });

  it("должно вернуть весь текст если маркера нет", () => {
    const result = parseAdminComment("Спасибо за историю!");
    expect(result.body).toBe("Спасибо за историю!");
    expect(result.linkedAccounts).toHaveLength(0);
  });
});
