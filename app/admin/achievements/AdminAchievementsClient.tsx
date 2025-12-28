// app/admin/achievements/AdminAchievementsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Achievement } from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AchievementCard } from "@/components/achievements";
import GrantAchievementModal from "./components/GrantAchievementModal";
import RevokeAchievementModal from "./components/RevokeAchievementModal";
import { getRarityLabel } from "@/lib/achievements/rarity";

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
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

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

      <div className="relative z-10">
        {/* Заголовок */}
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#fffffe" }}>
                🏆 Управление достижениями
              </h1>
              <p className="text-base lg:text-lg" style={{ color: "#abd1c6" }}>
                Выдача достижений и управление системой
              </p>
            </div>
            
            {/* Навигация */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки
              </Link>
              <Link
                href="/admin/achievements"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
              >
                Достижения
              </Link>
              <Link
                href="/admin/ads"
                className="px-3 py-2 text-sm lg:px-4 lg:py-2 lg:text-base bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Реклама
              </Link>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#abd1c6]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.Star className="text-[#abd1c6]" size="sm" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-[#fffffe]">{achievements.length}</div>
                  <div className="text-xs lg:text-sm text-[#abd1c6]">Всего достижений</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.CheckCircle className="text-[#f9bc60]" size="sm" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => a.isActive).length}
                  </div>
                  <div className="text-xs lg:text-sm text-[#abd1c6]">Активных</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#e16162]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.XCircle className="text-[#e16162]" size="sm" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => !a.isActive).length}
                  </div>
                  <div className="text-xs lg:text-sm text-[#abd1c6]">Неактивных</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#f9bc60]/20 rounded-xl flex items-center justify-center">
                  <LucideIcons.Rocket className="text-[#f9bc60]" size="sm" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold text-[#fffffe]">
                    {achievements.filter(a => a.isExclusive).length}
                  </div>
                  <div className="text-xs lg:text-sm text-[#abd1c6]">Эксклюзивных</div>
                </div>
              </div>
            </div>
          </div>

          {/* Панель управления */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10 mb-8">
            <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-6">
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

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={() => setShowGrantModal(true)}
                className="px-4 py-2 lg:px-6 lg:py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-xl hover:bg-[#e8a545] transition-colors flex items-center gap-2 text-sm lg:text-base"
              >
                <LucideIcons.Award size="sm" />
                <span className="hidden sm:inline">Выдать достижение</span>
                <span className="sm:hidden">Выдать</span>
              </button>

              <button
                onClick={() => setShowRevokeModal(true)}
                className="px-4 py-2 lg:px-6 lg:py-2 bg-[#e16162]/90 text-white font-semibold rounded-xl hover:bg-[#e16162] transition-colors flex items-center gap-2 text-sm lg:text-base"
              >
                <LucideIcons.Trash2 size="sm" />
                <span className="hidden sm:inline">Забрать достижение</span>
                <span className="sm:hidden">Забрать</span>
              </button>

              <button
                onClick={loadAchievements}
                className="px-4 py-2 lg:px-6 lg:py-2 bg-white/10 text-[#fffffe] font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 text-sm lg:text-base"
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
                Попробуйте изменить фильтры поиска
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Модалка выдачи достижения */}
      {showGrantModal && (
        <GrantAchievementModal
          achievements={achievements}
          onClose={() => setShowGrantModal(false)}
          onSuccess={() => {
            setShowGrantModal(false);
            loadAchievements();
          }}
        />
      )}

      {showRevokeModal && (
        <RevokeAchievementModal
          achievements={achievements}
          onClose={() => setShowRevokeModal(false)}
          onSuccess={() => {
            setShowRevokeModal(false);
            loadAchievements();
          }}
        />
      )}
    </div>
  );
}
