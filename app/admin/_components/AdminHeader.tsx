"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function AdminHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Заявки" },
    { href: "/admin/users", label: "Пользователи" },
    { href: "/admin/heroes", label: "Герои" },
    { href: "/admin/balance", label: "Баланс" },
    { href: "/admin/ads", label: "Реклама" },
    { href: "/admin/news", label: "Новости" },
    { href: "/admin/reports", label: "Жалобы" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-[#fffffe]">
          🔧 Админ Панель
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#abd1c6]">
          Управление заявками и статистика платформы
        </p>
      </div>

      {/* Навигация */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-bold rounded-lg sm:rounded-xl transition-all duration-300 ${
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
    </motion.div>
  );
}
