"use client";

import { motion } from "framer-motion";
import NameEditor from "./NameEditor";
import EmailEditor from "./EmailEditor";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
}

interface ProfileInfoSectionProps {
  user: User;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  saving: boolean;
}

export default function ProfileInfoSection({
  user,
  onNameChange,
  onEmailChange,
  saving,
}: ProfileInfoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-2"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Личная информация
        </h2>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя
            </label>
            <NameEditor
              currentName={user.name || ""}
              onSave={onNameChange}
              disabled={saving}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <EmailEditor
              currentEmail={user.email}
              onSave={onEmailChange}
              disabled={saving}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Роль
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                }`}
              >
                {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
              </span>
            </div>
          </div>

          {/* Registration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Дата регистрации
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400">
              {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
