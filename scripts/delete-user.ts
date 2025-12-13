// scripts/delete-user.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Получаем email пользователя из аргументов командной строки
  const userEmail = process.argv[2];

  if (!userEmail) {
    console.error("Использование: npx tsx scripts/delete-user.ts <email>");
    console.error("Пример: npx tsx scripts/delete-user.ts user@example.com");
    process.exit(1);
  }

  try {
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      console.error(`Пользователь с email ${userEmail} не найден`);
      process.exit(1);
    }

    console.log(`Найден пользователь: ${user.name || user.email} (ID: ${user.id})`);

    // Удаляем пользователя (все связанные данные удалятся автоматически благодаря onDelete: Cascade)
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log(`✅ Пользователь ${userEmail} успешно удален`);
  } catch (error: any) {
    console.error("Ошибка при удалении пользователя:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

