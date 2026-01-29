// Типы для игры "Монеткосбор 90-х"

export interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  isPlaying: boolean;
  isGameOver: boolean;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  /** Время появления (timestamp), для срока жизни */
  spawnedAt: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  username?: string | null;
  name?: string | null;
}

export interface LeaderboardEntry {
  displayName: string;
  score: number;
  rank: number;
  /** ID пользователя для ссылки на профиль */
  userId?: string;
  /** URL аватарки (или null) */
  avatarUrl?: string | null;
  /** Ссылки на соцсети */
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

export interface GameConfig {
  designWidth: number;
  designHeight: number;
  gameDuration: number; // секунды
  maxLives: number;
  coinSpawnInterval: number; // миллисекунды
  coinLifetimeMs: number; // срок жизни монеты (исчезнет, если не собрать)
  coinRadius: number;
  coinRadiusMobile: number; // увеличенный для мобильных
}

export const GAME_CONFIG: GameConfig = {
  designWidth: 1280,
  designHeight: 720,
  gameDuration: 30,
  maxLives: 3,
  coinSpawnInterval: 800, // мс между появлением монет
  coinLifetimeMs: 4500, // монета исчезает через 4.5 с, если не собрана
  coinRadius: 30,
  coinRadiusMobile: 45,
};
