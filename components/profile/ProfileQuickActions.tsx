"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Action {
  title: string;
  description: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  color: string;
  iconBg: string;
}

export default function ProfileQuickActions() {
  const actions: Action[] = [
    {
      title: "Лайки",
      description: "Кто лайкнул",
      icon: "❤️",
      href: "/profile/likes",
      color: "bg-red-500 hover:bg-red-600",
      iconBg: "bg-red-100 dark:bg-red-900/20",
    },
    {
      title: "Полить дерево",
      description: "Увеличить серию",
      icon: "💧",
      href: "/profile",
      color: "bg-green-500 hover:bg-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Игры",
      description: "Заработать очки",
      icon: "🎮",
      href: "/games",
      color: "bg-purple-500 hover:bg-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Настройки",
      description: "Профиль и дерево",
      icon: "⚙️",
      href: undefined,
      onClick: () =>
        window.dispatchEvent(new CustomEvent("open-settings-modal")),
      color: "bg-gray-500 hover:bg-gray-600",
      iconBg: "bg-gray-100 dark:bg-gray-700",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20 h-fit"
    >
      <div className="mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🚀 Быстрые действия
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={action.title || `action-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {action.href ? (
              <Link
                href={action.href as any}
                className={`block p-3 rounded-lg transition-all duration-200 ${action.color} text-white shadow-md hover:shadow-lg`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${action.iconBg}`}
                  >
                    <span className="text-lg">{action.icon}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className={`block p-3 rounded-lg transition-all duration-200 ${action.color} text-white shadow-md hover:shadow-lg w-full`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${action.iconBg}`}
                  >
                    <span className="text-lg">{action.icon}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
