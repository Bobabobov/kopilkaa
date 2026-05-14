import { describe, expect, it } from "vitest";
import {
  clientIpStorageVariants,
  extractClientIpFromRequest,
  normalizeClientIp,
} from "@/lib/http/clientIp";

describe("normalizeClientIp", () => {
  it("должно снять префикс ::ffff: для IPv4-mapped", () => {
    expect(normalizeClientIp("::ffff:192.168.0.1")).toBe("192.168.0.1");
  });

  it("должно вернуть null для пустой строки", () => {
    expect(normalizeClientIp("  ")).toBeNull();
  });
});

describe("clientIpStorageVariants", () => {
  it("должно добавить вариант ::ffff: для IPv4", () => {
    const v = clientIpStorageVariants("10.0.0.5");
    expect(v).toContain("10.0.0.5");
    expect(v).toContain("::ffff:10.0.0.5");
  });
});

describe("extractClientIpFromRequest", () => {
  it("должно предпочесть cf-connecting-ip перед x-forwarded-for", () => {
    const req = new Request("https://example.com/", {
      headers: {
        "cf-connecting-ip": "203.0.113.9",
        "x-forwarded-for": "198.51.100.1, 198.51.100.2",
      },
    });
    expect(extractClientIpFromRequest(req)).toBe("203.0.113.9");
  });

  it("должно взять первый адрес из x-forwarded-for", () => {
    const req = new Request("https://example.com/", {
      headers: { "x-forwarded-for": " 198.51.100.7 , 10.0.0.1 " },
    });
    expect(extractClientIpFromRequest(req)).toBe("198.51.100.7");
  });
});
