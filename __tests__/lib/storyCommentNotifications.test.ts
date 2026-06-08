import { describe, expect, it } from "vitest";

import { fetchStoryCommentNotifications } from "@/lib/notifications/storyCommentNotifications";

describe("fetchStoryCommentNotifications", () => {
  it("должно вернуть пустой массив когда комментариев нет", async () => {
    const items = await fetchStoryCommentNotifications(
      "nonexistent-user-id-12345",
      5,
    );
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(0);
  });
});
