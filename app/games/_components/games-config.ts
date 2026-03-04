/**
 * Конфигурация игр для страницы /games.
 * Каждая игра может иметь leaderboardApi — тогда на странице показывается топ.
 * hiddenFromList: true — игра не показывается в списке на /games, доступна только по прямой ссылке.
 */
export interface GameConfig {
  title: string;
  description: string;
  href: string;
  badge: string;
  image: string;
  /** Ключ для запроса топа, например "coin-catch" → GET /api/games/coin-catch/leaderboard */
  leaderboardApi?: string;
  /** Не показывать на странице /games (доступ только по ссылке, например /games/coin-catch) */
  hiddenFromList?: boolean;
}

export const GAMES_LIST: GameConfig[] = [
  {
    title: "Монетка",
    description: "Собирай монеты за 30 секунд. 3 жизни. Попади в топ недели.",
    href: "/games/coin-catch",
    badge: "Топ недели",
    image: "/coin/co/1.png",
    leaderboardApi: "coin-catch",
    hiddenFromList: true,
  },
];

export const COMING_SOON = [
  { title: "Скоро", description: "Новая игра в разработке." },
  { title: "Скоро", description: "Ещё одна игра готовится." },
] as const;

/** Игры в разработке: для блока «Лидеры недели» показываем заглушки с тем же оформлением */
export const UPCOMING_LEADERBOARD_GAMES: Pick<GameConfig, "title">[] = [
  { title: "Игра 2" },
  { title: "Игра 3" },
];
