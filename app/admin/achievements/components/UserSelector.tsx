// app/admin/achievements/components/UserSelector.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { User } from "./types";

interface UserSelectorProps {
  users: User[];
  selectedUserId: string;
  onSelect: (userId: string) => void;
  onClear: () => void;
}

export default function UserSelector({
  users,
  selectedUserId,
  onSelect,
  onClear,
}: UserSelectorProps) {
  const [userSearch, setUserSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Закрываем dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) => {
    const searchTerm = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      (user.email ? user.email.toLowerCase().includes(searchTerm) : false) ||
      (user.email ? user.email.split("@")[0].toLowerCase() : "").includes(
        searchTerm,
      )
    );
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSelect = (userId: string) => {
    onSelect(userId);
    setUserSearch("");
    setShowDropdown(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        👤 Выберите пользователя
      </label>

      <div className="relative user-dropdown-container">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white pr-10"
            placeholder="🔍 Поиск пользователя по имени или email..."
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200"
                  onClick={() => handleSelect(user.id)}
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
                <p className="text-xs mt-1">
                  Попробуйте изменить поисковый запрос
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
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
                {selectedUser.name || "Без имени"}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedUser.email}
              </p>
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
