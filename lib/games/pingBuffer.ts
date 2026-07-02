/** Допуск на задержку сети при проверке таймаута ответа (мс). */
export const GAME_PING_BUFFER_MS = 500;

export function isGameReactionTimedOut(
  reactionMs: number,
  timeLimitMs: number,
): boolean {
  return reactionMs > timeLimitMs + GAME_PING_BUFFER_MS;
}
