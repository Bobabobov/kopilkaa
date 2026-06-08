export function shouldShowKopi(pathname: string): boolean {
  if (pathname === '/banned') return false;
  if (pathname.startsWith('/admin')) return false;
  return true;
}
