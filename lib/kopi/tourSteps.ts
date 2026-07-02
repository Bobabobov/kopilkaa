import type { Route } from 'next';

export interface KopiTourSubStep {
  id: string;
  target: string;
  headerTitle: string;
  title: string;
  highlight: string;
}

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
  /** Значение атрибута data-kopi-tour (если нет подшагов) */
  target: string;
}

/** Подсветка блоков на главной внутри шага «Знакомство» */
export const KOPI_HOME_TOUR_SUBSTEPS: KopiTourSubStep[] = [
  {
    id: 'intro',
    target: 'welcome-intro',
    headerTitle: 'Главная',
    title: 'Добро пожаловать в «Копилку»!',
    highlight:
      'Это главный экран: **о проекте**, кому подходит платформа и **с чего начать**.',
  },
  {
    id: 'stats',
    target: 'welcome-stats',
    headerTitle: 'Статистика',
    title: 'Прозрачность проекта',
    highlight:
      'Живая **статистика**: сколько историй подано, выплат и участников в «Копилке».',
  },
  {
    id: 'recent',
    target: 'welcome-recent',
    headerTitle: 'Истории людей',
    title: 'Реальные истории на главной',
    highlight:
      'Здесь видны **недавние истории** — примеры материалов, которые публикуют участники.',
  },
  {
    id: 'how',
    target: 'welcome-how',
    headerTitle: 'Как это работает',
    title: 'Путь к гонорару',
    highlight:
      'Четыре шага: **рассказать историю**, опубликовать материал, дождаться решения и получить гонорар.',
  },
  {
    id: 'reviews',
    target: 'welcome-reviews',
    headerTitle: 'Отзывы',
    title: 'Опыт участников',
    highlight:
      'Короткие **отзывы с фото** — как люди прошли путь с «Копилкой».',
  },
  {
    id: 'good-deeds',
    target: 'welcome-good-deeds',
    headerTitle: 'Добрые дела',
    title: 'Задания за бонусы',
    highlight:
      'Раздел **добрых дел** на главной: что делают участники и какие бонусы получают.',
  },
  {
    id: 'faq',
    target: 'welcome-faq',
    headerTitle: 'Вопросы',
    title: 'Частые вопросы',
    highlight:
      'Ответы на **самые популярные вопросы** — гарантии, сроки, донаты и другое.',
  },
];

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
    target: 'welcome-hero',
  },
  {
    id: 'stories',
    route: '/stories',
    headerTitle: 'Истории',
    title: 'Истории участников',
    subtitle: 'Шаг 2 из 5',
    description:
      'В этом разделе публикуются реальные истории участников, получивших гонорар или грант.',
    highlight:
      'Здесь публикуют **реальные истории** и показывают, **как устроены гонорары и гранты**.',
    target: 'stories-content',
  },
  {
    id: 'applications',
    route: '/applications/demo',
    headerTitle: 'Публикация истории',
    title: 'Опубликовать историю',
    subtitle: 'Шаг 3 из 5',
    description:
      'На этой странице вы рассказываете свою историю и отправляете материал на рассмотрение.',
    highlight:
      'Заполните **форму публикации**, опишите историю и отправьте материал на **рассмотрение**.',
    target: 'application-form',
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
    target: 'reviews-feed',
  },
  {
    id: 'profile',
    route: '/profile/demo',
    headerTitle: 'Личный кабинет',
    title: 'Ваш будущий профиль',
    subtitle: 'Шаг 5 из 5',
    description:
      'После регистрации у вас появится личный кабинет — истории, бонусы и настройки.',
    highlight:
      '**Истории**, **бонусы** и **настройки** — всё в одном месте.',
    target: 'profile-card',
  },
];

export const KOPI_TOUR_FINISH_MESSAGE =
  'Экскурсия завершена! Если понадобится подсказка — нажмите на меня в любой момент. Удачи!';

export const KOPI_TOUR_TARGET_ATTR = 'data-kopi-tour';

export function getTourStepTargetSelector(target: string): string {
  return `[${KOPI_TOUR_TARGET_ATTR}="${target}"]`;
}

export function isTourTargetVisible(target: string): boolean {
  if (typeof document === 'undefined') return true;
  const element = document.querySelector(getTourStepTargetSelector(target));
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 2 && rect.height > 2;
}

export function findWelcomeSubStepIndex(
  from: number,
  direction: 'next' | 'prev',
): number | null {
  if (direction === 'next') {
    for (let index = from; index < KOPI_HOME_TOUR_SUBSTEPS.length; index += 1) {
      if (isTourTargetVisible(KOPI_HOME_TOUR_SUBSTEPS[index].target)) return index;
    }
    return null;
  }

  for (let index = from; index >= 0; index -= 1) {
    if (isTourTargetVisible(KOPI_HOME_TOUR_SUBSTEPS[index].target)) return index;
  }
  return null;
}

export function getFirstWelcomeSubStepIndex(): number {
  return findWelcomeSubStepIndex(0, 'next') ?? 0;
}

export function getLastWelcomeSubStepIndex(): number {
  return (
    findWelcomeSubStepIndex(KOPI_HOME_TOUR_SUBSTEPS.length - 1, 'prev') ??
    KOPI_HOME_TOUR_SUBSTEPS.length - 1
  );
}

export function getTourTotalSegments(): number {
  return KOPI_HOME_TOUR_SUBSTEPS.length + KOPI_TOUR_STEPS.length - 1;
}

export function getTourSegmentIndex(stepIndex: number, subStepIndex: number): number {
  if (stepIndex === 0) return subStepIndex + 1;
  return KOPI_HOME_TOUR_SUBSTEPS.length + stepIndex;
}

export function getTourProgressPercent(stepIndex: number, subStepIndex: number): number {
  return (getTourSegmentIndex(stepIndex, subStepIndex) / getTourTotalSegments()) * 100;
}

export interface ActiveTourView {
  target: string;
  headline: string;
  highlight: string;
  badge: string;
  segmentId: string;
  stepLabel: string;
}

export function resolveActiveTourView(
  stepIndex: number,
  subStepIndex: number,
  isGuest: boolean,
): ActiveTourView | null {
  const step = KOPI_TOUR_STEPS[stepIndex];
  if (!step) return null;

  if (step.id === 'welcome') {
    const subStep = KOPI_HOME_TOUR_SUBSTEPS[subStepIndex] ?? KOPI_HOME_TOUR_SUBSTEPS[0];
    return {
      target: subStep.target,
      headline: subStep.title,
      highlight: subStep.highlight,
      badge: subStep.headerTitle,
      segmentId: `welcome-${subStep.id}`,
      stepLabel: `Главная · ${subStepIndex + 1} из ${KOPI_HOME_TOUR_SUBSTEPS.length}`,
    };
  }

  return {
    target: step.target,
    headline: getTourStepHeadline(step, isGuest),
    highlight: getTourStepHighlight(step, isGuest),
    badge: step.headerTitle,
    segmentId: step.id,
    stepLabel: `Шаг ${stepIndex + 1} из ${KOPI_TOUR_STEP_COUNT} · ${step.headerTitle}`,
  };
}

export function isLastWelcomeSubStep(subStepIndex: number): boolean {
  const lastVisible = getLastWelcomeSubStepIndex();
  return subStepIndex >= lastVisible;
}

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
    return '**Истории**, **бонусы** и **настройки** — всё собрано здесь.';
  }
  return step.highlight;
}
