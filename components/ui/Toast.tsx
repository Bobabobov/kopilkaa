// components/ui/Toast.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-3 right-3 left-3 xs:top-4 xs:right-4 xs:left-auto sm:top-6 sm:right-6 z-[9999] pointer-events-auto ${getBgColor()} text-white px-4 py-3 xs:px-5 xs:py-3.5 sm:px-6 sm:py-4 rounded-lg xs:rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 max-w-full xs:max-w-sm sm:max-w-md mx-auto xs:mx-0`}
    >
      <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-3">
        <span className="text-lg xs:text-xl sm:text-2xl flex-shrink-0">{getIcon()}</span>
        <span className="font-medium text-sm xs:text-base sm:text-lg flex-1 min-w-0 break-words">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 xs:ml-2 text-white/80 hover:text-white transition-colors flex-shrink-0 p-1 rounded active:scale-95"
          aria-label="Закрыть уведомление"
        >
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
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
    </motion.div>
  );
}

// Хук для управления уведомлениями
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-3 right-3 left-3 xs:top-4 xs:right-4 xs:left-auto sm:top-6 sm:right-6 z-[9999] space-y-2 xs:space-y-2.5 sm:space-y-3 pointer-events-none max-w-full xs:max-w-sm sm:max-w-md mx-auto xs:mx-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { showToast, ToastContainer };
}
