// app/api/profile/me/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
    const { name, email, hideEmail } = body;

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

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name.trim() || null;
    }
    if (email !== undefined) {
      updateData.email = email.trim().toLowerCase();
    }
    if (hideEmail !== undefined) {
      updateData.hideEmail = hideEmail;
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
