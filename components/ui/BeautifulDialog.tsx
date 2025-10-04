// components/ui/BeautifulDialog.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type DialogType = "alert" | "confirm" | "prompt";

export interface BeautifulDialogProps {
  show: boolean;
  onClose: () => void;
  type: DialogType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  promptValue?: string;
  onPromptChange?: (value: string) => void;
  placeholder?: string;
}

export default function BeautifulDialog({ 
  show, 
  onClose, 
  type, 
  title, 
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Отмена",
  promptValue = "",
  onPromptChange,
  placeholder = "Введите значение"
}: BeautifulDialogProps) {
  const [inputValue, setInputValue] = useState(promptValue);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show]);

  const handleConfirm = () => {
    if (type === "prompt" && onPromptChange) {
      onPromptChange(inputValue);
    }
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "alert":
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "confirm":
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "prompt":
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
    }
  };

  const getGradient = () => {
    switch (type) {
      case "alert":
        return "from-red-500 to-rose-500";
      case "confirm":
        return "from-blue-500 to-indigo-500";
      case "prompt":
        return "from-purple-500 to-pink-500";
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.4 
            }}
            className="relative w-full max-w-md"
          >
            {/* Фоновое свечение */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()} rounded-2xl blur-sm opacity-20 scale-105`}></div>
            
            {/* Основная плашка */}
            <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getGradient()} rounded-full flex items-center justify-center shadow-lg`}>
                    {getIcon()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {message}
                  </p>
                  
                  {/* Поле ввода для prompt */}
                  {type === "prompt" && (
                    <div className="mb-4">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  )}
                  
                  {/* Кнопки */}
                  <div className="flex gap-3 justify-end">
                    {(type === "confirm" || type === "prompt") && (
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                      >
                        {cancelText}
                      </button>
                    )}
                    <button
                      onClick={handleConfirm}
                      className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${getGradient()} hover:opacity-90 rounded-lg transition-opacity duration-200 shadow-lg`}
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Хук для удобного использования
export function useBeautifulDialog() {
  const [dialog, setDialog] = useState<{
    show: boolean;
    type: DialogType;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    promptValue?: string;
    onPromptChange?: (value: string) => void;
    placeholder?: string;
  }>({
    show: false,
    type: "alert",
    title: "",
    message: "",
  });

  const showDialog = (options: {
    type: DialogType;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    promptValue?: string;
    onPromptChange?: (value: string) => void;
    placeholder?: string;
  }) => {
    setDialog({ show: true, ...options });
  };

  const hideDialog = () => {
    setDialog(prev => ({ ...prev, show: false }));
  };

  const DialogComponent = () => (
    <BeautifulDialog
      show={dialog.show}
      onClose={hideDialog}
      type={dialog.type}
      title={dialog.title}
      message={dialog.message}
      onConfirm={dialog.onConfirm}
      onCancel={dialog.onCancel}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      promptValue={dialog.promptValue}
      onPromptChange={dialog.onPromptChange}
      placeholder={dialog.placeholder}
    />
  );

  return { showDialog, hideDialog, DialogComponent };
}
