"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Achievement } from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { User } from "./types";
import GrantModalStats from "./GrantModalStats";
import AchievementSelector from "./AchievementSelector";
import UserSelector from "./UserSelector";
import GrantPreview from "./GrantPreview";
import GrantSuccessScreen from "./GrantSuccessScreen";

interface GrantAchievementModalProps {
  achievements: Achievement[];
  onClose: () => void;
  onSuccess: () => void;
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

  // Загружаем пользователей при открытии модалки
  useEffect(() => {
    loadUsers();
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

      const response = await fetch("/api/admin/achievements/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: selectedAchievement,
          userId: selectedUser,
        }),
      });

      const data = await response.json();

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

  // Подсчет отфильтрованных данных для статистики
  const filteredAchievementsCount = achievements.filter(
    (a) => a.isActive,
  ).length;
  const filteredUsersCount = users.length;

  const selectedAchievementData = achievements.find(
    (a) => a.id === selectedAchievement,
  );
  const selectedUserData = users.find((u) => u.id === selectedUser);

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

        {success && selectedAchievementData ? (
          <GrantSuccessScreen achievementName={selectedAchievementData.name} />
        ) : (
          <div className="space-y-8">
            <GrantModalStats
              achievementsCount={filteredAchievementsCount}
              usersCount={filteredUsersCount}
            />

            <AchievementSelector
              achievements={achievements}
              selectedAchievementId={selectedAchievement}
              onSelect={setSelectedAchievement}
              onClear={() => setSelectedAchievement("")}
            />

            <UserSelector
              users={users}
              selectedUserId={selectedUser}
              onSelect={setSelectedUser}
              onClear={() => setSelectedUser("")}
            />

            {selectedAchievementData && selectedUserData && (
              <GrantPreview
                achievement={selectedAchievementData}
                user={selectedUserData}
              />
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
