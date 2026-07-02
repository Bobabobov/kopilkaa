import {
  Brain,
  Calculator,
  Grid3x3,
  Palette,
  Scale,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface GameCatalogItem {
  id: string;
  title: string;
  description: string;
  href: string;
  costLabel: string;
  costMin: number;
  difficulty: GameDifficulty;
  tag: string;
  icon: LucideIcon;
  accent: {
    border: string;
    bg: string;
    iconBg: string;
    iconText: string;
  };
  rewardHint: string;
}

/** Количество плашек-заглушек «В разработке» в каталоге лобби. */
export const GAMES_UPCOMING_PLACEHOLDER_COUNT = 1;

export const GAME_DIFFICULTY_LABELS: Record<GameDifficulty, string> = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
};

export const GAMES_CATALOG: GameCatalogItem[] = [
  {
    id: 'generator',
    title: 'Генератор бонусов',
    description:
      'Запустите интерактивный генератор и умножьте баллы активности. Исход зависит от распределения наград.',
    href: '/games/generator',
    costLabel: '15 бонусов',
    costMin: 15,
    difficulty: 'easy',
    tag: 'Удача',
    icon: Sparkles,
    accent: {
      border: 'border-[#f9bc60]/35 group-hover:border-[#f9bc60]/60',
      bg: 'from-[#f9bc60]/12 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-[#f9bc60]/20 border-[#f9bc60]/35',
      iconText: 'text-[#f9bc60]',
    },
    rewardHint: 'До ×5 от ставки',
  },
  {
    id: 'math',
    title: 'Математический спринт',
    description:
      'Ровно 2 секунды на решение случайного примера. Включите мозг на максимум и приумножьте бонусы.',
    href: '/games/math',
    costLabel: '15 бонусов',
    costMin: 15,
    difficulty: 'hard',
    tag: 'Скорость',
    icon: Calculator,
    accent: {
      border: 'border-[#6ee7d8]/30 group-hover:border-[#6ee7d8]/55',
      bg: 'from-[#6ee7d8]/10 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-[#6ee7d8]/15 border-[#6ee7d8]/30',
      iconText: 'text-[#6ee7d8]',
    },
    rewardHint: 'Бонус за серию верных ответов',
  },
  {
    id: 'color',
    title: 'Цветовой конфликт',
    description:
      'Определите цвет текста, игнорируя написанное слово. Проверка внимания и реакции за пару секунд.',
    href: '/games/color',
    costLabel: 'от 5 до 30',
    costMin: 5,
    difficulty: 'hard',
    tag: 'Внимание',
    icon: Palette,
    accent: {
      border: 'border-[#f472b6]/30 group-hover:border-[#f472b6]/55',
      bg: 'from-[#f472b6]/10 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-[#f472b6]/15 border-[#f472b6]/30',
      iconText: 'text-[#f472b6]',
    },
    rewardHint: 'Ставка растёт с уровнем сложности',
  },
  {
    id: 'quick-balance',
    title: 'Быстрый баланс',
    description:
      'Сравните два примера: меньше, равно или больше. 1.8 секунды на раунд — 3 верных подряд приносят 45 бонусов. На финале ждёт ловушка с приоритетом действий.',
    href: '/games/quick-balance',
    costLabel: '15 бонусов',
    costMin: 15,
    difficulty: 'hard',
    tag: 'Сравнение',
    icon: Scale,
    accent: {
      border: 'border-fuchsia-400/30 group-hover:border-fuchsia-400/55',
      bg: 'from-fuchsia-400/10 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-fuchsia-400/15 border-fuchsia-400/30',
      iconText: 'text-fuchsia-400',
    },
    rewardHint: '+45 бонусов за серию из 3',
  },
  {
    id: 'odd-number',
    title: 'Лишнее число',
    description:
      'Таблица Шульте 4×4: кликайте числа строго по порядку от 1 до 16. Всего 10 секунд на всю сетку — тренировка концентрации и периферийного зрения.',
    href: '/games/odd-number',
    costLabel: '15 бонусов',
    costMin: 15,
    difficulty: 'hard',
    tag: 'Концентрация',
    icon: Grid3x3,
    accent: {
      border: 'border-sky-400/30 group-hover:border-sky-400/55',
      bg: 'from-sky-400/10 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-sky-400/15 border-sky-400/30',
      iconText: 'text-sky-400',
    },
    rewardHint: '+25 бонусов за прохождение за 8 с',
  },
  {
    id: 'sequence',
    title: 'Секретная последовательность',
    description:
      'Simon Says на сетке 3×3: запоминайте неоновые вспышки и повторяйте цепочку. Каждый верный раунд добавляет шаг.',
    href: '/games/sequence',
    costLabel: '15 бонусов',
    costMin: 15,
    difficulty: 'hard',
    tag: 'Память',
    icon: Brain,
    accent: {
      border: 'border-emerald-400/30 group-hover:border-emerald-400/55',
      bg: 'from-emerald-400/10 via-[#004643]/55 to-[#001e1d]/40',
      iconBg: 'bg-emerald-400/15 border-emerald-400/30',
      iconText: 'text-emerald-400',
    },
    rewardHint: 'До 50+ бонусов за чекпоинты',
  },
];

export const GAMES_FAQ = [
  {
    id: 'free',
    question: 'Участие платное?',
    answer:
      'Нет. Участие в разделе игр бесплатное — регистрация и доступ к модулям не требуют оплаты.',
  },
  {
    id: 'real-money',
    question: 'Можно ли играть на реальные деньги?',
    answer:
      'Нет. Игры не предполагают ставок в рублях или другой валюте — только внутренние бонусы активности платформы.',
  },
  {
    id: 'buy-bonuses',
    question: 'Можно ли купить бонусы?',
    answer:
      'Нет. Бонусы нельзя приобрести за деньги. Они начисляются только за активность на платформе: добрые дела, ежедневные задания и другие действия.',
  },
  {
    id: 'cost',
    question: 'Откуда берутся бонусы для игр?',
    answer:
      'Бонусы начисляются за добрые дела, ежедневную активность и другие действия на платформе. Дополнительно их можно выиграть в играх этого раздела — при удачном результате награда возвращается на баланс. Текущий баланс отображается вверху страницы.',
  },
  {
    id: 'timing',
    question: 'Как считается время ответа?',
    answer:
      'Время фиксируется на сервере в момент отправки ответа. Для честной игры нужно стабильное интернет-соединение.',
  },
  {
    id: 'loss',
    question: 'Можно ли проиграть ставку?',
    answer:
      'Да. Стоимость запуска списывается сразу. Награда зависит от результата — в некоторых играх ошибка означает потерю ставки.',
  },
] as const;
