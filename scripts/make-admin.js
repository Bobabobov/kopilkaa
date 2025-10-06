// scripts/make-admin.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("❌ Укажите email пользователя");
      console.log("Использование: node scripts/make-admin.js user@example.com");
      return;
    }

    console.log(`🔧 Ищем пользователя с email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ Пользователь не найден");
      return;
    }

    if (user.role === "ADMIN") {
      console.log("✅ Пользователь уже является администратором");
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log("✅ Пользователь теперь администратор:", {
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
