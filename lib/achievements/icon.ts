/** Кастомная картинка ачивки (public/ или URL) вместо ключа LucideIcons. */
export function isAchievementImageIcon(icon: string): boolean {
  return icon.startsWith("/") || icon.startsWith("http://") || icon.startsWith("https://");
}
