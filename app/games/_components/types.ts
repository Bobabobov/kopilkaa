/** Запись в таблице лидеров (ответ API топа игры) */
export interface LeaderboardEntry {
  displayName: string;
  score: number;
  rank: number;
  userId?: string;
  avatarUrl?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}
