/** Маршруты, где игра занимает весь экран без шапки и футера сайта. */
export function isFullscreenGameRoute(pathname: string): boolean {
  return pathname === '/vyzhivanie' || pathname.startsWith('/vyzhivanie/');
}
