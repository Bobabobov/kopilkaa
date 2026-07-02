/** Маршруты админ-панели — отдельный shell без публичной шапки. */
export function isAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}
