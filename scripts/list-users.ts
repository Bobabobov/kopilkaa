// scripts/list-users.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`\nНайдено пользователей: ${users.length}\n`);
    console.log("ID".padEnd(30) + "Email".padEnd(40) + "Имя".padEnd(30) + "Дата регистрации");
    console.log("-".repeat(100));

    users.forEach((user) => {
      const id = user.id.substring(0, 28);
      const email = (user.email || "").substring(0, 38);
      const name = (user.name || "—").substring(0, 28);
      const date = user.createdAt.toLocaleDateString("ru-RU");
      console.log(`${id.padEnd(30)}${email.padEnd(40)}${name.padEnd(30)}${date}`);
    });

    console.log("\n");
  } catch (error: any) {
    console.error("Ошибка при получении пользователей:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

