// components/ui/Notification.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "./LucideIcons";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  action?: {
    text: string;
    onClick: () => void;
  };
}

export function Notification({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  action,
}: NotificationProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Автоматически закрывается через 5 секунд

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          iconBg: "bg-green-100 dark:bg-green-900/30",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: "text-yellow-600 dark:text-yellow-400",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          iconBg: "bg-red-100 dark:bg-red-900/30",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <LucideIcons.CheckCircle size="lg" />;
      case "warning":
        return <LucideIcons.AlertCircle size="lg" />;
      case "error":
        return <LucideIcons.XCircle size="lg" />;
      default:
        return <LucideIcons.Info size="lg" />;
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative ${styles.bg} ${styles.border} border rounded-2xl p-6 shadow-xl max-w-md w-full`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LucideIcons.Close
                size="sm"
                className="text-gray-500 dark:text-gray-400"
              />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`${styles.iconBg} ${styles.icon} p-3 rounded-xl`}>
                {getIcon()}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {message}
                </p>

                {/* Action button */}
                {action && (
                  <div className="flex gap-3">
                    <button
                      onClick={action.onClick}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      {action.text}
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200"
                    >
                      Отмена
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
