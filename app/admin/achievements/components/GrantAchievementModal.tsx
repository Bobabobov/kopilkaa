"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Achievement } from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getRarityLabel } from "@/lib/achievements/rarity";

// Функция для получения русского названия типа достижения
const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'STREAK':
      return 'Серии';
    case 'APPLICATIONS':
      return 'Заявки';
    case 'GAMES':
      return 'Игры';
    case 'SOCIAL':
      return 'Социальные';
    case 'SPECIAL':
      return 'Особые';
    case 'COMMUNITY':
      return 'Сообщество';
    case 'CREATIVITY':
      return 'Творчество';
    default:
      return type;
  }
};

interface GrantAchievementModalProps {
  achievements: Achievement[];
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
}

export default function GrantAchievementModal({
  achievements,
  onClose,
  onSuccess,
}: GrantAchievementModalProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Поиск и фильтрация
  const [achievementSearch, setAchievementSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showAchievementDropdown, setShowAchievementDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [achievementRarityFilter, setAchievementRarityFilter] = useState<string>("ALL");
  const [achievementTypeFilter, setAchievementTypeFilter] = useState<string>("ALL");

  // Загружаем пользователей при открытии модалки
  useEffect(() => {
    loadUsers();
  }, []);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowAchievementDropdown(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleGrantAchievement = async () => {
    if (!selectedAchievement || !selectedUser) {
      setError("Выберите достижение и пользователя");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Granting achievement:', {
        achievementId: selectedAchievement,
        userId: selectedUser,
        achievement: selectedAchievementData,
        user: selectedUserData
      });

      const response = await fetch("/api/admin/achievements/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: selectedAchievement,
          userId: selectedUser,
        }),
      });

      const data = await response.json();
      console.log('Grant achievement response:', data);
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.error || "Ошибка выдачи достижения");
      }
    } catch (err) {
      console.error("Failed to grant achievement:", err);
      setError("Ошибка выдачи достижения");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация достижений
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.isActive && (
      achievement.name.toLowerCase().includes(achievementSearch.toLowerCase()) ||
      achievement.description.toLowerCase().includes(achievementSearch.toLowerCase())
    );
    
    const matchesRarity = achievementRarityFilter === "ALL" || achievement.rarity === achievementRarityFilter;
    const matchesType = achievementTypeFilter === "ALL" || achievement.type === achievementTypeFilter;
    
    return matchesSearch && matchesRarity && matchesType;
  });

  // Фильтрация пользователей с улучшенным поиском
  const filteredUsers = users.filter(user => {
    const searchTerm = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.email.split('@')[0].toLowerCase().includes(searchTerm) // поиск по части email
    );
  });

  const selectedAchievementData = achievements.find(a => a.id === selectedAchievement);
  const selectedUserData = users.find(u => u.id === selectedUser);

  // Обработчики выбора
  const handleAchievementSelect = (achievementId: string) => {
    setSelectedAchievement(achievementId);
    setAchievementSearch("");
    setShowAchievementDropdown(false);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setUserSearch("");
    setShowUserDropdown(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <LucideIcons.Award className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Выдать достижение пользователю
          </h2>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Достижение успешно выдано!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Пользователь получил достижение "{selectedAchievementData?.name}"
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <LucideIcons.Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredAchievements.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Найдено достижений
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <LucideIcons.Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredUsers.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Найдено пользователей
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Выбор достижения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                🏆 Выберите достижение
              </label>
              
              {/* Быстрые фильтры для достижений */}
              <div className="flex gap-2 mb-3">
                <select
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                  value={achievementRarityFilter}
                  onChange={(e) => setAchievementRarityFilter(e.target.value)}
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
                  value={achievementTypeFilter}
                  onChange={(e) => setAchievementTypeFilter(e.target.value)}
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
              
              <div className="relative dropdown-container">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white pr-10"
                    placeholder="🔍 Поиск достижения по названию или описанию..."
                    value={achievementSearch}
                    onChange={(e) => {
                      setAchievementSearch(e.target.value);
                      setShowAchievementDropdown(true);
                    }}
                    onFocus={() => setShowAchievementDropdown(true)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                {showAchievementDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-10 max-h-96 overflow-y-auto">
                    {filteredAchievements.length > 0 ? (
                      filteredAchievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200"
                          onClick={() => handleAchievementSelect(achievement.id)}
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
              
              {selectedAchievementData && (
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
                        {selectedAchievementData.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {selectedAchievementData.description}
                      </p>
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                          {getRarityLabel(selectedAchievementData.rarity)}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                          {getTypeLabel(selectedAchievementData.type)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAchievement("");
                        setAchievementSearch("");
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <LucideIcons.X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Выбор пользователя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                👤 Выберите пользователя
              </label>
              
              <div className="relative dropdown-container">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white pr-10"
                    placeholder="🔍 Поиск пользователя по имени или email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LucideIcons.Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                {showUserDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-10 max-h-96 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200"
                          onClick={() => handleUserSelect(user.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <LucideIcons.User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {user.name || "Без имени"}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <LucideIcons.Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Пользователи не найдены</p>
                        <p className="text-xs mt-1">Попробуйте изменить поисковый запрос</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedUserData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <LucideIcons.User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedUserData.name || "Без имени"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUserData.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser("");
                        setUserSearch("");
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <LucideIcons.X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Предварительный просмотр */}
            {selectedAchievementData && selectedUserData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Предварительный просмотр:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{selectedUserData.name || selectedUserData.email}</strong> получит достижение{" "}
                  <strong>"{selectedAchievementData.name}"</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedAchievementData.description}
                </p>
              </motion.div>
            )}

            {/* Ошибка */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
              >
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Кнопки */}
            <div className="flex items-center gap-4 justify-end pt-4">
              <button
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 hover:scale-105 font-medium"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGrantAchievement}
                disabled={loading || !selectedAchievement || !selectedUser}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Выдача...
                  </span>
                ) : (
                  "Выдать достижение"
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
