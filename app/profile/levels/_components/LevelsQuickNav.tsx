'use client';

import { motion } from 'framer-motion';

const LINKS = [
  { href: '#levels-dashboard', label: 'Прогресс' },
  { href: '#levels-path', label: 'Путь' },
  { href: '#levels-earn', label: 'Бонусы' },
  { href: '#levels-charts', label: 'Графики' },
  { href: '#levels-catalog', label: 'Вехи' },
  { href: '#levels-faq', label: 'FAQ' },
] as const;

export function LevelsQuickNav() {
  return (
    <motion.nav
      aria-label="Разделы страницы"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="sticky top-0 z-20 -mx-4 border-b border-white/[0.06] bg-[#001e1d]/80 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-[#abd1c6] transition-colors hover:border-[#f9bc60]/25 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
