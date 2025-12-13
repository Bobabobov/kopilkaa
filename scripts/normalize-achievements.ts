import { PrismaClient, AchievementKind, AchievementType } from '@prisma/client';

const prisma = new PrismaClient();

type UpsertData = Partial<Parameters<typeof prisma.achievement.upsert>[0]["update"]> & {
  name?: string;
  description?: string;
};

const ACH_CONFIG: Record<string, UpsertData> = {
  // Applications
  first_application: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.APPLICATIONS,
    name: "Первые шаги",
    description: "Создайте свою первую заявку",
    rarity: 'COMMON',
  },
  helper_5_apps: {
    maxCount: 5,
    kind: AchievementKind.NORMAL,
    type: AchievementType.APPLICATIONS,
    name: "Помощник",
    description: "Создайте 5 заявок",
    rarity: 'COMMON',
  },
  active_10_apps: {
    maxCount: 10,
    kind: AchievementKind.NORMAL,
    type: AchievementType.APPLICATIONS,
    name: "Активный участник",
    description: "Создайте 10 заявок",
    rarity: 'EPIC',
  },
  approved_application: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.APPLICATIONS,
    name: "Одобренная заявка",
    description: "Получите одобрение первой заявки",
    rarity: 'COMMON',
  },

  // Community / likes / help
  community_helper_5_likes: {
    maxCount: 5,
    kind: AchievementKind.NORMAL,
    type: AchievementType.COMMUNITY,
    name: "Помощник сообщества",
    description: "Помогите 5 людям (лайкните их истории)",
    rarity: 'RARE',
  },
  community_heart_50_likes: {
    maxCount: 50,
    kind: AchievementKind.NORMAL,
    type: AchievementType.COMMUNITY,
    name: "Сердце сообщества",
    description: "Поставьте 50 лайков историям",
    rarity: 'EPIC',
  },
  inspiration_10_likes_on_one_story: {
    maxCount: 10,
    kind: AchievementKind.NORMAL,
    type: AchievementType.COMMUNITY,
    name: "Вдохновение",
    description: "Ваша история получила 10+ лайков",
    rarity: 'EPIC',
  },
  gratitude: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.APPLICATIONS,
    name: "Благодарность",
    description: "Получили помощь от сообщества",
    rarity: 'RARE',
  },

  // Creativity
  storyteller_100_words: {
    maxCount: 100,
    kind: AchievementKind.NORMAL,
    type: AchievementType.CREATIVITY,
    name: "Рассказчик",
    description: "Напишите историю длиннее 100 слов",
    rarity: 'COMMON',
  },
  word_master_500_words: {
    maxCount: 500,
    kind: AchievementKind.NORMAL,
    type: AchievementType.CREATIVITY,
    name: "Мастер слова",
    description: "Напишите историю длиннее 500 слов",
    rarity: 'RARE',
  },

  // Games
  leaf_flight_100_score: {
    maxCount: 100,
    kind: AchievementKind.NORMAL,
    type: AchievementType.GAMES,
    name: "Мастер полёта",
    description: "Наберите 100+ очков в Leaf Flight",
    rarity: 'RARE',
  },
  gamer_50_games: {
    maxCount: 50,
    kind: AchievementKind.NORMAL,
    type: AchievementType.GAMES,
    name: "Игроман",
    description: "Сыграйте в игры 50 раз",
    rarity: 'LEGENDARY',
  },
  first_record: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.GAMES,
    name: "Первый рекорд",
    description: "Установите рекорд в любой игре",
    rarity: 'COMMON',
  },

  // Friends
  first_friend: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.SOCIAL,
    name: "Первый друг",
    description: "Добавьте первого друга",
    rarity: 'COMMON',
  },
  social_10_friends: {
    maxCount: 10,
    kind: AchievementKind.NORMAL,
    type: AchievementType.SOCIAL,
    name: "Социальная бабочка",
    description: "Добавьте 10 друзей",
    rarity: 'RARE',
  },

  // Help/people
  guardian_25_people: {
    maxCount: 25,
    kind: AchievementKind.NORMAL,
    type: AchievementType.COMMUNITY,
    name: "Ангел-хранитель",
    description: "Помогите 25 людям",
    rarity: 'EPIC',
  },
  hero_100_people: {
    maxCount: 100,
    kind: AchievementKind.NORMAL,
    type: AchievementType.COMMUNITY,
    name: "Герой сообщества",
    description: "Помогите 100 людям",
    rarity: 'LEGENDARY',
  },

  // Streaks
  streak_3: {
    maxCount: 3,
    kind: AchievementKind.NORMAL,
    type: AchievementType.STREAK,
    name: "Начало пути",
    description: "Входите на сайт 3 дня подряд",
    rarity: 'COMMON',
  },
  streak_7: {
    maxCount: 7,
    kind: AchievementKind.NORMAL,
    type: AchievementType.STREAK,
    name: "Привычка",
    description: "Входите на сайт 7 дней подряд",
    rarity: 'RARE',
  },
  streak_30: {
    maxCount: 30,
    kind: AchievementKind.NORMAL,
    type: AchievementType.STREAK,
    name: "Преданность",
    description: "Входите на сайт 30 дней подряд",
    rarity: 'LEGENDARY',
  },

  // Meta
  legend: {
    maxCount: 1,
    kind: AchievementKind.META,
    type: AchievementType.SPECIAL,
    name: "Легенда",
    description: "Получите все остальные достижения",
    rarity: 'EXCLUSIVE',
  },

  // First 100
  first100: {
    maxCount: 1,
    kind: AchievementKind.NORMAL,
    type: AchievementType.SPECIAL,
    name: "Первопроходец",
    description: "Стали одним из первых 100 пользователей",
    isExclusive: true,
    rarity: 'EXCLUSIVE',
  },
};

async function main() {
  for (const [slug, update] of Object.entries(ACH_CONFIG)) {
    await prisma.achievement.upsert({
      where: { slug },
      update: {
        slug,
        name: update.name ?? slug,
        description: update.description ?? slug,
        ...update,
      },
      create: {
        slug,
        name: update.name ?? slug,
        description: update.description ?? slug,
        icon: 'Star',
        rarity: 'COMMON',
        type: (update.type as AchievementType) ?? AchievementType.SPECIAL,
        kind: (update as any).kind ?? AchievementKind.NORMAL,
        maxCount: update.maxCount ?? 1,
        isExclusive: update.isExclusive ?? false,
        isHidden: update.isHidden ?? false,
        isSeasonal: update.isSeasonal ?? false,
        isActive: true,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

