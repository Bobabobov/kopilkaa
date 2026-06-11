import type { AchievementRarity } from "@prisma/client";

export const ACHIEVEMENT_SLUGS = {
  WELCOME: "welcome-aboard",
  LOGIN_STREAK_7: "week-warrior",
  FIRST_APPLICATION: "first-step",
  COMMENTS_10: "story-voice",
  REACTIONS_10_STORIES: "warm-heart",
  FIRST_FRIEND: "first-friend",
  REFERRAL_5: "referral-5",
  LEFT_REVIEW: "left-review",
  GOOD_DEED: "good-deed",
  PROFILE_STYLE: "profile-style",
  DAILY_BONUS_CLAIMED: "daily-bonus-claimed",
  DAILY_BONUS_RISK: "tried-luck",
} as const;

export type AchievementSlug =
  (typeof ACHIEVEMENT_SLUGS)[keyof typeof ACHIEVEMENT_SLUGS];

export type AchievementDefinition = {
  slug: AchievementSlug;
  name: string;
  description: string;
  hint: string;
  icon: string;
  rarity: AchievementRarity;
  targetValue: number;
  sortOrder: number;
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    slug: ACHIEVEMENT_SLUGS.WELCOME,
    name: "Добро пожаловать!",
    description:
      "Вы присоединились к Копилке. Каждое большое сообщество начинается с одного человека — с вас.",
    hint: "Зарегистрируйтесь на сайте",
    icon: "/Achievements/welcom.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 10,
  },
  {
    slug: ACHIEVEMENT_SLUGS.LOGIN_STREAK_7,
    name: "Неделя с Копилкой",
    description:
      "Семь дней подряд вы заходили на сайт. Постоянство согревает сообщество лучше любого костра.",
    hint: "Заходите на сайт 7 дней подряд",
    icon: "/Achievements/week.png",
    rarity: "UNCOMMON",
    targetValue: 7,
    sortOrder: 20,
  },
  {
    slug: ACHIEVEMENT_SLUGS.FIRST_APPLICATION,
    name: "Первый шаг",
    description:
      "Вы подали свою первую заявку. Смелость попросить о помощи — уже половина пути.",
    hint: "Подайте первую заявку на помощь",
    icon: "/Achievements/1chag.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 30,
  },
  {
    slug: ACHIEVEMENT_SLUGS.COMMENTS_10,
    name: "Голос сообщества",
    description:
      "Десять комментариев к историям — вы не проходите мимо, а поддерживаете словом.",
    hint: "Оставьте 10 комментариев к историям",
    icon: "/Achievements/voice.png",
    rarity: "UNCOMMON",
    targetValue: 10,
    sortOrder: 40,
  },
  {
    slug: ACHIEVEMENT_SLUGS.REACTIONS_10_STORIES,
    name: "Тёплое сердце",
    description:
      "Десять разных историй получили вашу реакцию. Маленький жест — заметная поддержка.",
    hint: "Поставьте реакции 10 разным историям",
    icon: "/Achievements/heart.png",
    rarity: "UNCOMMON",
    targetValue: 10,
    sortOrder: 50,
  },
  {
    slug: ACHIEVEMENT_SLUGS.FIRST_FRIEND,
    name: "Первый друг",
    description:
      "Вы добавили первого друга в Копилке. Одна связь — уже целое сообщество.",
    hint: "Добавьте в друзья одного человека",
    icon: "/Achievements/friend.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 60,
  },
  {
    slug: ACHIEVEMENT_SLUGS.REFERRAL_5,
    name: "Привёл 5 друзей",
    description:
      "По вашей ссылке зарегистрировались пять человек. Вы помогаете Копилке расти.",
    hint: "Пригласите 5 человек по реферальной ссылке",
    icon: "/Achievements/referrals.png",
    rarity: "RARE",
    targetValue: 5,
    sortOrder: 70,
  },
  {
    slug: ACHIEVEMENT_SLUGS.LEFT_REVIEW,
    name: "Оставил отзыв",
    description:
      "Вы поделились опытом после полученной помощи. Ваш отзыв вдохновляет других не бояться просить.",
    hint: "Оставьте отзыв о полученной помощи",
    icon: "/Achievements/review.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 80,
  },
  {
    slug: ACHIEVEMENT_SLUGS.GOOD_DEED,
    name: "Доброе дело",
    description:
      "Администрация подтвердила ваше доброе дело. Маленький поступок — большой след в сообществе.",
    hint: "Выполните и отправьте доброе дело на проверку",
    icon: "/Achievements/gooddeed.png",
    rarity: "UNCOMMON",
    targetValue: 1,
    sortOrder: 90,
  },
  {
    slug: ACHIEVEMENT_SLUGS.PROFILE_STYLE,
    name: "Свой стиль",
    description:
      "Вы сменили аватар или поставили свою обложку. Профиль стал по-настоящему вашим.",
    hint: "Загрузите аватар или обложку в профиле",
    icon: "/Achievements/profiledesign.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 100,
  },
  {
    slug: ACHIEVEMENT_SLUGS.DAILY_BONUS_CLAIMED,
    name: "Первый бонус",
    description:
      "Вы забрали ежедневный бонус. Копи любит постоянство — вы уже в деле.",
    hint: "Получите ежедневный бонус в профиле",
    icon: "/Achievements/bonus.png",
    rarity: "COMMON",
    targetValue: 1,
    sortOrder: 110,
  },
  {
    slug: ACHIEVEMENT_SLUGS.DAILY_BONUS_RISK,
    name: "Испытал удачу",
    description:
      "Вы нажали «Риск» в ежедневном бонусе — выиграли или проиграли, но удача уже испытана.",
    hint: "Нажмите «Риск» в блоке ежедневного бонуса",
    icon: "/Achievements/pig17.png",
    rarity: "UNCOMMON",
    targetValue: 1,
    sortOrder: 115,
  },
];
