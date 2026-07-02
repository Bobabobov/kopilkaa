'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminDashboardCounts } from '@/lib/admin/dashboardStats';
import {
  ADMIN_NAV_GROUPS,
  isAdminNavItemActive,
  type AdminNavItem,
} from '../_lib/nav';

function NavBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto min-w-[1.25rem] rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function NavLink({
  item,
  counts,
  pathname,
  onNavigate,
}: {
  item: AdminNavItem;
  counts: AdminDashboardCounts | null;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = isAdminNavItemActive(pathname, item);
  const badgeCount =
    item.badgeKey && counts ? counts[item.badgeKey] : 0;

  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-[#f9bc60] text-[#001e1d]'
          : 'text-[#abd1c6] hover:bg-[#004643]/60 hover:text-[#fffffe]',
      )}
    >
      <span className="truncate">{item.label}</span>
      <NavBadge count={badgeCount} />
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<AdminDashboardCounts | null>(null);

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data?.dashboard) {
        setCounts(json.data.dashboard);
      }
    } catch {
      // тихо — бейджи необязательны
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    loadCounts().catch(console.error);
  }, [loadCounts, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const isDashboard = pathname === '/admin';

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#abd1c6]/10 px-4 py-4">
        <Link
          href="/admin"
          className="text-base font-bold text-[#fffffe] hover:text-[#f9bc60] transition-colors"
        >
          Админ
        </Link>
        <p className="mt-0.5 text-xs text-[#abd1c6]/70">Kopilka</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <Link
          href="/admin"
          prefetch={false}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isDashboard
              ? 'bg-[#f9bc60] text-[#001e1d]'
              : 'text-[#abd1c6] hover:bg-[#004643]/60 hover:text-[#fffffe]',
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          Обзор
        </Link>

        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#abd1c6]/50">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  counts={counts}
                  pathname={pathname}
                  onNavigate={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#abd1c6]/10 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#abd1c6] hover:bg-[#004643]/60 hover:text-[#fffffe] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          На сайт
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#abd1c6] hover:bg-[#004643]/60 hover:text-[#fffffe] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#001e1d] text-[#fffffe] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-56 xl:w-60 shrink-0 border-r border-[#abd1c6]/10 bg-[#001e1d] fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Закрыть меню"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-[#abd1c6]/10 bg-[#001e1d] transition-transform lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-56 xl:pl-60">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b border-[#abd1c6]/10 bg-[#001e1d]/95 px-4 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#abd1c6] hover:bg-[#004643]/60"
            aria-label={sidebarOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-semibold text-[#fffffe] truncate">
            {isDashboard ? 'Обзор' : 'Админ'}
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
