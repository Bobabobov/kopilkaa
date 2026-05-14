import { describe, expect, it } from "vitest";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";

describe("digitsFingerprint", () => {
  it("должно вернуть только цифры длиной >= 10", () => {
    expect(digitsFingerprint("2202 2000 1234 5678")).toBe("2202200012345678");
  });

  it("должно вернуть null если цифр меньше 10", () => {
    expect(digitsFingerprint("12345 678")).toBeNull();
  });
});
