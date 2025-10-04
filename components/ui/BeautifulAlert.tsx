// components/ui/BeautifulAlert.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type AlertType = "error" | "warning" | "info" | "success";

export interface BeautifulAlertProps {
  show: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
  showCloseButton?: boolean;
}

const alertConfig = {
  error: {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
    iconBg: "bg-gradient-to-r from-red-500 to-rose-500",
  },
  warning: {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    gradient: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
    iconBg: "bg-gradient-to-r from-amber-500 to-yellow-500",
  },
  info: {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
    iconBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
  },
  success: {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-gradient-to-r from-emerald-500 to-green-500",
  },
};

export default function BeautifulAlert({ 
  show, 
  onClose, 
  type, 
  title, 
  message, 
  duration = 0,
  showCloseButton = true
}: BeautifulAlertProps) {
  const config = alertConfig[type] || alertConfig.info;

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
            duration: 0.4 
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Фоновое свечение */}
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-sm opacity-20 scale-105`}></div>
            
            {/* Основная плашка */}
            <div className={`relative ${config.bgColor} rounded-2xl shadow-2xl border ${config.borderColor} p-6 backdrop-blur-sm`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
                    {config.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold ${config.textColor} leading-tight mb-2`}>
                    {title}
                  </h3>
                  {message && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {message}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Хук для удобного использования
export function useBeautifulAlert() {
  const [alert, setAlert] = useState<{
    show: boolean;
    type: AlertType;
    title: string;
    message?: string;
    duration?: number;
    showCloseButton?: boolean;
  }>({
    show: false,
    type: "info",
    title: "",
  });

  const showAlert = (
    type: AlertType, 
    title: string, 
    message?: string, 
    duration?: number,
    showCloseButton?: boolean
  ) => {
    setAlert({ show: true, type, title, message, duration, showCloseButton });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  const AlertComponent = () => (
    <BeautifulAlert
      show={alert.show}
      onClose={hideAlert}
      type={alert.type}
      title={alert.title}
      message={alert.message}
      duration={alert.duration}
      showCloseButton={alert.showCloseButton}
    />
  );

  return { showAlert, hideAlert, AlertComponent };
}






