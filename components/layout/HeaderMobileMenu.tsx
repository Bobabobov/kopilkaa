// components/layout/HeaderMobileMenu.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderNavigation from "./HeaderNavigation";
import NavAuth from "@/app/_parts/NavAuth";

export default function HeaderMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Закрываем мобильное меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Кнопка мобильного меню - показываем когда навигация скрыта */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-3 rounded-xl transition-all duration-200 drop-shadow-md"
        style={{ color: '#fffffe' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t backdrop-blur-sm"
            style={{ backgroundColor: '#004643', borderColor: '#abd1c6' }}
          >
            <div className="container-p py-4 space-y-2">
              {/* Навигационные ссылки */}
              <div className="space-y-1">
                <HeaderNavigation 
                  className="flex-col space-y-1" 
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
              </div>

              {/* Авторизация для мобильных */}
              <div className="pt-2 border-t border-white/20 dark:border-white/10">
                <div className="px-4">
                  <NavAuth />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
