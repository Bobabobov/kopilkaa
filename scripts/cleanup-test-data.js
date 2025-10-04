// scripts/cleanup-test-data.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupTestData() {
  try {
    console.log('🧹 Очистка тестовых данных...\n');

    // Удаляем тестовые заявки в друзья
    const deletedFriendships = await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requester: { email: { in: ['alex@test.com', 'maria@test.com', 'dmitry@test.com', 'anna@test.com', 'sergey@test.com'] } } },
          { receiver: { email: { in: ['alex@test.com', 'maria@test.com', 'dmitry@test.com', 'anna@test.com', 'sergey@test.com'] } } }
        ]
      }
    });

    console.log(`🗑️  Удалено ${deletedFriendships.count} тестовых заявок в друзья`);

    // Удаляем тестовых пользователей
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        email: {
          in: ['alex@test.com', 'maria@test.com', 'dmitry@test.com', 'anna@test.com', 'sergey@test.com']
        }
      }
    });

    console.log(`🗑️  Удалено ${deletedUsers.count} тестовых пользователей`);

    console.log('\n✅ Тестовые данные очищены!');

  } catch (error) {
    console.error('❌ Ошибка очистки тестовых данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestData();





