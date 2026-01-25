"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Achievement } from "@/lib/achievements/types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getRarityLabel } from "@/lib/achievements/rarity";

interface RevokeAchievementModalProps {
  achievements: Achievement[];
  onClose: () => void;
  onSuccess: () => void;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
}

export default function RevokeAchievementModal({
  achievements,
  onClose,
  onSuccess,
}: RevokeAchievementModalProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    if (!selectedAchievement || !selectedUser) {
      setError("Выберите достижение и пользователя");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/achievements/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievementId: selectedAchievement,
          userId: selectedUser,
        }),
      });
      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Ошибка отзыва достижения");
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка отзыва достижения");
    } finally {
      setLoading(false);
    }
  };

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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-3xl w-full shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl flex items-center justify-center">
            <LucideIcons.Trash2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Отозвать достижение
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Достижение
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 dark:text-white"
                value={selectedAchievement}
                onChange={(e) => setSelectedAchievement(e.target.value)}
              >
                <option value="">Выберите достижение</option>
                {achievements.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} • {getRarityLabel(a.rarity)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пользователь
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 dark:text-white"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Выберите пользователя</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedAchievementData && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                  <LucideIcons.Star size="sm" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedAchievementData.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAchievementData.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedUserData && (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-white">
                <LucideIcons.User size="sm" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {selectedUserData.name || "Без имени"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUserData.email}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Закрыть
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Обрабатываем..." : "Отозвать достижение"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
