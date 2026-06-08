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
  'Привет! Я Копи — амбасадор «Копилки». Помогу разобраться с сайтом, подскажу, как подать заявку, и отвечу на частые вопросы.';

export const KOPI_WELCOME_AUTH =
  'Привет! Я Копи — помогу с заявкой, навигацией по сайту и ответами на частые вопросы.';

export const KOPI_APPLICATION_STEPS: KopiApplicationStep[] = [
  {
    title: 'Войдите в аккаунт',
    text: 'Для подачи заявки нужна регистрация. Нажмите «Войти» в шапке сайта или создайте новый аккаунт.',
  },
  {
    title: 'Откройте раздел «Заявка»',
    text: 'Перейдите в пункт меню «Заявка» или нажмите кнопку «Рассказать историю» на главной странице.',
  },
  {
    title: 'Ознакомьтесь с условиями',
    text: 'Прочитайте, что поддерживает платформа, и подтвердите согласие с правилами — после этого откроется форма.',
  },
  {
    title: 'Заполните форму',
    text: 'Укажите категорию, заголовок, краткое описание и полную историю. При необходимости приложите фото и реквизиты для перевода.',
  },
  {
    title: 'Отправьте заявку',
    text: 'Проверьте данные и нажмите «Отправить». Статус заявки можно отслеживать в личном профиле.',
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
    label: 'Заявка',
    description: 'Подать историю и получить поддержку',
  },
  {
    href: '/stories',
    label: 'Истории',
    description: 'Реальные истории участников платформы',
  },
  {
    href: '/reviews',
    label: 'Отзывы',
    description: 'Отзывы тех, кто уже подавал заявки',
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
    description: 'Личный кабинет, заявки и настройки',
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
  { id: 'application', label: 'Как подать заявку?' },
  { id: 'navigation', label: 'Куда перейти на сайте?' },
  { id: 'faq', label: 'Частые вопросы' },
  { id: 'go-applications', label: 'Перейти к заявке →' },
];
