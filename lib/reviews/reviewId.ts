/**
 * Допустимый формат id в URL (отзыв, пользователь и др. — CUID и совместимые).
 */
export function isValidCuidLikeId(id: string): boolean {
  return id.length > 0 && id.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(id);
}
