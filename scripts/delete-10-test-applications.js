// scripts/delete-10-test-applications.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteTestApplications() {
  try {
    console.log("🗑️  Начинаем удаление тестовых заявок...\n");

    // Получаем всех пользователей с тестовыми email
    const testUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: "test@example.com",
        },
      },
    });

    if (testUsers.length === 0) {
      console.log("⚠️  Не найдено тестовых пользователей.");
      return;
    }

    const userIds = testUsers.map((user) => user.id);

    // Удаляем все заявки тестовых пользователей
    const result = await prisma.application.deleteMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    console.log(`✅ Удалено заявок: ${result.count}`);
    console.log("🎉 Удаление тестовых заявок завершено!");
  } catch (error) {
    console.error("❌ Ошибка при удалении заявок:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
deleteTestApplications();
