// app/api/auth/login/route.ts
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { AchievementService } from "@/lib/achievements/service";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return Response.json(
        { error: "Введите email и пароль" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return Response.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log("Invalid password for user:", email);
      return Response.json({ error: "Неверный пароль" }, { status: 401 });
    }

    console.log("Login successful for user:", user.id);
    await setSession({ uid: user.id, role: user.role as any });

    // Проверяем и выдаём достижения при входе (в фоне)
    AchievementService.checkAndGrantAutomaticAchievements(user.id)
      .then((granted) => {
        if (granted.length > 0) {
          console.log(`User ${user.id} received ${granted.length} achievements on login`);
        }
      })
      .catch((error) => {
        console.error("Error checking achievements on login:", error);
      });

    return Response.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
