import type { Route } from 'next';
import type { ComponentType } from 'react';
import { LucideIcons } from '@/components/ui/LucideIcons';

export interface MobileBottomNavItem {
  href: Route;
  label: string;
  shortLabel?: string;
  Icon: ComponentType<{ className?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' }>;
  /** Акцентная кнопка (поддержка копилки) */
  accent?: boolean;
  isActive: (pathname: string) => boolean;
}

export const MOBILE_BOTTOM_NAV_ITEMS: MobileBottomNavItem[] = [
  {
    href: '/',
    label: 'Главная',
    Icon: LucideIcons.Home,
    isActive: (pathname) => pathname === '/',
  },
  {
    href: '/stories',
    label: 'Истории',
    Icon: LucideIcons.BookOpen,
    isActive: (pathname) =>
      pathname === '/stories' || pathname.startsWith('/stories/'),
  },
  {
    href: '/applications',
    label: 'Заявка',
    shortLabel: 'Заявка',
    Icon: LucideIcons.ClipboardList,
    isActive: (pathname) =>
      pathname === '/applications' || pathname.startsWith('/applications/'),
  },
  {
    href: '/support',
    label: 'Поддержать',
    shortLabel: 'Герой',
    Icon: LucideIcons.Heart,
    accent: true,
    isActive: (pathname) =>
      pathname === '/support' || pathname.startsWith('/support/'),
  },
];

export function shouldShowMobileBottomNav(pathname: string): boolean {
  if (pathname === '/banned') return false;
  if (pathname.startsWith('/admin')) return false;
  return true;
}
