import type { Route } from 'next';

export interface KopiNavItem {
  href: Route;
  label: string;
  description: string;
}

export interface KopiApplicationStep {
  title: string;
  text: string;
}

export const KOPI_WELCOME =
  'Привет! Я Копи — амбасадор «Копилки». Помогу разобраться с сайтом, подскажу, как опубликовать историю, и отвечу на частые вопросы.';

export const KOPI_WELCOME_AUTH =
  'Привет! Я Копи — помогу с публикацией истории, навигацией по сайту и ответами на частые вопросы.';

/** Официальный Telegram-канал «Копилка» */
export const KOPI_TELEGRAM_GROUP_URL = 'https://t.me/+8iwXRABVt5tkMmVi';

export const KOPI_APPLICATION_STEPS: KopiApplicationStep[] = [
  {
    title: 'Войдите в аккаунт',
    text: 'Для публикации истории нужна регистрация. Нажмите «Войти» в шапке сайта или создайте новый аккаунт.',
  },
  {
    title: 'Откройте раздел «История»',
    text: 'Перейдите в пункт меню «История» или нажмите кнопку «Рассказать историю» на главной странице.',
  },
  {
    title: 'Ознакомьтесь с условиями',
    text: 'Прочитайте правила платформы и подтвердите согласие — после этого откроется форма.',
  },
  {
    title: 'Заполните форму',
    text: 'Укажите категорию, заголовок, краткое описание и полную историю. При необходимости приложите фото и номер СБП для получения гонорара.',
  },
  {
    title: 'Отправьте историю',
    text: 'Проверьте данные и нажмите «Отправить». Статус публикации можно отслеживать в личном профиле.',
  },
];

export const KOPI_NAV_ITEMS: KopiNavItem[] = [
  {
    href: '/',
    label: 'Главная',
    description: 'О проекте, статистика и частые вопросы',
  },
  {
    href: '/applications',
    label: 'История',
    description: 'Опубликовать материал и получить гонорар',
  },
  {
    href: '/stories',
    label: 'Истории',
    description: 'Реальные истории участников платформы',
  },
  {
    href: '/reviews',
    label: 'Отзывы',
    description: 'Отзывы тех, кто уже публиковал истории',
  },
  {
    href: '/good-deeds',
    label: 'Добрые дела',
    description: 'Задания за бонусы и активность',
  },
  {
    href: '/heroes',
    label: 'Герои',
    description: 'Участники, которые поддерживают проект',
  },
  {
    href: '/support',
    label: 'Поддержать',
    description: 'Донат на развитие платформы',
  },
  {
    href: '/profile',
    label: 'Профиль',
    description: 'Личный кабинет, истории и настройки',
  },
  {
    href: '/advertising',
    label: 'Реклама',
    description: 'Размещение рекламы на сайте',
  },
];

export type KopiMenuId =
  | 'main'
  | 'application'
  | 'navigation'
  | 'faq'
  | 'faq-answer';

export interface KopiQuickAction {
  id: KopiMenuId | 'go-applications' | 'go-faq-section' | 'start-tour';
  label: string;
}

export const KOPI_MAIN_ACTIONS: KopiQuickAction[] = [
  { id: 'start-tour', label: 'Пройти экскурсию' },
  { id: 'application', label: 'Как опубликовать историю?' },
  { id: 'navigation', label: 'Куда перейти на сайте?' },
  { id: 'faq', label: 'Частые вопросы' },
  { id: 'go-applications', label: 'Перейти к публикации →' },
];
