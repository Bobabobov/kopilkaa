import type { Route } from 'next';
import { FAQ_ITEMS } from '@/lib/content/faq';
import {
  KOPI_APPLICATION_STEPS,
  KOPI_MAIN_ACTIONS,
  KOPI_TELEGRAM_GROUP_URL,
  KOPI_WELCOME,
  KOPI_WELCOME_AUTH,
  type KopiMenuId,
  type KopiQuickAction,
} from '@/lib/kopi/kopiScenarios';
import { sanitizeKopiUserQuery } from '@/lib/kopi/kopiSecurity';

interface PageHint {
  welcomeSuffix: string;
  priorityActionIds: Array<KopiQuickAction['id']>;
}

interface KopiQueryContext {
  pathname: string;
  isGuest: boolean;
  conversation?: KopiConversationState;
}

export interface KopiConversationState {
  lastFaqIndex: number | null;
  lastIntent: KopiIntentType | null;
  lastReply?: string | null;
}

export type KopiIntentType =
  | 'faq_answer'
  | 'application_guide'
  | 'navigate'
  | 'start_tour'
  | 'open_faq'
  | 'open_navigation'
  | 'greeting'
  | 'smalltalk'
  | 'thanks'
  | 'telegram'
  | 'fallback';

export interface KopiQueryResult {
  intent: KopiIntentType;
  reply: string;
  faqIndex?: number;
  navigateTo?: Route;
  navigateLabel?: string;
  relatedFaqIndices?: number[];
  openMenu?: KopiMenuId;
  conversationPatch?: Partial<KopiConversationState>;
  externalLink?: {
    href: string;
    label: string;
  };
}

interface SmalltalkRule {
  match: (text: string) => boolean;
  reply: string;
}

const SMALLTALK_RULES: SmalltalkRule[] = [
  {
    match: (text) =>
      includesAny(text, [
        'как дела',
        'как ты',
        'как сам',
        'как настроение',
        'что нового',
        'как жизнь',
        'как поживаешь',
      ]),
    reply:
      'У меня всё отлично, спасибо что спросили! Готов помочь с «Копилкой» — заявки, разделы сайта, частые вопросы.',
  },
  {
    match: (text) =>
      includesAny(text, [
        'кто ты',
        'что ты',
        'ты бот',
        'ты робот',
        'ты живой',
        'ты человек',
        'что умеешь',
        'чем можешь помочь',
      ]),
    reply:
      'Я Копи — помощник платформы «Копилка». Подскажу по сайту, заявкам и частым вопросам. По живому общению — наш Telegram-канал, напишите «телеграм».',
  },
  {
    match: (text) => {
      if (includesAny(text, ['ждать', 'решени', 'очеред', 'рассмотр'])) return false;
      return (
        includesAny(text, ['до свидания', 'увидимся', 'бай', 'bye']) ||
        text === 'пока' ||
        text.startsWith('пока!')
      );
    },
    reply: 'До встречи! Если что — я рядом, нажмите на кнопку слева внизу.',
  },
  {
    match: (text) =>
      includesAny(text, ['хорошо', 'понятно', 'ясно', 'окей', 'ок ', ' ладно', 'принял', 'услышал']) &&
      text.length < 25,
    reply: 'Рад, что помог! Если понадобится ещё что-то — пишите.',
  },
  {
    match: (text) => includesAny(text, ['смешно', 'шутк', 'анекдот', 'пошути']),
    reply:
      'Шутить — это пока не мой конёк, я больше по делу. Но с заявкой или навигацией по сайту точно помогу!',
  },
  {
    match: (text) => includesAny(text, ['скучно', 'грустно', 'плохо', 'тяжело']),
    reply:
      'Мне жаль, что вам нелегко. Я не смогу решить всё за вас, но если нужна помощь с «Копилкой» — расскажу, как подать историю или куда обратиться на сайте.',
  },
  {
    match: (text) =>
      includesAny(text, ['ты тут', 'есть кто', 'на связи', 'живой']) && text.length < 30,
    reply: 'Я здесь! Спросите про заявку, разделы сайта или нажмите «Частые вопросы».',
  },
];

function detectSmalltalk(query: string): string | null {
  const normalized = normalizeQuery(query);
  for (const rule of SMALLTALK_RULES) {
    if (rule.match(normalized)) return rule.reply;
  }
  return null;
}

const STOP_WORDS = new Set([
  'как',
  'что',
  'где',
  'когда',
  'можно',
  'ли',
  'это',
  'в',
  'на',
  'и',
  'или',
  'у',
  'мне',
  'мой',
  'моя',
  'мои',
  'the',
  'a',
]);

const PAGE_HINTS: Array<{ match: (path: string) => boolean; hint: PageHint }> = [
  {
    match: (path) => path === '/applications' || path.startsWith('/applications/'),
    hint: {
      welcomeSuffix:
        'Вы в разделе заявки — подскажу, как заполнить форму и что указать в истории.',
      priorityActionIds: ['go-applications', 'application'],
    },
  },
  {
    match: (path) => path === '/stories' || path.startsWith('/stories/'),
    hint: {
      welcomeSuffix:
        'Здесь публикуются одобренные истории. Если готовы рассказать свою — помогу с заявкой.',
      priorityActionIds: ['go-applications', 'application'],
    },
  },
  {
    match: (path) => path === '/good-deeds' || path.startsWith('/good-deeds/'),
    hint: {
      welcomeSuffix:
        'В «Добрых делах» можно выполнять задания и получать бонусы. Спросите — объясню правила.',
      priorityActionIds: ['faq', 'navigation'],
    },
  },
  {
    match: (path) => path === '/support',
    hint: {
      welcomeSuffix:
        'Это раздел поддержки проекта. Расскажу, чем донаты отличаются от заявок на помощь.',
      priorityActionIds: ['faq', 'navigation'],
    },
  },
  {
    match: (path) => path === '/profile' || path.startsWith('/profile/'),
    hint: {
      welcomeSuffix:
        'В профиле — заявки, друзья и настройки. Подскажу, где что найти.',
      priorityActionIds: ['navigation', 'application'],
    },
  },
  {
    match: (path) => path === '/reviews',
    hint: {
      welcomeSuffix:
        'Здесь отзывы участников. Если думаете подать заявку — расскажу, как это сделать.',
      priorityActionIds: ['application', 'go-applications'],
    },
  },
  {
    match: (path) => path === '/standards' || path.startsWith('/standards/'),
    hint: {
      welcomeSuffix:
        'Здесь правила и стандарты платформы. Спросите про заявки, рекламу или условия участия.',
      priorityActionIds: ['faq', 'application'],
    },
  },
  {
    match: (path) => path === '/advertising' || path.startsWith('/advertising/'),
    hint: {
      welcomeSuffix:
        'Раздел для рекламодателей. По заявкам на помощь — это другой путь, подскажу отдельно.',
      priorityActionIds: ['faq', 'navigation'],
    },
  },
  {
    match: (path) => path === '/terms' || path.startsWith('/terms/'),
    hint: {
      welcomeSuffix:
        'Здесь правила и условия платформы. По заявкам и разделам сайта тоже подскажу.',
      priorityActionIds: ['faq', 'application'],
    },
  },
  {
    match: (path) => path === '/heroes' || path.startsWith('/heroes/'),
    hint: {
      welcomeSuffix:
        'Здесь участники, которые поддерживают проект. Хотите подать заявку — расскажу, как.',
      priorityActionIds: ['application', 'faq'],
    },
  },
  {
    match: (path) => path === '/friends' || path.startsWith('/friends/'),
    hint: {
      welcomeSuffix:
        'Раздел друзей и поиска участников. Реферальная программа — в профиле.',
      priorityActionIds: ['navigation', 'faq'],
    },
  },
  {
    match: (path) => path === '/',
    hint: {
      welcomeSuffix: '',
      priorityActionIds: ['start-tour', 'application'],
    },
  },
];

const UNKNOWN_REPLY =
  'Хм, я пока не умею ответить на это — всё ещё учусь. Сейчас лучше всего помогаю с заявками, разделами сайта и частыми вопросами о «Копилке». Попробуйте переформулировать или нажмите «Частые вопросы».';

const TYPO_REPLACEMENTS: Array<[RegExp, string]> = [
  [/капилк/g, 'копилк'],
  [/заявак/g, 'заявк'],
  [/прфил/g, 'профил'],
  [/реистрац/g, 'регистрац'],
  [/донатт/g, 'донат'],
  [/бонусс/g, 'бонус'],
  [/историия/g, 'история'],
  [/телеграмм/g, 'телеграм'],
  [/отзывв/g, 'отзыв'],
  [/уведомлениие/g, 'уведомлени'],
  [/поддержкк/g, 'поддержк'],
];

const COMPARISON_REPLIES: Array<{ match: (text: string) => boolean; reply: string }> = [
  {
    match: (text) =>
      includesAny(text, ['донат', 'пожертв', 'поддержать проект']) &&
      includesAny(text, ['заявк', 'истори', 'помощь мне']) &&
      includesAny(text, ['отличи', 'разниц', 'чем', 'что лучше']),
    reply:
      'Коротко:\n\n• **Заявка** — вы просите финансовую поддержку для своей жизненной ситуации. Решение принимает платформа, гарантий нет.\n\n• **Донат** — вы поддерживаете саму «Копилку» и развитие проекта. Это не заявка на помощь и не повышает шансы одобрения истории.\n\nЕсли нужна помощь лично вам — подавайте заявку. Если хотите поддержать проект — раздел «Поддержать».',
  },
  {
    match: (text) =>
      includesAny(text, ['добр', 'дел', 'бонус']) &&
      includesAny(text, ['заявк', 'истори', 'финанс']) &&
      includesAny(text, ['отличи', 'разниц', 'чем']),
    reply:
      '**Заявка** — запрос финансовой поддержки по вашей ситуации.\n\n**Добрые дела** — отдельные задания за бонусы: выполняете в жизни, отправляете отчёт, модератор проверяет. Это не замена заявке и не гарантирует выплату.',
  },
];

const FAQ_KEYWORDS: Record<number, string[]> = {
  0: ['гарант', 'проект', 'что это', 'копилка', 'платформа', 'надежн', 'обман', 'довер', 'легальн', 'мошен'],
  1: ['истори', 'рассказ', 'категор', 'ситуац', 'писать', 'заполн', 'форм', 'тема', 'фото', 'реквизит'],
  2: ['ждать', 'срок', 'решени', 'очеред', 'рассмотр', 'долго', 'когда ответ', 'статус', 'одобр', 'отклон'],
  3: ['стрим', 'трансляц', 'зрител', 'эфир', 'вещан', 'kick', 'твич'],
  4: ['донат', 'поддержк проект', 'пожертв', 'поддержать копилк', 'вложить в проект'],
  5: ['деньг', 'комисси', 'баланс', 'бюджет', 'куда уходят', 'счет', 'счёт', 'касс'],
  6: ['повторн', 'снова', 'второй раз', 'еще раз', 'ещё раз', 'несколько', 'вторая заяв'],
  7: ['добр', 'дел', 'задани', 'бонус', 'добрые дела', 'выполнить задан', 'отчет', 'отчёт'],
  8: ['уровен', 'сложност', 'линейк', 'сменить уровень', 'изменить сложност'],
  9: ['начисл', '3/3', 'отчёт', 'отчет', 'сколько бонус', 'награда за неделю'],
};

/** Прямые соответствия формулировок → FAQ */
const FAQ_ALIASES: Array<{ patterns: string[]; index: number }> = [
  { patterns: ['есть ли гарант', 'гарантии', 'точно дадут', 'обман', 'мошен'], index: 0 },
  { patterns: ['что за проект', 'что это за', 'что такое копил'], index: 0 },
  { patterns: ['какие истории', 'что писать', 'что можно рассказ'], index: 1 },
  { patterns: ['сколько ждать', 'как долго', 'когда ответ', 'срок рассмотр'], index: 2 },
  { patterns: ['стрим', 'трансляц', 'эфир'], index: 3 },
  { patterns: ['что такое донат', 'зачем донат', 'донат в копил'], index: 4 },
  { patterns: ['комисси', 'куда деньги', 'где деньги', 'баланс'], index: 5 },
  { patterns: ['повторно', 'снова подать', 'второй раз'], index: 6 },
  { patterns: ['добрые дела', 'что за задан', 'как работают добр'], index: 7 },
  { patterns: ['уровень сложност', 'сменить уровень'], index: 8 },
  { patterns: ['как начисл', 'бонус за', '3 из 3', '3/3'], index: 9 },
  { patterns: ['уведомлен', 'придет сообщен', 'придёт сообщен'], index: 2 },
  { patterns: ['оставить отзыв', 'нужен отзыв', 'зачем отзыв'], index: 1 },
  { patterns: ['сколько дадут', 'сколько получу', 'какая сумм'], index: 0 },
];

const RELATED_FAQ: Record<number, number[]> = {
  0: [1, 2, 4],
  1: [2, 6, 0],
  2: [1, 6, 3],
  3: [2, 0],
  4: [5, 0, 1],
  5: [4, 0],
  6: [1, 2],
  7: [8, 9],
  8: [7, 9],
  9: [7, 8],
};

interface RouteIntent {
  route: Route;
  label: string;
  keywords: string[];
  /** Не срабатывать, если в запросе есть эти слова */
  exclude?: string[];
}

const ROUTE_INTENTS: RouteIntent[] = [
  {
    route: '/applications',
    label: 'Заявка',
    keywords: ['заявк', 'подать истор', 'рассказать истор', 'оформить заяв', 'подать заяв'],
    exclude: ['статус', 'где смотреть', 'где моя', 'где заяв', 'одобри', 'отклон'],
  },
  {
    route: '/profile',
    label: 'Профиль',
    keywords: ['профил', 'личн кабинет', 'кабинет', 'мои заявк', 'настройк аккаунт'],
    exclude: ['статус заявк', 'где заявк', 'где моя заяв', 'одобри', 'отклон'],
  },
  {
    route: '/support',
    label: 'Поддержать',
    keywords: ['донат', 'поддержать проект', 'пожертв', 'перевести проекту', 'скинуть на копилк'],
    exclude: ['финансов', 'помощь мне', 'нужна помощь'],
  },
  {
    route: '/good-deeds',
    label: 'Добрые дела',
    keywords: ['добр дел', 'добрые дела', 'задани', 'бонус', 'выполнить задан'],
  },
  {
    route: '/stories',
    label: 'Истории',
    keywords: ['истори участник', 'читать истор', 'раздел истор', 'опубликован'],
    exclude: ['подать', 'свою', 'своя', 'написать'],
  },
  {
    route: '/reviews',
    label: 'Отзывы',
    keywords: ['отзыв', 'отклик', 'мнени участник'],
  },
  {
    route: '/heroes',
    label: 'Герои',
    keywords: ['герои', 'герой', 'благодарност', 'поддержавш'],
  },
  {
    route: '/advertising',
    label: 'Реклама',
    keywords: ['реклам', 'разместить баннер', 'медиакит', 'баннер'],
  },
  {
    route: '/terms',
    label: 'Правила',
    keywords: ['правил', 'условия использ', 'политик', 'пользовательск', 'оферт'],
  },
  {
    route: '/standards',
    label: 'Стандарты',
    keywords: ['стандарт', 'рекламн стандарт', 'требован к реклам'],
  },
  {
    route: '/friends',
    label: 'Друзья',
    keywords: ['друзья', 'добавить в друз', 'найти участник', 'реферал', 'пригласить друга'],
    exclude: ['реферальн программ'],
  },
  {
    route: '/',
    label: 'Главная',
    keywords: ['главн', 'домой', 'начало сайта', 'на главную'],
  },
];

const FAQ_MIN_SCORE = 5;
const FAQ_SOFT_MIN_SCORE = 3;

const APPLICATION_STATUS_REPLY =
  'Если заявку одобрят или отклонят — придёт уведомление. Если уведомлений нет, значит заявка ещё в очереди на проверку.';

function isApplicationStatusQuery(text: string): boolean {
  return (
    includesAny(text, [
      'статус заяв',
      'одобрили',
      'отклонили',
      'мою заяв',
      'где заявк',
      'где моя заяв',
      'просмотреть заяв',
      'уведомлен',
      'придет сообщен',
      'придёт сообщен',
      'оповещ',
    ]) ||
    (includesAny(text, ['статус', 'рассмотрен']) && includesAny(text, ['заявк']))
  );
}

function normalizeQuery(query: string): string {
  let normalized = query
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}\s/?!]/gu, ' ')
    .replace(/\s+/g, ' ');

  for (const [pattern, replacement] of TYPO_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

function getQueryTokens(query: string): string[] {
  return normalizeQuery(query)
    .split(' ')
    .filter((word) => word.length >= 2 && !STOP_WORDS.has(word));
}

function getPageHint(pathname: string): PageHint | null {
  for (const entry of PAGE_HINTS) {
    if (entry.match(pathname)) return entry.hint;
  }
  return null;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро!';
  if (hour >= 12 && hour < 18) return 'Добрый день!';
  if (hour >= 18 && hour < 23) return 'Добрый вечер!';
  return 'Привет!';
}

function includesAny(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

function scoreFaqIndex(query: string, index: number): number {
  const normalized = normalizeQuery(query);
  if (!normalized) return 0;

  const item = FAQ_ITEMS[index];
  if (!item) return 0;

  let score = 0;
  const question = item.question.toLowerCase();
  const answer = item.answer.toLowerCase();

  if (question.includes(normalized)) score += 14;
  if (answer.includes(normalized)) score += 5;

  getQueryTokens(query).forEach((word) => {
    if (question.includes(word)) score += 4;
    if (answer.includes(word)) score += 2;
  });

  const keywords = FAQ_KEYWORDS[index] ?? [];
  keywords.forEach((keyword) => {
    if (normalized.includes(keyword)) score += 6;
  });

  return score;
}

export function searchFaqIndices(query: string): number[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const matches: Array<{ index: number; score: number }> = [];

  FAQ_ITEMS.forEach((_, index) => {
    const score = scoreFaqIndex(query, index);
    if (score > 0) matches.push({ index, score });
  });

  return matches.sort((a, b) => b.score - a.score).map((m) => m.index);
}

export function findBestFaqMatch(query: string): number | null {
  const alias = findFaqAlias(query);
  if (alias !== null) return alias;

  const normalized = normalizeQuery(query);
  if (!normalized) return null;

  let bestIndex: number | null = null;
  let bestScore = 0;

  FAQ_ITEMS.forEach((_, index) => {
    const score = scoreFaqIndex(query, index);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestScore >= FAQ_MIN_SCORE ? bestIndex : null;
}

function findSoftFaqMatch(query: string): number | null {
  let bestIndex: number | null = null;
  let bestScore = 0;

  FAQ_ITEMS.forEach((_, index) => {
    const score = scoreFaqIndex(query, index);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestScore >= FAQ_SOFT_MIN_SCORE && bestScore < FAQ_MIN_SCORE) {
    return bestIndex;
  }
  return null;
}

function findFaqAlias(query: string): number | null {
  const normalized = normalizeQuery(query);
  for (const alias of FAQ_ALIASES) {
    if (alias.patterns.some((pattern) => normalized.includes(pattern))) {
      return alias.index;
    }
  }
  return null;
}

export function getRelatedFaqIndices(faqIndex: number, limit = 3): number[] {
  const related = RELATED_FAQ[faqIndex] ?? [];
  return related.filter((i) => i !== faqIndex).slice(0, limit);
}

function detectRouteIntent(query: string): RouteIntent | null {
  const normalized = normalizeQuery(query);
  const direct = detectDirectSectionQuery(normalized);
  if (direct) return direct;

  const wantsNavigation =
    includesAny(normalized, [
      'где ',
      'перейти',
      'перейд',
      'открой',
      'открыть',
      'покажи',
      'показать',
      'покажи раздел',
      'как найти',
      'как попасть',
      'веди в',
      'направь',
      'хочу в',
      'нужен раздел',
      'зайти в',
      'попасть в',
    ]) || normalized.startsWith('где ');

  if (!wantsNavigation) return null;

  for (const intent of ROUTE_INTENTS) {
    if (intent.exclude?.some((word) => normalized.includes(word))) continue;
    if (includesAny(normalized, intent.keywords)) return intent;
  }

  return null;
}

/** Короткий запрос вроде «заявка» или «хочу в профиль» */
function detectDirectSectionQuery(normalized: string): RouteIntent | null {
  if (normalized.length > 36) return null;
  if (isApplicationStatusQuery(normalized)) return null;

  const directPhrases: Array<{ patterns: string[]; route: Route; label: string }> = [
    { patterns: ['хочу подать', 'нужна помощь', 'нужны деньги', 'помогите'], route: '/applications', label: 'Заявка' },
    { patterns: ['заявк'], route: '/applications', label: 'Заявка' },
    { patterns: ['профил', 'кабинет'], route: '/profile', label: 'Профиль' },
    { patterns: ['донат', 'поддержать проект'], route: '/support', label: 'Поддержать' },
    { patterns: ['добр дел', 'бонус'], route: '/good-deeds', label: 'Добрые дела' },
    { patterns: ['истори'], route: '/stories', label: 'Истории' },
    { patterns: ['отзыв'], route: '/reviews', label: 'Отзывы' },
    { patterns: ['геро'], route: '/heroes', label: 'Герои' },
    { patterns: ['реклам'], route: '/advertising', label: 'Реклама' },
    { patterns: ['правил', 'условия', 'политик', 'оферт'], route: '/terms', label: 'Правила' },
    { patterns: ['стандарт'], route: '/standards', label: 'Стандарты' },
    { patterns: ['друз', 'реферал'], route: '/friends', label: 'Друзья' },
    { patterns: ['главн', 'домой'], route: '/', label: 'Главная' },
  ];

  for (const entry of directPhrases) {
    if (includesAny(normalized, entry.patterns)) {
      const intent = ROUTE_INTENTS.find((item) => item.route === entry.route);
      if (intent?.exclude?.some((word) => normalized.includes(word))) continue;
      return { route: entry.route, label: entry.label, keywords: entry.patterns };
    }
  }

  return null;
}

function detectApplicationGuideIntent(query: string): boolean {
  const normalized = normalizeQuery(query);
  return includesAny(normalized, [
    'как подать',
    'как заполнить',
    'как написать заяв',
    'инструкция',
    'пошагово',
    'пошагов',
    'что писать',
    'что указать',
    'как оформить',
    'как рассказать истор',
    'шаги заявк',
    'помоги с заявк',
    'помоги подать',
    'с чего начать',
    'начать заявк',
    'оформить истор',
  ]);
}

function detectTourIntent(query: string): boolean {
  const normalized = normalizeQuery(query);
  return includesAny(normalized, [
    'экскурс',
    'покажи сайт',
    'показать сайт',
    'обзор сайта',
    'проведи тур',
    'как устроен сайт',
    'расскажи о сайте',
  ]);
}

function detectAuthIntent(query: string, isGuest: boolean): KopiQueryResult | null {
  const normalized = normalizeQuery(query);
  const isAuthQuery = includesAny(normalized, [
    'регистрац',
    'зарегистрир',
    'войти',
    'вход',
    'логин',
    'аккаунт',
    'создать профиль',
    'авториз',
  ]);

  if (!isAuthQuery) return null;

  if (isGuest) {
    return {
      intent: 'application_guide',
      reply:
        'Для заявки нужен аккаунт. Нажмите «Войти» в шапке сайта — там же можно зарегистрироваться. После входа откроется форма заявки.',
      openMenu: 'application',
    };
  }

  return {
    intent: 'navigate',
    reply:
      'Вы уже вошли в аккаунт. Статус заявок, друзья и настройки — в разделе «Профиль». Сейчас перенесу вас туда.',
    navigateTo: '/profile',
    navigateLabel: 'Профиль',
  };
}

function buildFaqAnswerReply(
  faqIndex: number,
  context?: KopiQueryContext,
): KopiQueryResult {
  const item = FAQ_ITEMS[faqIndex];
  const hint = getFaqActionHint(faqIndex, context);
  const reply = hint ? `${item?.answer ?? ''}\n\n${hint}` : item?.answer ?? '';

  return {
    intent: 'faq_answer',
    reply,
    faqIndex,
    relatedFaqIndices: getRelatedFaqIndices(faqIndex),
    openMenu: 'faq-answer',
    conversationPatch: { lastFaqIndex: faqIndex, lastIntent: 'faq_answer' },
  };
}

function getFaqActionHint(faqIndex: number, context?: KopiQueryContext): string | null {
  const hints: Record<number, string> = {
    0: 'Если готовы рассказать ситуацию — напишите «как подать заявку», проведу по шагам.',
    1: 'Могу открыть инструкцию по заявке — просто спросите «как подать заявку».',
    2: 'Если одобрят или отклонят — придёт уведомление. Нет уведомлений — заявка ещё на проверке.',
    4: 'Поддержать проект можно в разделе «Поддержать» — это не то же самое, что подача заявки.',
    7: 'Раздел «Добрые дела» на сайте — там выбираете задания и отправляете отчёты.',
  };
  return hints[faqIndex] ?? null;
}

function detectComparison(query: string): string | null {
  const normalized = normalizeQuery(query);
  for (const item of COMPARISON_REPLIES) {
    if (item.match(normalized)) {
      return item.reply.replace(/\*\*(.*?)\*\*/g, '«$1»');
    }
  }
  return null;
}

function detectTelegramIntent(query: string): KopiQueryResult | null {
  const normalized = normalizeQuery(query);

  const isTelegramTopic = includesAny(normalized, [
    'телеграм',
    'telegram',
    'телега',
    'тг канал',
    'тг групп',
    'тг чат',
    'канал копил',
    'группа копил',
    'чат копил',
    'сообщество',
    'подписаться',
    'подписк',
  ]) || normalized === 'тг';

  const isContactTopic =
    includesAny(normalized, [
      'связаться',
      'написать',
      'куда написать',
      'контакт',
      'оператор',
      'админ',
      'поддержк',
      'связь',
    ]) &&
    !includesAny(normalized, ['заявк', 'донат', 'форм', 'профил']);

  if (!isTelegramTopic && !isContactTopic) return null;

  return {
    intent: 'telegram',
    reply:
      'Наш Telegram-канал «Копилка» — новости проекта и общение с сообществом.',
    externalLink: {
      href: KOPI_TELEGRAM_GROUP_URL,
      label: 'Открыть Telegram «Копилка»',
    },
    conversationPatch: { lastIntent: 'telegram' },
  };
}

function getFaqAffirmativeFollowUp(faqIndex: number): KopiQueryResult | null {
  const actions: Partial<Record<number, KopiQueryResult>> = {
    0: {
      intent: 'application_guide',
      reply: 'Хорошо! Покажу, как подать заявку — шаг за шагом.',
      openMenu: 'application',
      conversationPatch: { lastIntent: 'application_guide' },
    },
    1: {
      intent: 'application_guide',
      reply: 'Отлично! Открою инструкцию по заполнению заявки.',
      openMenu: 'application',
      conversationPatch: { lastIntent: 'application_guide' },
    },
    2: {
      intent: 'faq_answer',
      reply: APPLICATION_STATUS_REPLY,
      faqIndex: 2,
      conversationPatch: { lastFaqIndex: 2, lastIntent: 'faq_answer' },
    },
    4: {
      intent: 'navigate',
      reply: 'Переношу в раздел «Поддержать» — там можно поддержать проект донатом.',
      navigateTo: '/support',
      navigateLabel: 'Поддержать',
      conversationPatch: { lastIntent: 'navigate' },
    },
    7: {
      intent: 'navigate',
      reply: 'Открываю «Добрые дела» — там выбирают задания и отправляют отчёты.',
      navigateTo: '/good-deeds',
      navigateLabel: 'Добрые дела',
      conversationPatch: { lastIntent: 'navigate' },
    },
  };
  return actions[faqIndex] ?? null;
}

function detectFollowUp(
  query: string,
  conversation?: KopiConversationState,
): KopiQueryResult | null {
  if (!conversation) return null;

  const normalized = normalizeQuery(query);
  const { lastFaqIndex, lastIntent, lastReply } = conversation;

  if (
    includesAny(normalized, [
      'повтори',
      'повторите',
      'еще раз',
      'ещё раз',
      'не понял',
      'не поняла',
      'объясни проще',
      'неясно',
      'что ты сказал',
      'что вы сказали',
    ])
  ) {
    if (lastReply) {
      return {
        intent: 'smalltalk',
        reply: `Повторю:\n\n${lastReply}`,
        conversationPatch: { lastIntent: 'smalltalk' },
      };
    }
  }

  if (
    normalized.length < 22 &&
    includesAny(normalized, ['нет', 'не надо', 'отмена', 'не нужно', 'не хочу', 'стоп'])
  ) {
    return {
      intent: 'smalltalk',
      reply: 'Хорошо, без проблем. Если понадобится помощь — я рядом.',
      conversationPatch: { lastIntent: 'smalltalk' },
    };
  }

  if (
    lastFaqIndex !== null &&
    includesAny(normalized, ['почему', 'зачем', 'как так', 'объясни почему', 'а почему'])
  ) {
    const item = FAQ_ITEMS[lastFaqIndex];
    const base = buildFaqAnswerReply(lastFaqIndex);
    return {
      ...base,
      reply: item
        ? `По теме «${item.question}»:\n\n${item.answer}`
        : base.reply,
    };
  }

  if (
    includesAny(normalized, [
      'подробнее',
      'поподробнее',
      'расскажи больше',
      'углубись',
      'ещё про это',
      'еще про это',
      'продолжай',
      'развернуто',
    ])
  ) {
    if (lastFaqIndex !== null) {
      const related = getRelatedFaqIndices(lastFaqIndex);
      const nextIndex = related[0];
      if (nextIndex !== undefined) {
        return buildFaqAnswerReply(nextIndex);
      }
    }
    return {
      intent: 'open_faq',
      reply: 'Открою список вопросов — выберите тему, которую хотите разобрать подробнее:',
      openMenu: 'faq',
      conversationPatch: { lastIntent: 'open_faq' },
    };
  }

  if (
    includesAny(normalized, [
      'другой вопрос',
      'другое',
      'что ещё',
      'что еще',
      'ещё вопрос',
      'еще вопрос',
    ])
  ) {
    return {
      intent: 'open_faq',
      reply: 'Хорошо, вот другие частые вопросы:',
      openMenu: 'faq',
      conversationPatch: { lastIntent: 'open_faq' },
    };
  }

  if (
    lastIntent === 'telegram' &&
    includesAny(normalized, ['да', 'давай', 'хочу', 'ссылк', 'открой', 'покажи'])
  ) {
    return detectTelegramIntent('телеграм');
  }

  if (
    lastIntent === 'faq_answer' &&
    lastFaqIndex !== null &&
    normalized.length < 14 &&
    includesAny(normalized, ['да', 'давай', 'хочу', 'ок', 'окей', 'ага', 'угу', 'поехали', 'готов'])
  ) {
    const followUp = getFaqAffirmativeFollowUp(lastFaqIndex);
    if (followUp) return followUp;
  }

  if (
    lastIntent === 'application_guide' &&
    includesAny(normalized, ['да', 'давай', 'поехали', 'начнем', 'начнём', 'хочу', 'готов'])
  ) {
    return {
      intent: 'navigate',
      reply: 'Отлично! Переношу вас в раздел заявки.',
      navigateTo: '/applications',
      navigateLabel: 'Заявка',
      conversationPatch: { lastIntent: 'navigate' },
    };
  }

  if (
    lastIntent === 'navigate' &&
    includesAny(normalized, ['да', 'давай', 'поехали', 'хочу'])
  ) {
    return {
      intent: 'open_navigation',
      reply: 'Выберите раздел, куда перейти:',
      openMenu: 'navigation',
      conversationPatch: { lastIntent: 'open_navigation' },
    };
  }

  return null;
}

function detectVagueHelp(query: string, context: KopiQueryContext): KopiQueryResult | null {
  const normalized = normalizeQuery(query);
  const isVague = includesAny(normalized, [
    'помоги',
    'не понимаю',
    'не знаю что делать',
    'что делать',
    'куда жать',
    'куда нажать',
    'запутался',
    'запуталась',
    'с чего начать',
  ]);

  if (!isVague || normalized.length > 80) return null;

  const hint = getPageHint(context.pathname);
  if (hint?.welcomeSuffix) {
    return {
      intent: 'smalltalk',
      reply: `${hint.welcomeSuffix}\n\nМогу показать инструкцию по заявке, открыть разделы сайта или ответить на частый вопрос — напишите, что вам ближе.`,
      conversationPatch: { lastIntent: 'smalltalk' },
    };
  }

  return {
    intent: 'smalltalk',
    reply:
      'Давайте разберёмся. Чаще всего спрашивают про заявку, донаты, добрые дела и разделы сайта. Напишите, что вам нужно — или нажмите «Частые вопросы».',
    conversationPatch: { lastIntent: 'smalltalk' },
  };
}

function findMultipleFaqMatches(query: string): number[] {
  const normalized = normalizeQuery(query);
  const separator = normalized.includes(' и ')
    ? ' и '
    : normalized.includes(' а ')
      ? ' а '
      : normalized.includes(',')
        ? ','
        : null;
  if (!separator) return [];

  const parts = normalized
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return [];

  const indices = new Set<number>();
  for (const part of parts) {
    const match = findBestFaqMatch(part);
    if (match !== null) indices.add(match);
  }

  return [...indices].slice(0, 2);
}

interface ContextualKnowledgeRule {
  match: (text: string, context: KopiQueryContext) => boolean;
  build: (context: KopiQueryContext) => KopiQueryResult;
}

const CONTEXTUAL_KNOWLEDGE: ContextualKnowledgeRule[] = [
  {
    match: (text) => isApplicationStatusQuery(text),
    build: () => ({
      intent: 'faq_answer',
      reply: APPLICATION_STATUS_REPLY,
      faqIndex: 2,
      conversationPatch: { lastFaqIndex: 2, lastIntent: 'faq_answer' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, [
        'реквизит',
        'карт',
        'сбп',
        'номер телефон',
        'куда перевод',
        'счет получател',
        'счёт получател',
        'банковск',
      ]),
    build: () => ({
      intent: 'faq_answer',
      reply:
        'Реквизиты для перевода указываются в форме заявки, если они нужны. Проверьте данные перед отправкой — ошибка в карте или СБП затруднит помощь.',
      faqIndex: 1,
      openMenu: 'application',
      conversationPatch: { lastFaqIndex: 1, lastIntent: 'faq_answer' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['фото', 'картинк', 'изображен', 'скрин', 'вложить файл', 'прикрепить']),
    build: (context) => ({
      intent: 'faq_answer',
      reply:
        'Фото в заявке необязательно, но помогает лучше понять ситуацию — документы, скриншоты и т.п. Прикрепляются в форме при заполнении.',
      faqIndex: 1,
      openMenu: context.pathname.startsWith('/applications') ? 'faq-answer' : 'application',
      conversationPatch: { lastFaqIndex: 1, lastIntent: 'faq_answer' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['забан', 'заблокировали', 'аккаунт заблок', 'доступ закрыт', 'блокировк']),
    build: () => ({
      intent: 'smalltalk',
      reply:
        'Если доступ к аккаунту ограничен — это могло быть связано с нарушением правил. По таким случаям лучше написать в Telegram — напишите «телеграм».',
      conversationPatch: { lastIntent: 'smalltalk' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['кто может', 'кому помогают', 'критер', 'кого поддерживают']) &&
      includesAny(text, ['заявк', 'помощь', 'поддержк']),
    build: (context) => buildFaqAnswerReply(1, context),
  },
  {
    match: (text) =>
      includesAny(text, ['заголовок', 'категори', 'описание', 'поле форм', 'что указать в']),
    build: (context) => ({
      intent: 'application_guide',
      reply:
        'В форме нужны категория, заголовок, краткое описание и полная история. Пишите честно и по сути — так модераторам проще принять решение. Могу провести по шагам — напишите «как подать заявку».',
      openMenu: 'application',
      conversationPatch: { lastIntent: 'application_guide' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, [
        'оставить отзыв',
        'написать отзыв',
        'нужен отзыв',
        'зачем отзыв',
        'обязательн отзыв',
      ]) ||
      (includesAny(text, ['отзыв']) &&
        includesAny(text, ['после', 'одобр', 'обязательн', 'нужно', 'как', 'оставить'])),
    build: () => ({
      intent: 'navigate',
      reply:
        'После одобрения заявки нужно оставить отзыв с фото — это условие для следующей заявки. Открою раздел «Отзывы».',
      navigateTo: '/reviews',
      navigateLabel: 'Отзывы',
      conversationPatch: { lastIntent: 'navigate' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['реферальн', 'рефералк', 'пригласить друга', 'реф ссылк', 'бонус за друга']),
    build: (context) => ({
      intent: 'navigate',
      reply: context.isGuest
        ? 'Реферальная программа доступна после регистрации — ссылка и статистика в профиле.'
        : 'Реферальная программа — в профиле: ваша ссылка и статистика приглашений.',
      navigateTo: '/profile/referrals',
      navigateLabel: 'Рефералы',
      conversationPatch: { lastIntent: 'navigate' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['сколько дадут', 'сколько получу', 'какая сумм', 'лимит поддержк']) &&
      !includesAny(text, ['бонус', 'добр']),
    build: () => ({
      intent: 'faq_answer',
      reply:
        'Фиксированной суммы нет — платформа смотрит на ситуацию и возможности бюджета. Уровень доверия в профиле влияет на лимит, но не гарантирует выплату.',
      faqIndex: 0,
      conversationPatch: { lastFaqIndex: 0, lastIntent: 'faq_answer' },
    }),
  },
  {
    match: (text) =>
      includesAny(text, ['уровень довер', 'лимит', 'сколько могу получ']) &&
      !includesAny(text, ['бонус', 'добр', 'сложност']),
    build: (context) => ({
      intent: 'navigate',
      reply:
        'Уровень доверия и лимит поддержки смотрите в профиле. Это не гарантия выплаты, но показывает текущие возможности платформы.',
      navigateTo: context.isGuest ? '/profile/demo' : '/profile',
      navigateLabel: 'Профиль',
      conversationPatch: { lastIntent: 'navigate' },
    }),
  },
  {
    match: (text) =>
      text.length < 28 &&
      (text === 'помощь' ||
        text === 'нужна помощь' ||
        text === 'мне нужна помощь' ||
        includesAny(text, ['нужны деньги', 'нужна финанс'])),
    build: (context) => ({
      intent: 'application_guide',
      reply: context.isGuest
        ? 'Чтобы получить финансовую поддержку — подайте заявку с историей. Сначала нужен аккаунт. Показать шаги?'
        : 'Чтобы получить финансовую поддержку — подайте заявку с вашей историей. Показать, как заполнить форму?',
      openMenu: 'application',
      conversationPatch: { lastIntent: 'application_guide' },
    }),
  },
];

function detectContextualKnowledge(
  query: string,
  context: KopiQueryContext,
): KopiQueryResult | null {
  const normalized = normalizeQuery(query);
  for (const rule of CONTEXTUAL_KNOWLEDGE) {
    if (rule.match(normalized, context)) return rule.build(context);
  }
  return null;
}

function detectPageContextAnswer(
  query: string,
  context: KopiQueryContext,
): KopiQueryResult | null {
  const normalized = normalizeQuery(query);

  if (
    context.pathname.startsWith('/applications') &&
    includesAny(normalized, ['что дальше', 'что делать', 'куда жать', 'отправил', 'отправила'])
  ) {
    return {
      intent: 'smalltalk',
      reply: APPLICATION_STATUS_REPLY,
      conversationPatch: { lastIntent: 'smalltalk' },
    };
  }

  if (
    context.pathname.startsWith('/good-deeds') &&
    includesAny(normalized, ['как начать', 'с чего', 'что делать', 'как участвовать'])
  ) {
    return buildFaqAnswerReply(7, context);
  }

  if (
    context.pathname.startsWith('/profile') &&
    includesAny(normalized, ['где', 'что здесь', 'что тут', 'зачем профиль'])
  ) {
    return {
      intent: 'smalltalk',
      reply:
        'В профиле — ваши заявки и их статус, друзья, настройки аккаунта. Спросите «статус заявки», если ищете конкретное.',
      conversationPatch: { lastIntent: 'smalltalk' },
    };
  }

  return null;
}

function getSmartFallback(query: string, context: KopiQueryContext): KopiQueryResult {
  const indices = searchFaqIndices(query).slice(0, 3);

  if (indices.length > 0) {
    const labels = indices
      .map((index) => FAQ_ITEMS[index]?.question)
      .filter(Boolean)
      .map((question) => `«${question}»`)
      .join(', ');

    return {
      intent: 'fallback',
      reply: `Точного ответа не нашёл, но похоже, вам подойдёт: ${labels}.\n\nНапишите один из этих вопросов — или переформулируйте свой.`,
      relatedFaqIndices: indices,
      openMenu: 'faq',
      conversationPatch: { lastIntent: 'fallback' },
    };
  }

  const hint = getPageHint(context.pathname);
  if (hint?.welcomeSuffix) {
    return {
      intent: 'fallback',
      reply: `${UNKNOWN_REPLY}\n\n${hint.welcomeSuffix}`,
      conversationPatch: { lastIntent: 'fallback' },
    };
  }

  return {
    intent: 'fallback',
    reply: UNKNOWN_REPLY,
    conversationPatch: { lastIntent: 'fallback' },
  };
}

function buildMultiFaqReply(indices: number[]): string {
  return indices
    .map((index, order) => {
      const item = FAQ_ITEMS[index];
      if (!item) return '';
      return `${order + 1}. ${item.question}\n${item.answer}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

function patchConversation(result: KopiQueryResult): KopiQueryResult {
  const patch: Partial<KopiConversationState> = {
    ...(result.conversationPatch ?? {
      lastIntent: result.intent,
      lastFaqIndex: result.faqIndex ?? null,
    }),
    lastReply: result.reply,
  };
  return { ...result, conversationPatch: patch };
}

export function resolveKopiQuery(
  query: string,
  context: KopiQueryContext,
): KopiQueryResult {
  const safeQuery = sanitizeKopiUserQuery(query);
  const normalized = normalizeQuery(safeQuery);
  if (!normalized) {
    return {
      intent: 'fallback',
      reply: 'Напишите вопрос — постараюсь помочь.',
    };
  }

  const followUp = detectFollowUp(safeQuery, context.conversation);
  if (followUp) return patchConversation(followUp);

  const comparison = detectComparison(safeQuery);
  if (comparison) {
    return patchConversation({
      intent: 'faq_answer',
      reply: comparison,
      openMenu: 'faq-answer',
    });
  }

  const multiFaq = findMultipleFaqMatches(safeQuery);
  if (multiFaq.length >= 2) {
    return patchConversation({
      intent: 'faq_answer',
      reply: buildMultiFaqReply(multiFaq),
      faqIndex: multiFaq[0],
      relatedFaqIndices: multiFaq[1] ? [multiFaq[1]] : getRelatedFaqIndices(multiFaq[0]),
      openMenu: 'faq-answer',
    });
  }

  if (
    includesAny(normalized, [
      'привет',
      'здравств',
      'добрый',
      'доброе',
      'хай',
      'hello',
      'hi',
      'салют',
      'приветик',
    ]) &&
    normalized.length < 50
  ) {
    const greeting = getTimeGreeting();
    const hint = getPageHint(context.pathname);
    const suffix = hint?.welcomeSuffix
      ? `\n\n${hint.welcomeSuffix}`
      : '\n\nСпросите про заявку, разделы сайта или выберите быстрое действие ниже.';
    return patchConversation({
      intent: 'greeting',
      reply: `${greeting} Я Копи — ваш помощник по «Копилке».${suffix}`,
    });
  }

  const smalltalkReply = detectSmalltalk(normalized);
  if (smalltalkReply) {
    return patchConversation({ intent: 'smalltalk', reply: smalltalkReply });
  }

  if (includesAny(normalized, ['спасибо', 'благодар', 'thanks', 'thx'])) {
    return patchConversation({
      intent: 'thanks',
      reply: 'Всегда рад помочь! Если появятся ещё вопросы — пишите.',
    });
  }

  const vagueHelp = detectVagueHelp(safeQuery, context);
  if (vagueHelp) return patchConversation(vagueHelp);

  const telegramResult = detectTelegramIntent(safeQuery);
  if (telegramResult) return patchConversation(telegramResult);

  if (detectTourIntent(normalized)) {
    return patchConversation({
      intent: 'start_tour',
      reply: 'Отлично! Сейчас проведу вас по основным разделам — просто следуйте подсказкам.',
    });
  }

  const authResult = detectAuthIntent(normalized, context.isGuest);
  if (authResult) return patchConversation(authResult);

  if (detectApplicationGuideIntent(normalized)) {
    return patchConversation({
      intent: 'application_guide',
      reply: context.isGuest
        ? 'Вот пошаговая инструкция — сначала нужен аккаунт, затем заполните форму. Когда будете готовы — напишите «да», перенесу к заявке.'
        : 'Вы уже вошли — вот шаги до отправки заявки. Когда будете готовы — напишите «да», открою раздел заявки.',
      openMenu: 'application',
    });
  }

  const contextualKnowledge = detectContextualKnowledge(safeQuery, context);
  if (contextualKnowledge) return patchConversation(contextualKnowledge);

  const routeIntent = detectRouteIntent(normalized);
  if (routeIntent) {
    return patchConversation({
      intent: 'navigate',
      reply: `Сейчас перенесу вас в раздел «${routeIntent.label}».`,
      navigateTo: routeIntent.route,
      navigateLabel: routeIntent.label,
    });
  }

  if (
    includesAny(normalized, ['частые вопрос', 'список вопрос', 'все вопрос', 'faq'])
  ) {
    return patchConversation({
      intent: 'open_faq',
      reply: 'Вот частые вопросы — выберите подходящий или воспользуйтесь поиском:',
      openMenu: 'faq',
    });
  }

  if (
    includesAny(normalized, [
      'куда перейти',
      'разделы сайта',
      'навигац',
      'что есть на сайте',
      'карта сайта',
    ])
  ) {
    return patchConversation({
      intent: 'open_navigation',
      reply: 'Выберите раздел — подскажу, зачем он нужен, и перенесу вас туда:',
      openMenu: 'navigation',
    });
  }

  const pageContext = detectPageContextAnswer(safeQuery, context);
  if (pageContext) return patchConversation(pageContext);

  const faqIndex = findBestFaqMatch(safeQuery);
  if (faqIndex !== null) {
    return patchConversation(buildFaqAnswerReply(faqIndex, context));
  }

  const softFaqIndex = findSoftFaqMatch(safeQuery);
  if (softFaqIndex !== null) {
    const item = FAQ_ITEMS[softFaqIndex];
    return patchConversation({
      intent: 'faq_answer',
      reply: item
        ? `Похоже, вас интересует «${item.question}»:\n\n${item.answer}`
        : UNKNOWN_REPLY,
      faqIndex: softFaqIndex,
      relatedFaqIndices: getRelatedFaqIndices(softFaqIndex),
      openMenu: 'faq-answer',
      conversationPatch: { lastFaqIndex: softFaqIndex, lastIntent: 'faq_answer' },
    });
  }

  return patchConversation(getSmartFallback(safeQuery, context));
}

export function getContextualWelcome(pathname: string, isGuest: boolean): string {
  const greeting = getTimeGreeting();
  const base = isGuest ? KOPI_WELCOME : KOPI_WELCOME_AUTH;
  const hint = getPageHint(pathname);

  const personalizedBase = base.replace(/^Привет!/, greeting);

  if (!hint?.welcomeSuffix) return personalizedBase;
  return `${personalizedBase}\n\n${hint.welcomeSuffix}`;
}

export function getContextualActions(
  pathname: string,
  isGuest: boolean,
  hasCompletedTour: boolean,
): KopiQuickAction[] {
  const actions = KOPI_MAIN_ACTIONS.map((action) =>
    action.id === 'start-tour' && !isGuest && hasCompletedTour
      ? { ...action, label: 'Повторить экскурсию' }
      : action,
  );

  const hint = getPageHint(pathname);
  if (!hint) return actions;

  const priority = new Set(hint.priorityActionIds);
  const prioritized = actions.filter((a) => priority.has(a.id));
  const rest = actions.filter((a) => !priority.has(a.id));

  return [...prioritized, ...rest];
}

export function getFaqFallbackReply(query: string): string {
  return resolveKopiQuery(query, { pathname: '/', isGuest: true }).reply;
}

export function filterFaqByQuery(query: string): number[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return FAQ_ITEMS.map((_, i) => i);
  return searchFaqIndices(normalized);
}

export function getApplicationStepCount(isGuest: boolean): number {
  return isGuest ? KOPI_APPLICATION_STEPS.length : KOPI_APPLICATION_STEPS.length - 1;
}

export const KOPI_NAV_ICONS: Record<
  Route,
  'Home' | 'ClipboardList' | 'BookOpen' | 'Star' | 'Heart' | 'Trophy' | 'HandHeart' | 'User' | 'Megaphone' | 'Shield'
> = {
  '/': 'Home',
  '/applications': 'ClipboardList',
  '/stories': 'BookOpen',
  '/reviews': 'Star',
  '/good-deeds': 'Heart',
  '/heroes': 'Trophy',
  '/support': 'HandHeart',
  '/profile': 'User',
  '/advertising': 'Megaphone',
  '/terms': 'Shield',
  '/standards': 'Shield',
  '/friends': 'User',
};

export const KOPI_ACTION_ICONS: Record<
  KopiQuickAction['id'],
  'Compass' | 'ClipboardList' | 'Map' | 'HelpCircle' | 'ArrowRight'
> = {
  'start-tour': 'Compass',
  application: 'ClipboardList',
  navigation: 'Map',
  faq: 'HelpCircle',
  'faq-answer': 'HelpCircle',
  'go-applications': 'ArrowRight',
  'go-faq-section': 'HelpCircle',
  main: 'HelpCircle',
};
