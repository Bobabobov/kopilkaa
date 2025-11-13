// scripts/create-test-friendships.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestFriendships() {
  try {
    console.log("🚀 Создание тестовых заявок в друзья...\n");

    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: [
            "alex@test.com",
            "maria@test.com",
            "dmitry@test.com",
            "anna@test.com",
            "sergey@test.com",
          ],
        },
      },
    });

    console.log(`📋 Найдено ${users.length} тестовых пользователей`);

    // Создаем несколько заявок в друзья
    const friendships = [
      {
        requesterEmail: "alex@test.com",
        receiverEmail: "maria@test.com",
        status: "ACCEPTED",
      },
      {
        requesterEmail: "alex@test.com",
        receiverEmail: "dmitry@test.com",
        status: "PENDING",
      },
      {
        requesterEmail: "anna@test.com",
        receiverEmail: "alex@test.com",
        status: "PENDING",
      },
      {
        requesterEmail: "sergey@test.com",
        receiverEmail: "maria@test.com",
        status: "ACCEPTED",
      },
    ];

    for (const friendship of friendships) {
      const requester = users.find(
        (u) => u.email === friendship.requesterEmail,
      );
      const receiver = users.find((u) => u.email === friendship.receiverEmail);

      if (!requester || !receiver) {
        console.log(
          `⚠️  Не найден пользователь для заявки ${friendship.requesterEmail} -> ${friendship.receiverEmail}`,
        );
        continue;
      }

      // Проверяем, не существует ли уже заявка
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: requester.id, receiverId: receiver.id },
            { requesterId: receiver.id, receiverId: requester.id },
          ],
        },
      });

      if (existingFriendship) {
        console.log(
          `⚠️  Заявка между ${requester.name} и ${receiver.name} уже существует`,
        );
        continue;
      }

      // Создаем заявку
      await prisma.friendship.create({
        data: {
          requesterId: requester.id,
          receiverId: receiver.id,
          status: friendship.status,
          createdAt: new Date(),
        },
      });

      console.log(
        `✅ Создана заявка: ${requester.name} -> ${receiver.name} (${friendship.status})`,
      );
    }

    console.log("\n🎉 Тестовые заявки в друзья созданы!");
    console.log("\n📊 Статус дружбы:");
    console.log("• Александр и Мария - ДРУЗЬЯ ✅");
    console.log("• Александр отправил заявку Дмитрию - ОЖИДАЕТ ⏳");
    console.log("• Анна отправила заявку Александру - ОЖИДАЕТ ⏳");
    console.log("• Сергей и Мария - ДРУЗЬЯ ✅");
  } catch (error) {
    console.error("❌ Ошибка создания тестовых заявок:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestFriendships();






