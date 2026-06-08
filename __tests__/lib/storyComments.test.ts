import { describe, expect, it } from "vitest";

import {
  buildStoryCommentThreads,
  commentContainsLink,
  getCommentCooldownSecondsRemaining,
  normalizeStoryCommentContent,
  parseStoryCommentParentId,
  sanitizeNotificationTextSnippet,
  sanitizePlainTextComment,
  STORY_COMMENT_COOLDOWN_MS,
  STORY_COMMENT_MAX_LENGTH,
  STORY_COMMENT_MIN_LENGTH,
  canManageStoryComment,
  compareStoryCommentsByRank,
  isStoryCommentEdited,
  resolveStoryCommentPermissions,
  sortStoryCommentThreads,
  validateStoryCommentContent,
} from "@/lib/stories/storyComments";

describe("normalizeStoryCommentContent", () => {
  it("должно принять текст в допустимых границах", () => {
    expect(normalizeStoryCommentContent("  Привет!  ")).toBe("Привет!");
  });

  it("должно отклонить слишком короткий текст", () => {
    expect(normalizeStoryCommentContent("a")).toBeNull();
  });

  it("должно отклонить слишком длинный текст", () => {
    expect(
      normalizeStoryCommentContent("x".repeat(STORY_COMMENT_MAX_LENGTH + 1)),
    ).toBeNull();
  });

  it("должно отклонить нестроковое значение", () => {
    expect(normalizeStoryCommentContent(123)).toBeNull();
  });
});

describe("getCommentCooldownSecondsRemaining", () => {
  it("должно вернуть null когда кулдаун истёк", () => {
    const past = new Date(Date.now() - STORY_COMMENT_COOLDOWN_MS - 1000);
    expect(getCommentCooldownSecondsRemaining(past)).toBeNull();
  });

  it("должно вернуть оставшиеся секунды во время кулдауна", () => {
    const recent = new Date(Date.now() - 10_000);
    const left = getCommentCooldownSecondsRemaining(recent);
    expect(left).toBeGreaterThan(0);
    expect(left).toBeLessThanOrEqual(
      Math.ceil(STORY_COMMENT_COOLDOWN_MS / 1000),
    );
  });
});

describe("sanitizePlainTextComment", () => {
  it("должно удалить HTML-теги и оставить безопасный текст", () => {
    expect(
      sanitizePlainTextComment('<script>alert("xss")</script>Привет'),
    ).toBe("Привет");
  });

  it("должно удалить опасные URL-схемы", () => {
    expect(sanitizePlainTextComment("Смотри javascript:alert(1)")).toBe(
      "Смотри alert(1)",
    );
  });

  it("должно удалить bidi-override символы", () => {
    expect(sanitizePlainTextComment("текст\u202Eподмена")).toBe("текстподмена");
  });
});

describe("commentContainsLink", () => {
  it("должно обнаружить https-ссылку", () => {
    expect(commentContainsLink("Смотри https://example.com/page")).toBe(true);
  });

  it("должно обнаружить www-ссылку", () => {
    expect(commentContainsLink("Зайди на www.example.com")).toBe(true);
  });

  it("должно обнаружить домен без схемы", () => {
    expect(commentContainsLink("Пишите на example.ru")).toBe(true);
  });

  it("должно пропустить обычный текст без ссылок", () => {
    expect(commentContainsLink("Спасибо за историю, очень вдохновляет!")).toBe(
      false,
    );
  });
});

describe("validateStoryCommentContent", () => {
  it("должно отклонить комментарий со ссылкой", () => {
    expect(
      validateStoryCommentContent("Отлично! https://spam.test/x"),
    ).toEqual({ ok: false, code: "links" });
  });

  it("должно принять комментарий без ссылок", () => {
    expect(validateStoryCommentContent("  Спасибо большое!  ")).toEqual({
      ok: true,
      content: "Спасибо большое!",
    });
  });
});

describe("sanitizeNotificationTextSnippet", () => {
  it("должно схлопывать переводы строк в одну строку", () => {
    expect(sanitizeNotificationTextSnippet("строка\nдве", 40)).toBe("строка две");
  });
});

describe("parseStoryCommentParentId", () => {
  it("должно вернуть null для пустого parentId", () => {
    expect(parseStoryCommentParentId(null)).toBeNull();
    expect(parseStoryCommentParentId("")).toBeNull();
  });

  it("должно принять валидный id", () => {
    expect(parseStoryCommentParentId("clxyz123abc")).toBe("clxyz123abc");
  });

  it("должно отклонить невалидный id", () => {
    expect(parseStoryCommentParentId("<script>")).toBeNull();
  });
});

function makeCommentRow(params: {
  id: string;
  parentId: string | null;
  content: string;
  createdAt: Date;
  userId: string;
  name: string;
  parent?: {
    id: string;
    userId: string;
    name: string;
  } | null;
}) {
  return {
    id: params.id,
    parentId: params.parentId,
    content: params.content,
    createdAt: params.createdAt,
    updatedAt: params.createdAt,
    _count: { likes: 0 },
    userId: params.userId,
    user: {
      id: params.userId,
      name: params.name,
      username: null,
      avatar: null,
      avatarFrame: null,
      vkLink: null,
      telegramLink: null,
      youtubeLink: null,
      markedAsDeceiver: false,
    },
    parent: params.parent
      ? {
          id: params.parent.id,
          userId: params.parent.userId,
          user: {
            id: params.parent.userId,
            name: params.parent.name,
            username: null,
            avatar: null,
            avatarFrame: null,
            vkLink: null,
            telegramLink: null,
            youtubeLink: null,
            markedAsDeceiver: false,
          },
        }
      : null,
  };
}

describe("buildStoryCommentThreads", () => {
  it("должно собрать многоуровневую ветку ответов", () => {
    const now = new Date("2026-06-08T12:00:00.000Z");
    const threads = buildStoryCommentThreads(
      [
        makeCommentRow({
          id: "root1",
          parentId: null,
          content: "Корень",
          createdAt: now,
          userId: "u1",
          name: "Анна",
        }),
        makeCommentRow({
          id: "reply1",
          parentId: "root1",
          content: "Ответ 1",
          createdAt: new Date("2026-06-08T12:01:00.000Z"),
          userId: "u2",
          name: "Борис",
          parent: { id: "root1", userId: "u1", name: "Анна" },
        }),
        makeCommentRow({
          id: "reply2",
          parentId: "reply1",
          content: "Ответ 2",
          createdAt: new Date("2026-06-08T12:02:00.000Z"),
          userId: "u3",
          name: "Света",
          parent: { id: "reply1", userId: "u2", name: "Борис" },
        }),
      ],
      null,
    );

    expect(threads).toHaveLength(1);
    expect(threads[0].replies).toHaveLength(1);
    expect(threads[0].replies[0].id).toBe("reply1");
    expect(threads[0].replies[0].replyTo?.user.name).toBe("Анна");
    expect(threads[0].replies[0].replies).toHaveLength(1);
    expect(threads[0].replies[0].replies[0].replyTo?.user.name).toBe("Борис");
  });
});

describe("resolveStoryCommentPermissions", () => {
  it("должно разрешить админу комментировать без кулдауна", () => {
    expect(
      resolveStoryCommentPermissions({
        isAdmin: true,
        approvedApplications: 0,
        lastCommentAt: new Date(),
      }),
    ).toEqual({
      canComment: true,
      cooldownSecondsRemaining: null,
    });
  });

  it("должно требовать одобренную заявку для обычного пользователя", () => {
    expect(
      resolveStoryCommentPermissions({
        isAdmin: false,
        approvedApplications: 0,
        lastCommentAt: null,
      }),
    ).toEqual({
      canComment: false,
      cooldownSecondsRemaining: null,
    });
  });
});

describe("compareStoryCommentsByRank", () => {
  it("должно сортировать сначала по лайкам, затем по дате", () => {
    expect(
      compareStoryCommentsByRank(
        { likeCount: 1, createdAt: "2026-06-08T12:00:00.000Z" },
        { likeCount: 3, createdAt: "2026-06-08T11:00:00.000Z" },
      ),
    ).toBeGreaterThan(0);

    expect(
      compareStoryCommentsByRank(
        { likeCount: 2, createdAt: "2026-06-08T10:00:00.000Z" },
        { likeCount: 2, createdAt: "2026-06-08T12:00:00.000Z" },
      ),
    ).toBeGreaterThan(0);
  });
});

describe("sortStoryCommentThreads", () => {
  it("должно поднять корневой комментарий с большим числом лайков", () => {
    const sorted = sortStoryCommentThreads([
      {
        id: "a",
        parentId: null,
        content: "A",
        createdAt: "2026-06-08T12:00:00.000Z",
        updatedAt: "2026-06-08T12:00:00.000Z",
        isEdited: false,
        canEdit: false,
        canDelete: false,
        likeCount: 1,
        isLiked: false,
        replyTo: null,
        user: {
          id: "u1",
          name: "A",
          username: null,
          avatar: null,
          avatarFrame: null,
          vkLink: null,
          telegramLink: null,
          youtubeLink: null,
          markedAsDeceiver: false,
          isSelf: false,
        },
        replies: [],
      },
      {
        id: "b",
        parentId: null,
        content: "B",
        createdAt: "2026-06-08T11:00:00.000Z",
        updatedAt: "2026-06-08T11:00:00.000Z",
        isEdited: false,
        canEdit: false,
        canDelete: false,
        likeCount: 5,
        isLiked: false,
        replyTo: null,
        user: {
          id: "u2",
          name: "B",
          username: null,
          avatar: null,
          avatarFrame: null,
          vkLink: null,
          telegramLink: null,
          youtubeLink: null,
          markedAsDeceiver: false,
          isSelf: false,
        },
        replies: [],
      },
    ]);

    expect(sorted[0].id).toBe("b");
  });
});

describe("canManageStoryComment", () => {
  it("должно разрешить управление автору и админу", () => {
    expect(
      canManageStoryComment({
        viewerId: "u1",
        commentUserId: "u1",
        isAdmin: false,
      }),
    ).toBe(true);
    expect(
      canManageStoryComment({
        viewerId: "u2",
        commentUserId: "u1",
        isAdmin: true,
      }),
    ).toBe(true);
    expect(
      canManageStoryComment({
        viewerId: "u2",
        commentUserId: "u1",
        isAdmin: false,
      }),
    ).toBe(false);
    expect(
      canManageStoryComment({
        viewerId: null,
        commentUserId: "u1",
        isAdmin: false,
      }),
    ).toBe(false);
  });
});

describe("isStoryCommentEdited", () => {
  it("должно определить изменённый комментарий по updatedAt", () => {
    const createdAt = new Date("2026-06-08T12:00:00.000Z");
    expect(isStoryCommentEdited(createdAt, createdAt)).toBe(false);
    expect(
      isStoryCommentEdited(
        createdAt,
        new Date("2026-06-08T12:05:00.000Z"),
      ),
    ).toBe(true);
  });
});

describe("story comment limits", () => {
  it("должно иметь минимум не больше максимума", () => {
    expect(STORY_COMMENT_MIN_LENGTH).toBeLessThan(STORY_COMMENT_MAX_LENGTH);
  });
});
