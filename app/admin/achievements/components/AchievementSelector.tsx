// app/admin/achievements/components/AchievementSelector.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Achievement } from "@/lib/achievements/types";
import { getRarityLabel } from "@/lib/achievements/rarity";
import { getTypeLabel } from "./utils";

interface AchievementSelectorProps {
  achievements: Achievement[];
  selectedAchievementId: string;
  onSelect: (achievementId: string) => void;
  onClear: () => void;
}

export default function AchievementSelector({
  achievements,
  selectedAchievementId,
  onSelect,
  onClear,
}: AchievementSelectorProps) {
  const [achievementSearch, setAchievementSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.achievement-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фильтрация достижений
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.isActive && (
      achievement.name.toLowerCase().includes(achievementSearch.toLowerCase()) ||
      achievement.description.toLowerCase().includes(achievementSearch.toLowerCase())
    );
    
    const matchesRarity = rarityFilter === "ALL" || achievement.rarity === rarityFilter;
    const matchesType = typeFilter === "ALL" || achievement.type === typeFilter;
    
    return matchesSearch && matchesRarity && matchesType;
  });

  const selectedAchievement = achievements.find(a => a.id === selectedAchievementId);

  const handleSelect = (achievementId: string) => {
    onSelect(achievementId);
    setAchievementSearch("");
    setShowDropdown(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        🏆 Выберите достижение
      </label>
      
      {/* Быстрые фильтры для достижений */}
      <div className="flex gap-2 mb-3">
        <select
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
        >
          <option value="ALL">Все редкости</option>
          <option value="COMMON">Обычные</option>
          <option value="RARE">Редкие</option>
          <option value="EPIC">Эпические</option>
          <option value="LEGENDARY">Легендарные</option>
          <option value="EXCLUSIVE">Эксклюзивные</option>
        </select>
        
        <select
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
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
      </div>
      
      <div className="relative achievement-dropdown-container">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white pr-10"
            placeholder="🔍 Поиск достижения по названию или описанию..."
            value={achievementSearch}
            onChange={(e) => {
              setAchievementSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LucideIcons.Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-10 max-h-96 overflow-y-auto">
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200"
                  onClick={() => handleSelect(achievement.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <LucideIcons.Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                          {getRarityLabel(achievement.rarity)}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                          {getTypeLabel(achievement.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <LucideIcons.Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Достижения не найдены</p>
                <p className="text-xs mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedAchievement && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <LucideIcons.Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedAchievement.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {selectedAchievement.description}
              </p>
              <div className="flex gap-2">
                <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                  {getRarityLabel(selectedAchievement.rarity)}
                </span>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  {getTypeLabel(selectedAchievement.type)}
                </span>
              </div>
            </div>
            <button
              onClick={onClear}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <LucideIcons.X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}


