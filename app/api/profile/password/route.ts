import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { oldPassword, newPassword } = body;
    
    // Валидация
    if (!oldPassword || !newPassword) {
      return Response.json({ error: "Текущий и новый пароль обязательны" }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return Response.json({ error: "Новый пароль должен содержать минимум 6 символов" }, { status: 400 });
    }
    
    // Получаем пользователя с хешем пароля
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: { passwordHash: true }
    });
    
    if (!user) {
      return Response.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    
    // Проверяем текущий пароль
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      return Response.json({ error: "Неверный текущий пароль" }, { status: 400 });
    }
    
    // Хешируем новый пароль
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    
    // Обновляем пароль
    await prisma.user.update({
      where: { id: session.uid },
      data: { passwordHash: newPasswordHash }
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}




















