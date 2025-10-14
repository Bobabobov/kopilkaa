"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EmailVisibilityToggleProps {
  hideEmail: boolean;
  onToggle: (hideEmail: boolean) => Promise<void>;
  disabled?: boolean;
}

export default function EmailVisibilityToggle({
  hideEmail,
  onToggle,
  disabled = false,
}: EmailVisibilityToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onToggle(!hideEmail);
    } catch (error) {
      console.error("Error toggling email visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Видимость email
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {hideEmail
            ? "Ваш email скрыт от других пользователей"
            : "Ваш email виден всем пользователям"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${hideEmail ? "text-gray-500 dark:text-gray-400" : "text-emerald-600 dark:text-emerald-400"}`}
        >
          {hideEmail ? "Скрыт" : "Виден"}
        </span>

        <button
          onClick={handleToggle}
          disabled={disabled || isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            hideEmail ? "bg-gray-300 dark:bg-gray-600" : "bg-emerald-500"
          } ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <motion.span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
              hideEmail ? "translate-x-1" : "translate-x-6"
            }`}
            animate={{
              x: hideEmail ? 4 : 24,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        </button>

        {isLoading && (
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}





