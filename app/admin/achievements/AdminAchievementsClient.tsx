// app/admin/achievements/AdminAchievementsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Achievement } from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { AchievementCard } from "@/components/achievements";

export default function AdminAchievementsClient() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Модалки
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/achievements");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAchievements(data.data || []);
      } else {
        setError(data.error || "Ошибка загрузки достижений");
      }
    } catch (err) {
      console.error("Failed to load achievements:", err);
      setError("Ошибка загрузки достижений");
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeAchievements = async () => {
    try {
      const response = await fetch("/api/admin/achievements/init", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert(`Успешно! ${data.message}`);
        setShowInitModal(false);
        loadAchievements();
      } else {
        alert(data.error || "Ошибка инициализации");
      }
    } catch (err) {
      console.error("Failed to initialize achievements:", err);
      alert("Ошибка инициализации достижений");
    }
  };

  // Фильтрация достижений
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRarity = rarityFilter === "ALL" || achievement.rarity === rarityFilter;
    const matchesType = typeFilter === "ALL" || achievement.type === typeFilter;
    const matchesActive = activeFilter === "ALL" || 
                         (activeFilter === "ACTIVE" && achievement.isActive) ||
                         (activeFilter === "INACTIVE" && !achievement.isActive);

    return matchesSearch && matchesRarity && matchesType && matchesActive;
  });

  return (
    <div className="min-h-screen">
      <UniversalBackground />

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: "#fffffe" }}>
                🏆 Управление достижениями
              </h1>
              <p className="text-lg" style={{ color: "#abd1c6" }}>
                Создание и управление системой достижений
              </p>
            </div>
            
            {/* Навигация */}
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки
              </Link>
              <Link
                href="/admin/achievements"
                className="px-4 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
              >
                Достижения
              </Link>
              <Link
                href="/admin/ads"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Реклама
              </Link>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#abd1c6]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.Star className="text-[#abd1c6]" size="sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#fffffe]">{achievements.length}</div>
                  <div className="text-sm text-[#abd1c6]">Всего достижений</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.CheckCircle className="text-[#f9bc60]" size="sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => a.isActive).length}
                  </div>
                  <div className="text-sm text-[#abd1c6]">Активных</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e16162]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.XCircle className="text-[#e16162]" size="sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => !a.isActive).length}
                  </div>
                  <div className="text-sm text-[#abd1c6]">Неактивных</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.Rocket className="text-[#f9bc60]" size="sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => a.isExclusive).length}
                  </div>
                  <div className="text-sm text-[#abd1c6]">Эксклюзивных</div>
                </div>
              </div>
            </div>
          </div>

          {/* Панель управления */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Поиск по названию или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-xl text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none"
                />
              </div>

              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="px-4 py-2 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-xl text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
              >
                <option value="ALL">Все редкости</option>
                <option value="COMMON">Обычные</option>
                <option value="RARE">Редкие</option>
                <option value="EPIC">Эпические</option>
                <option value="LEGENDARY">Легендарные</option>
                <option value="EXCLUSIVE">Эксклюзивные</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-xl text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
              >
                <option value="ALL">Все типы</option>
                <option value="STREAK">Серии</option>
                <option value="APPLICATIONS">Заявки</option>
                <option value="GAMES">Игры</option>
                <option value="SOCIAL">Социальные</option>
                <option value="SPECIAL">Особые</option>
                <option value="COMMUNITY">Сообщество</option>
                <option value="CREATIVITY">Творчество</option>
              </select>

              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-2 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-xl text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
              >
                <option value="ALL">Все статусы</option>
                <option value="ACTIVE">Активные</option>
                <option value="INACTIVE">Неактивные</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-xl hover:bg-[#e8a545] transition-colors flex items-center gap-2"
              >
                <LucideIcons.Plus size="sm" />
                Создать достижение
              </button>

              <button
                onClick={() => setShowInitModal(true)}
                className="px-6 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-xl hover:bg-[#abd1c6]/90 transition-colors flex items-center gap-2"
              >
                <LucideIcons.Rocket size="sm" />
                Инициализировать
              </button>

              <button
                onClick={loadAchievements}
                className="px-6 py-2 bg-white/10 text-[#fffffe] font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <LucideIcons.Refresh size="sm" />
                Обновить
              </button>
            </div>
          </div>

          {/* Список достижений */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#abd1c6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#abd1c6]">Загрузка достижений...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#e16162]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.AlertCircle className="text-[#e16162]" size="lg" />
              </div>
              <p className="text-[#e16162] mb-4">{error}</p>
              <button
                onClick={loadAchievements}
                className="px-6 py-2 bg-[#e16162] text-white rounded-xl hover:bg-[#e16162]/90 transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  className="cursor-default"
                />
              ))}
            </div>
          )}

          {filteredAchievements.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#abd1c6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideIcons.Star className="text-[#abd1c6]" size="lg" />
              </div>
              <p className="text-[#abd1c6] text-lg mb-2">Достижения не найдены</p>
              <p className="text-[#94a1b2] text-sm mb-6">
                Попробуйте изменить фильтры или создать новые достижения
              </p>
              <button
                onClick={() => setShowInitModal(true)}
                className="px-6 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-xl hover:bg-[#e8a545] transition-colors"
              >
                Инициализировать базовые достижения
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Модалка инициализации */}
      {showInitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="text-[#f9bc60] text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Инициализировать достижения
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Создать базовые достижения системы? Это добавит 25+ готовых достижений.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowInitModal(false)}
                  className="px-6 py-3 bg-white/90 backdrop-blur-xl hover:bg-gray-50 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  style={{
                    borderColor: "#abd1c6/30",
                    color: "#2d5a4e",
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleInitializeAchievements}
                  className="px-6 py-3 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
                  }}
                >
                  Инициализировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
