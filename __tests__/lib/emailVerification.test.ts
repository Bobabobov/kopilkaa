import { describe, expect, it } from "vitest";
import { hashEmailVerificationToken } from "@/lib/emailVerification";

describe("hashEmailVerificationToken", () => {
  it("должно возвращать одинаковый хэш при пробелах вокруг токена", () => {
    const raw = "test-token-value-123456789012";
    expect(hashEmailVerificationToken(raw)).toBe(
      hashEmailVerificationToken(`  ${raw}  `),
    );
  });
});
