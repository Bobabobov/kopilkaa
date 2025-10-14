// scripts/init-achievements.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Базовые достижения
const defaultAchievements = [
  // === ЗАЯВКИ ===
  {
    name: 'Первые шаги',
    description: 'Создайте свою первую заявку',
    icon: 'FileText',
    rarity: 'COMMON',
    type: 'APPLICATIONS',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },
  {
    name: 'Помощник',
    description: 'Создайте 5 заявок',
    icon: 'Users',
    rarity: 'RARE',
    type: 'APPLICATIONS',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },
  {
    name: 'Активный участник',
    description: 'Создайте 10 заявок',
    icon: 'Star',
    rarity: 'EPIC',
    type: 'APPLICATIONS',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },
  {
    name: 'Одобренная заявка',
    description: 'Получите одобрение первой заявки',
    icon: 'CheckCircle',
    rarity: 'RARE',
    type: 'APPLICATIONS',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },

  // === ИГРЫ ===
  {
    name: 'Первый рекорд',
    description: 'Установите рекорд в любой игре',
    icon: 'Gamepad2',
    rarity: 'COMMON',
    type: 'GAMES',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },
  {
    name: 'Мастер полёта',
    description: 'Наберите 100+ очков в Leaf Flight',
    icon: 'Zap',
    rarity: 'RARE',
    type: 'GAMES',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },

  // === СОЦИАЛЬНЫЕ ===
  {
    name: 'Первый друг',
    description: 'Добавьте первого друга',
    icon: 'Heart',
    rarity: 'COMMON',
    type: 'SOCIAL',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },

  // === СЕРИИ ===
  {
    name: 'Начало пути',
    description: 'Входите на сайт 3 дня подряд',
    icon: 'Flame',
    rarity: 'COMMON',
    type: 'STREAK',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },

  // === СООБЩЕСТВО ===
  {
    name: 'Помощник сообщества',
    description: 'Помогите 5 людям (лайкните их истории)',
    icon: 'Heart',
    rarity: 'RARE',
    type: 'COMMUNITY',
    isExclusive: false,
    maxCount: 1,
    isActive: true,
  },

  // === ОСОБЫЕ ===
  {
    name: 'Первопроходец',
    description: 'Стали одним из первых 100 пользователей',
    icon: 'Rocket',
    rarity: 'EXCLUSIVE',
    type: 'SPECIAL',
    isExclusive: true,
    maxCount: 1,
    isActive: true,
  },
];

async function initAchievements() {
  try {
    console.log("🚀 Инициализация достижений...\n");

    let createdCount = 0;
    let skippedCount = 0;

    for (const achievementData of defaultAchievements) {
      // Проверяем, существует ли уже такое достижение
      const existing = await prisma.achievement.findFirst({
        where: {
          name: achievementData.name,
          type: achievementData.type,
        },
      });

      if (existing) {
        console.log(`⚠️  Достижение "${achievementData.name}" уже существует, пропускаем...`);
        skippedCount++;
        continue;
      }

      // Создаём новое достижение
      await prisma.achievement.create({
        data: achievementData,
      });

      console.log(`✅ Создано достижение: "${achievementData.name}" (${achievementData.rarity})`);
      createdCount++;
    }

    console.log(`\n🎉 Инициализация завершена!`);
    console.log(`📊 Создано: ${createdCount} новых достижений`);
    console.log(`⏭️  Пропущено: ${skippedCount} существующих`);
    console.log(`📈 Всего: ${createdCount + skippedCount} достижений обработано`);

  } catch (error) {
    console.error("❌ Ошибка при инициализации достижений:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
initAchievements();
