"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Заявки" },
    { href: "/admin/users", label: "Пользователи" },
    { href: "/admin/good-deeds", label: "Добрые дела" },
    { href: "/admin/good-deeds/withdrawals", label: "Вывод бонусов" },
    { href: "/admin/heroes", label: "Герои" },
    { href: "/admin/balance", label: "Баланс" },
    { href: "/admin/ads", label: "Реклама" },
    { href: "/admin/news", label: "Новости" },
    { href: "/admin/reports", label: "Жалобы" },
  ];

  // Закрывать меню при смене роута и по Escape
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (isActive: boolean) =>
    `block w-full text-left px-4 py-3 sm:py-2 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] flex items-center ${
      isActive
        ? "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/30"
        : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:text-[#fffffe] border border-[#abd1c6]/20"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6"
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2 text-[#fffffe] truncate">
            🔧 Админ Панель
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-[#abd1c6]">
            Закрытый раздел: управление заявками, модерацией и метриками
          </p>
        </div>
        {/* Кнопка бургер только на мобильных */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-12 h-12 rounded-xl bg-[#001e1d]/60 border border-[#abd1c6]/20 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:text-[#fffffe] transition-colors touch-manipulation"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          <span className={`w-5 h-0.5 bg-current rounded transition-transform ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-0.5 bg-current rounded my-1 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-current rounded transition-transform ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>
      </div>

      {/* Десктоп: навигация в ряд */}
      <div className="hidden sm:flex flex-wrap gap-2 sm:gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm md:text-base font-bold rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] flex items-center ${
                isActive
                  ? "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/30"
                  : "bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:text-[#fffffe] border border-[#abd1c6]/20"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Мобильное меню (drawer): под шапкой и рекламой */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 bottom-0 z-[100] bg-black/50 sm:hidden"
              style={{ top: "var(--header-offset, 56px)" }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 bottom-0 z-[110] w-full max-w-[280px] sm:hidden bg-[#001e1d] border-l border-[#abd1c6]/20 shadow-2xl overflow-y-auto"
              style={{ top: "var(--header-offset, 56px)" }}
              aria-label="Навигация по разделам"
            >
              <div className="p-4 pt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#abd1c6] text-sm font-bold">Разделы</span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-[#abd1c6] hover:bg-[#004643] hover:text-[#fffffe] transition-colors"
                    aria-label="Закрыть"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      className={linkClass(isActive)}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
