// scripts/create-10-test-users.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Массив тестовых пользователей
const testUsers = [
  {
    email: "alex.test@example.com",
    name: "Александр Тестов",
    password: "password123",
  },
  {
    email: "maria.test@example.com",
    name: "Мария Петрова",
    password: "password123",
  },
  {
    email: "dmitry.test@example.com",
    name: "Дмитрий Иванов",
    password: "password123",
  },
  {
    email: "elena.test@example.com",
    name: "Елена Сидорова",
    password: "password123",
  },
  {
    email: "vladimir.test@example.com",
    name: "Владимир Козлов",
    password: "password123",
  },
  {
    email: "anna.test@example.com",
    name: "Анна Морозова",
    password: "password123",
  },
  {
    email: "sergey.test@example.com",
    name: "Сергей Волков",
    password: "password123",
  },
  {
    email: "olga.test@example.com",
    name: "Ольга Новикова",
    password: "password123",
  },
  {
    email: "andrey.test@example.com",
    name: "Андрей Лебедев",
    password: "password123",
  },
  {
    email: "natalia.test@example.com",
    name: "Наталья Соколова",
    password: "password123",
  },
];

async function createTestUsers() {
  try {
    console.log("🚀 Начинаем создание 10 тестовых пользователей...\n");

    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];

      // Проверяем, существует ли уже пользователь с таким email
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(
          `⚠️  Пользователь ${userData.email} уже существует, пропускаем...`,
        );
        continue;
      }

      // Хешируем пароль
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Создаем пользователя
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          passwordHash: passwordHash,
          role: "USER",
          createdAt: new Date(),
          lastSeen: new Date(),
        },
      });

      console.log(
        `✅ ${i + 1}. Создан пользователь: ${userData.name} (${userData.email})`,
      );
    }

    console.log("\n🎉 Создание тестовых пользователей завершено!");
    console.log("\n📋 Список созданных пользователей:");
    console.log("Email: alex.test@example.com | Пароль: password123");
    console.log("Email: maria.test@example.com | Пароль: password123");
    console.log("Email: dmitry.test@example.com | Пароль: password123");
    console.log("Email: elena.test@example.com | Пароль: password123");
    console.log("Email: vladimir.test@example.com | Пароль: password123");
    console.log("Email: anna.test@example.com | Пароль: password123");
    console.log("Email: sergey.test@example.com | Пароль: password123");
    console.log("Email: olga.test@example.com | Пароль: password123");
    console.log("Email: andrey.test@example.com | Пароль: password123");
    console.log("Email: natalia.test@example.com | Пароль: password123");
  } catch (error) {
    console.error("❌ Ошибка при создании пользователей:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
createTestUsers();






