"use client";

import Link from "next/link";

export function AdminHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
      <div>
        <h1
          className="text-3xl lg:text-4xl font-bold mb-2"
          style={{ color: "#fffffe" }}
        >
          🔧 Админ Панель
        </h1>
        <p className="text-base lg:text-lg" style={{ color: "#abd1c6" }}>
          Управление заявками и статистика платформы
        </p>
      </div>
      
      {/* Навигация */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin"
          className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
        >
          Заявки
        </Link>
        <Link
          href="/admin/achievements"
          className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
        >
          Достижения
        </Link>
        <Link
          href="/admin/ads"
          className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
        >
          Реклама
        </Link>
        <Link
          href="/admin/reports"
          className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
        >
          Жалобы
        </Link>
      </div>
    </div>
  );
}

