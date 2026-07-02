export const FEEDBACK_STORAGE_PREFIX = 'kopilka_feedback';

export const FEEDBACK_PROMPT_CONFIG = {
  /** Для пассивного показа (просто листает сайт). */
  minVisitCount: 2,
  minSessionActiveMs: 30_000,
  minPagesInSession: 3,
  /** После осмысленного действия — мягче: хватает 1-го визита и 10 с в сессии. */
  minVisitCountAfterAction: 1,
  minSessionActiveMsAfterAction: 10_000,
  postActionDelayMs: 5_000,
  postActionRetryMs: 4_000,
  postActionRetryWindowMs: 120_000,
  cooldownAfterSubmitDays: 30,
  cooldownAfterDismissDays: 7,
  cooldownAfterLaterDays: 7,
} as const;

export const FEEDBACK_MEANINGFUL_ACTION_EVENT = 'kopilka:feedback-meaningful-action';

export const FEEDBACK_EXCLUDED_PATH_PREFIXES = [
  '/admin',
  '/banned',
  '/login',
  '/verify-email',
  '/feedback',
] as const;

export type FeedbackTopicId =
  | 'general'
  | 'games'
  | 'applications'
  | 'good_deeds'
  | 'stories'
  | 'reviews'
  | 'heroes'
  | 'advertising'
  | 'vyzhivanie'
  | 'profile'
  | 'support'
  | 'other';

export const FEEDBACK_TOPICS: Record<
  FeedbackTopicId,
  { label: string; description: string }
> = {
  general: {
    label: 'Общая обратная связь',
    description: 'Общие впечатления от сайта',
  },
  games: {
    label: 'Раздел: Игры',
    description: 'Баги, адаптивность и идеи по игровому лобби',
  },
  applications: {
    label: 'Раздел: Заявки',
    description: 'Форма подачи заявки и модерация',
  },
  good_deeds: {
    label: 'Раздел: Добрые дела',
    description: 'Задания, лента и вывод бонусов',
  },
  stories: {
    label: 'Раздел: Истории',
    description: 'Чтение и публикация историй',
  },
  reviews: {
    label: 'Раздел: Отзывы',
    description: 'Отзывы участников и модерация',
  },
  heroes: {
    label: 'Раздел: Герои проекта',
    description: 'Витрина поддержки и раздел героев',
  },
  advertising: {
    label: 'Раздел: Реклама',
    description: 'Размещение рекламы на платформе',
  },
  vyzhivanie: {
    label: 'Раздел: Выживание',
    description: 'Игра «Выживание» и механики раунда',
  },
  profile: {
    label: 'Личный кабинет',
    description: 'Профиль, бонусы и настройки',
  },
  support: {
    label: 'Поддержка проекта',
    description: 'Стать героем и поддержка «Копилки»',
  },
  other: {
    label: 'Другое',
    description: 'Всё остальное',
  },
};

export const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  new: 'Новое',
  read: 'Прочитано',
  resolved: 'Решено',
};

export function isFeedbackTopicId(value: string): value is FeedbackTopicId {
  return value in FEEDBACK_TOPICS;
}

export function getFeedbackTopicLabel(topic: string): string {
  if (isFeedbackTopicId(topic)) {
    return FEEDBACK_TOPICS[topic].label;
  }
  return topic;
}

export function isFeedbackPathExcluded(pathname: string): boolean {
  return FEEDBACK_EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
