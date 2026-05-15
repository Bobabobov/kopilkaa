'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  MOBILE_BOTTOM_NAV_ITEMS,
  shouldShowMobileBottomNav,
} from '@/lib/navigation/mobileBottomNav';

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (!shouldShowMobileBottomNav(pathname)) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 min-[1200px]:hidden pointer-events-none"
      aria-label="Основная навигация"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="pointer-events-auto border-t border-[#abd1c6]/25 bg-[#001e1d]/92 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f9bc60]/55 to-transparent"
        />

        <ul className="mx-auto flex h-[var(--bottom-nav-height)] max-w-lg items-stretch justify-around gap-0.5 px-1.5 sm:max-w-xl sm:px-2">
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const { Icon } = item;

            return (
              <li key={item.href} className="flex min-w-0 flex-1">
                <Link
                  href={item.href}
                  prefetch
                  className={cn(
                    'group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]',
                    active && !item.accent && 'text-[#001e1d]',
                    !active && !item.accent && 'text-[#fffffe]/90',
                    item.accent && !active && 'text-[#f9bc60]',
                    item.accent && active && 'text-[#001e1d]',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-bottom-nav-active"
                      className={cn(
                        'absolute inset-1 rounded-xl',
                        item.accent
                          ? 'bg-gradient-to-br from-[#f9bc60] to-[#e8a545] shadow-lg shadow-[#f9bc60]/25'
                          : 'bg-[#f9bc60] shadow-md shadow-[#f9bc60]/20',
                      )}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  {!active && item.accent && (
                    <span
                      aria-hidden
                      className="absolute inset-1 rounded-xl border border-[#f9bc60]/35 bg-gradient-to-br from-[#f9bc60]/14 to-transparent"
                    />
                  )}

                  <span className="relative z-10 flex flex-col items-center gap-0.5">
                    <motion.span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-200',
                        !active && 'group-active:scale-90',
                      )}
                      whileTap={{ scale: 0.88 }}
                    >
                      <Icon
                        size="sm"
                        className={cn(
                          'transition-colors duration-200',
                          active && !item.accent && 'text-[#001e1d]',
                          active && item.accent && 'text-[#001e1d]',
                          !active && item.accent && 'text-[#f9bc60]',
                          !active && !item.accent && 'text-[#abd1c6]',
                        )}
                      />
                    </motion.span>
                    <span
                      className={cn(
                        'max-w-full truncate text-[10px] font-semibold leading-tight sm:text-[11px]',
                        active ? 'text-[#001e1d]' : 'text-[#abd1c6]',
                        item.accent && !active && 'text-[#f9bc60]',
                      )}
                    >
                      <span className="sm:hidden">
                        {item.shortLabel ?? item.label}
                      </span>
                      <span className="hidden sm:inline">{item.label}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </nav>
  );
}
