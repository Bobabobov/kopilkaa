// scripts/delete-10-test-users.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Массив email адресов тестовых пользователей
const testUserEmails = [
  "alex.test@example.com",
  "maria.test@example.com",
  "dmitry.test@example.com",
  "elena.test@example.com",
  "vladimir.test@example.com",
  "anna.test@example.com",
  "sergey.test@example.com",
  "olga.test@example.com",
  "andrey.test@example.com",
  "natalia.test@example.com",
];

async function deleteTestUsers() {
  try {
    console.log("🗑️  Начинаем удаление 10 тестовых пользователей...\n");

    let deletedCount = 0;

    for (const email of testUserEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Удаляем пользователя
        await prisma.user.delete({
          where: { email },
        });

        console.log(`✅ Удален пользователь: ${user.name} (${email})`);
        deletedCount++;
      } else {
        console.log(`⚠️  Пользователь ${email} не найден, пропускаем...`);
      }
    }

    console.log(
      `\n🎉 Удаление завершено! Удалено пользователей: ${deletedCount}`,
    );
  } catch (error) {
    console.error("❌ Ошибка при удалении пользователей:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
deleteTestUsers();



