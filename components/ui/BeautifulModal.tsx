// components/ui/BeautifulModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export interface BeautifulModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const sizeConfig = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function BeautifulModal({ 
  show, 
  onClose, 
  title, 
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true
}: BeautifulModalProps) {
  const sizeClass = sizeConfig[size];

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
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeOnBackdropClick ? onClose : undefined}
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
            className={`relative w-full ${sizeClass} max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Фоновое свечение */}
            <div className="absolute inset-0 bg-gradient-to-r from-pastel-mint-500 to-pastel-aqua-500 rounded-2xl blur-sm opacity-20 scale-105"></div>
            
            {/* Основная плашка */}
            <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
              {/* Заголовок */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Содержимое */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Хук для удобного использования
export function useBeautifulModal() {
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    content: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
  }>({
    show: false,
    title: "",
    content: null,
  });

  const showModal = (
    title: string,
    content: React.ReactNode,
    options?: {
      size?: "sm" | "md" | "lg" | "xl";
      showCloseButton?: boolean;
      closeOnBackdropClick?: boolean;
    }
  ) => {
    setModal({ 
      show: true, 
      title, 
      content, 
      size: options?.size,
      showCloseButton: options?.showCloseButton,
      closeOnBackdropClick: options?.closeOnBackdropClick
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  const ModalComponent = () => (
    <BeautifulModal
      show={modal.show}
      onClose={hideModal}
      title={modal.title}
      size={modal.size}
      showCloseButton={modal.showCloseButton}
      closeOnBackdropClick={modal.closeOnBackdropClick}
    >
      {modal.content}
    </BeautifulModal>
  );

  return { showModal, hideModal, ModalComponent };
}
