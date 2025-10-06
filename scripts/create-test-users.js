// scripts/create-test-users.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const testUsers = [
  {
    email: "alex@test.com",
    name: "Александр",
    passwordHash:
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "USER",
    avatar: null,
    hideEmail: false,
    createdAt: new Date("2024-01-15"),
    lastSeen: new Date(),
  },
  {
    email: "maria@test.com",
    name: "Мария",
    passwordHash:
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "USER",
    avatar: null,
    hideEmail: false,
    createdAt: new Date("2024-02-20"),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
  },
  {
    email: "dmitry@test.com",
    name: "Дмитрий",
    passwordHash:
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "USER",
    avatar: null,
    hideEmail: true,
    createdAt: new Date("2024-03-10"),
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 день назад
  },
  {
    email: "anna@test.com",
    name: "Анна",
    passwordHash:
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "USER",
    avatar: null,
    hideEmail: false,
    createdAt: new Date("2024-04-05"),
    lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 неделя назад
  },
  {
    email: "sergey@test.com",
    name: "Сергей",
    passwordHash:
      "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "USER",
    avatar: null,
    hideEmail: false,
    createdAt: new Date("2024-05-12"),
    lastSeen: new Date("2024-05-12"), // был онлайн только при регистрации
  },
];

async function createTestUsers() {
  try {
    console.log("🚀 Создание тестовых пользователей...\n");

    for (const userData of testUsers) {
      // Проверяем, существует ли пользователь
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(
          `⚠️  Пользователь ${userData.name} (${userData.email}) уже существует`,
        );
        continue;
      }

      // Создаем пользователя
      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✅ Создан пользователь: ${user.name} (${user.email})`);
    }

    console.log("\n🎉 Все тестовые пользователи созданы!");
    console.log("\n📋 Список тестовых пользователей:");
    console.log("1. Александр (alex@test.com) - онлайн");
    console.log("2. Мария (maria@test.com) - был онлайн 2 часа назад");
    console.log(
      "3. Дмитрий (dmitry@test.com) - был онлайн 1 день назад, email скрыт",
    );
    console.log("4. Анна (anna@test.com) - был онлайн 1 неделю назад");
    console.log("5. Сергей (sergey@test.com) - никогда не был онлайн");
    console.log("\n🔑 Пароль для всех пользователей: password");
  } catch (error) {
    console.error("❌ Ошибка создания тестовых пользователей:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
