import type { Route } from 'next';

export interface KopiTourStep {
  id: string;
  route: Route;
  /** Короткий заголовок в шапке шага */
  headerTitle: string;
  title: string;
  subtitle: string;
  description: string;
  /** Короткая подсказка; **фраза** — акцент в тексте */
  highlight: string;
}

export const KOPI_TOUR_STEP_COUNT = 5;

export const KOPI_TOUR_STEPS: KopiTourStep[] = [
  {
    id: 'welcome',
    route: '/',
    headerTitle: 'Знакомство',
    title: 'Добро пожаловать в «Копилку»!',
    subtitle: 'Шаг 1 из 5',
    description:
      'Я — Копи, амбасадор проекта. Сейчас покажу, где что находится и как пользоваться платформой.',
    highlight:
      'Покажу, где что находится — **главная**, **статистика** и навигация по сайту.',
  },
  {
    id: 'stories',
    route: '/stories',
    headerTitle: 'Истории',
    title: 'Истории участников',
    subtitle: 'Шаг 2 из 5',
    description:
      'В этом разделе публикуются реальные истории людей, которым помогла платформа.',
    highlight:
      'Здесь публикуют **реальные истории** и показывают, **как устроена поддержка**.',
  },
  {
    id: 'applications',
    route: '/applications/demo',
    headerTitle: 'Подача заявки',
    title: 'Подать заявку',
    subtitle: 'Шаг 3 из 5',
    description:
      'На этой странице вы рассказываете свою ситуацию и отправляете заявку на рассмотрение.',
    highlight:
      'Заполните **форму заявки**, опишите ситуацию и отправьте историю на **рассмотрение**.',
  },
  {
    id: 'reviews',
    route: '/reviews',
    headerTitle: 'Отзывы',
    title: 'Отзывы',
    subtitle: 'Шаг 4 из 5',
    description:
      'Отзывы участников, которые уже прошли путь с «Копилкой» и получили решение.',
    highlight:
      'Читайте **опыт участников** и узнайте, **как проходит процесс** с «Копилкой».',
  },
  {
    id: 'profile',
    route: '/profile/demo',
    headerTitle: 'Личный кабинет',
    title: 'Ваш будущий профиль',
    subtitle: 'Шаг 5 из 5',
    description:
      'После регистрации у вас появится личный кабинет — заявки, уровень доверия, бонусы и настройки.',
    highlight:
      '**Заявки**, **доверие**, **бонусы** и **настройки** — всё в одном месте.',
  },
];

export const KOPI_TOUR_FINISH_MESSAGE =
  'Экскурсия завершена! Если понадобится помощь — нажмите на меня в любой момент. Удачи!';

/** Маршрут шага вне экскурсии (если понадобится отдельная навигация). */
export function getTourStepRoute(step: KopiTourStep, isGuest: boolean): Route {
  if (isGuest) return step.route;

  if (step.id === 'applications') return '/applications';
  if (step.id === 'profile') return '/profile';

  return step.route;
}

export function getTourStepHeadline(step: KopiTourStep, isGuest: boolean): string {
  if (step.id === 'profile' && !isGuest) return 'Личный кабинет';
  return step.title !== step.headerTitle ? step.title : step.headerTitle;
}

export function getTourStepHighlight(step: KopiTourStep, isGuest: boolean): string {
  if (step.id === 'profile' && !isGuest) {
    return '**Заявки**, **доверие**, **бонусы** и **настройки** — всё собрано здесь.';
  }
  return step.highlight;
}
