// components/ui/BeautifulToast.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  show: boolean;
  onClose: () => void;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-white/95 dark:bg-gray-800/95",
    borderColor: "border-emerald-300 dark:border-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  error: {
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-300 dark:border-red-500",
    textColor: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    gradient: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-300 dark:border-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-300 dark:border-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
  },
};

export default function BeautifulToast({
  show,
  onClose,
  type,
  title,
  message,
  duration = 3000,
}: ToastProps) {
  const config = toastConfig[type] || toastConfig.info;

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!config) {
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.4,
          }}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 left-4 sm:left-auto z-[9999] max-w-sm sm:max-w-xs mx-auto sm:mx-0"
        >
          <div className="relative w-full">
            {/* Основная плашка */}
            <div
              className={`relative ${config.bgColor} rounded-lg shadow-md border ${config.borderColor} p-3 sm:p-3 w-full backdrop-blur-sm`}
            >
              {/* Аккуратное внутреннее свечение */}
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-r ${config.gradient} opacity-5`}
              ></div>
              <div className="relative z-10 flex items-start gap-2 sm:gap-2">
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-sm`}
                  >
                    {config.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[11px] sm:text-xs font-semibold ${config.textColor} leading-tight break-words`}
                  >
                    {title}
                  </p>
                  {message && (
                    <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed break-words">
                      {message}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Закрыть уведомление"
                >
                  <svg
                    className="w-3 h-3 sm:w-3 sm:h-3 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Хук для удобного использования
export function useBeautifulToast() {
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>({
    show: false,
    type: "info",
    title: "",
  });

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => {
    setToast({ show: true, type, title, message, duration });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const ToastComponent = () => (
    <BeautifulToast
      show={toast.show}
      onClose={hideToast}
      type={toast.type}
      title={toast.title}
      message={toast.message}
      duration={toast.duration}
    />
  );

  return { showToast, hideToast, ToastComponent };
}
