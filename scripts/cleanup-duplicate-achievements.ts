import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Разрешённые слуги из нормализации
const ALLOWED_SLUGS = [
  "first_application",
  "helper_5_apps",
  "active_10_apps",
  "approved_application",
  "community_helper_5_likes",
  "community_heart_50_likes",
  "inspiration_10_likes_on_one_story",
  "storyteller_100_words",
  "word_master_500_words",
  "leaf_flight_100_score",
  "gamer_50_games",
  "hero_100_people",
  "guardian_25_people",
  "social_10_friends",
  "first_friend",
  "streak_3",
  "streak_7",
  "streak_30",
  "legend",
  "first100",
  "gratitude",
  "first_record",
];

async function main() {
  // 1) Удаляем записи без slug
  const deletedNoSlug = await prisma.achievement.deleteMany({
    where: { slug: null },
  });

  // 2) Удаляем записи с slug, которого нет в списке конфигурации
  const deletedUnknownSlug = await prisma.achievement.deleteMany({
    where: {
      slug: { notIn: ALLOWED_SLUGS },
    },
  });

  // 3) Явно удаляем устаревший slug received_help
  const deletedReceivedHelp = await prisma.achievement.deleteMany({
    where: { slug: "received_help" },
  });

  console.log("Deleted achievements without slug:", deletedNoSlug.count);
  console.log("Deleted achievements with unknown slug:", deletedUnknownSlug.count);
  console.log("Deleted achievements with slug=received_help:", deletedReceivedHelp.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

