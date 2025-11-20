// app/api/profile/me/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type SocialLinkType = "vk" | "telegram" | "youtube";

function sanitizeSocialLink(value: unknown, type: SocialLinkType): string | null {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Ссылка должна быть текстом");
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let normalized = trimmed;
  if (type === "telegram" && normalized.startsWith("@")) {
    const username = normalized.slice(1).trim();
    if (!username) {
      throw new Error("Укажите логин после @");
    }
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      throw new Error("Логин может содержать только буквы, цифры и _ (3-32 символа)");
    }
    normalized = `https://t.me/${username}`;
  }

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    if (type === "vk") {
      throw new Error("Введите ссылку вида https://vk.com/username");
    }
    if (type === "telegram") {
      throw new Error("Введите ссылку вида https://t.me/username");
    }
    throw new Error(
      "Введите ссылку вида https://youtube.com/... или https://youtu.be/...",
    );
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Ссылка должна начинаться с https://");
  }

  const host = parsed.hostname.toLowerCase();
  const allowedHostsMap: Record<SocialLinkType, string[]> = {
    vk: ["vk.com"],
    telegram: ["t.me", "telegram.me"],
    youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  };
  const allowedHosts = allowedHostsMap[type];

  const isAllowedHost = allowedHosts.some(
    (allowed) =>
      host === allowed ||
      host.endsWith(`.${allowed}`) ||
      (allowed.startsWith("*.") && host.endsWith(allowed.slice(1))),
  );
  if (!isAllowedHost) {
    throw new Error(
      type === "vk"
        ? "Можно указать только ссылку на vk.com"
        : type === "telegram"
          ? "Можно указать только ссылку на t.me или telegram.me"
          : "Можно указать только ссылку на youtube.com или youtu.be",
    );
  }

  if (!parsed.pathname || parsed.pathname === "/") {
    throw new Error(
      type === "youtube"
        ? "Добавьте ссылку на видео, канал или плейлист"
        : "Добавьте имя пользователя в ссылку",
    );
  }

  const sanitizedPath = parsed.pathname.replace(/\/+$/, "");
  if (!sanitizedPath || sanitizedPath === "") {
    throw new Error(
      type === "youtube"
        ? "Добавьте ссылку на видео, канал или плейлист"
        : "Добавьте имя пользователя в ссылку",
    );
  }

  const searchAndHash =
    type === "youtube" ? `${parsed.search}${parsed.hash}` : "";

  return `https://${host}${sanitizedPath}${searchAndHash}`;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Получаем пользователя без обновления lastSeen при каждом запросе
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        name: true,
        avatar: true,
        phone: true,
        phoneVerified: true,
        vkLink: true,
        telegramLink: true,
        youtubeLink: true,
        headerTheme: true,
        avatarFrame: true,
        hideEmail: true,
        lastSeen: true,
      },
    });

    // Обновляем lastSeen только если прошло больше 5 минут с последнего обновления
    if (user && user.lastSeen) {
      const lastSeenTime = new Date(user.lastSeen);
      const now = new Date();
      const diffInMinutes =
        (now.getTime() - lastSeenTime.getTime()) / (1000 * 60);

      if (diffInMinutes > 5) {
        // Обновляем lastSeen в фоне, не ждем результата
        prisma.user
          .update({
            where: { id: session.uid },
            data: { lastSeen: new Date() },
          })
          .catch(console.error);
      }
    } else if (user) {
      // Если lastSeen null, обновляем
      prisma.user
        .update({
          where: { id: session.uid },
          data: { lastSeen: new Date() },
        })
        .catch(console.error);
    }

    return Response.json(
      { user },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error in /api/profile/me:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, email, hideEmail, vkLink, telegramLink, youtubeLink } = body;

    // Валидация
    if (name !== undefined && (typeof name !== "string" || name.length > 100)) {
      return Response.json(
        { error: "Имя должно быть строкой не более 100 символов" },
        { status: 400 },
      );
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.includes("@") ||
        email.length > 255
      ) {
        return Response.json(
          { error: "Некорректный email адрес" },
          { status: 400 },
        );
      }

      // Проверяем, не занят ли email другим пользователем
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          id: { not: session.uid },
        },
      });

      if (existingUser) {
        return Response.json(
          { error: "Этот email уже используется другим пользователем" },
          { status: 400 },
        );
      }
    }

    if (hideEmail !== undefined && typeof hideEmail !== "boolean") {
      return Response.json(
        { error: "hideEmail должно быть булевым значением" },
        { status: 400 },
      );
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) {
      updateData.name = name.trim() || null;
    }
    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }
    if (hideEmail !== undefined) {
      updateData.hideEmail = hideEmail;
    }

    if (vkLink !== undefined) {
      try {
        updateData.vkLink = sanitizeSocialLink(vkLink, "vk");
      } catch (error) {
        return Response.json(
          {
            error:
              error instanceof Error ? error.message : "Некорректная ссылка на VK",
          },
          { status: 400 },
        );
      }
    }

    if (telegramLink !== undefined) {
      try {
        updateData.telegramLink = sanitizeSocialLink(telegramLink, "telegram");
      } catch (error) {
        return Response.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Некорректная ссылка на Telegram",
          },
          { status: 400 },
        );
      }
    }

    if (youtubeLink !== undefined) {
      try {
        updateData.youtubeLink = sanitizeSocialLink(youtubeLink, "youtube");
      } catch (error) {
        return Response.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Некорректная ссылка на YouTube",
          },
          { status: 400 },
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.uid },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        name: true,
        avatar: true,
        vkLink: true,
        telegramLink: true,
        youtubeLink: true,
        headerTheme: true,
        avatarFrame: true,
        hideEmail: true,
        lastSeen: true,
      },
    });

    return Response.json(
      { user },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
