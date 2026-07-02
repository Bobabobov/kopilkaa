/** Маршруты с полноэкранным UI без шапки, футера и фона сайта. */
export function isFullscreenGameRoute(pathname: string): boolean {
  if (pathname === '/profile/levels') {
    return true;
  }
  if (pathname === '/vyzhivanie' || pathname.startsWith('/vyzhivanie/')) {
    return true;
  }
  if (pathname === '/games' || pathname.startsWith('/games/')) {
    return true;
  }
  return false;
}
