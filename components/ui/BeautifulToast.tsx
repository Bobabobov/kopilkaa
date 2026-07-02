// components/ui/BeautifulToast.tsx
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  show: boolean;
  onClose: () => void;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

/** Единая палитра: непрозрачный фон + высокий контраст текста */
const toastConfig = {
  success: {
    backgroundColor: '#004643',
    borderColor: 'rgba(52, 211, 153, 0.55)',
    titleColor: '#ffffff',
    messageColor: '#d8ebe6',
    iconGradient: 'from-emerald-400 to-green-500',
    closeColor: '#abd1c6',
    closeHover: 'hover:bg-white/10',
    Icon: LucideIcons.CheckCircle,
  },
  error: {
    backgroundColor: '#2a1215',
    borderColor: 'rgba(225, 97, 98, 0.55)',
    titleColor: '#ffb4b4',
    messageColor: '#f5d6d6',
    iconGradient: 'from-[#e16162] to-rose-500',
    closeColor: '#f5d6d6',
    closeHover: 'hover:bg-white/10',
    Icon: LucideIcons.XCircle,
  },
  warning: {
    backgroundColor: '#2a2210',
    borderColor: 'rgba(249, 188, 96, 0.6)',
    titleColor: '#ffe8b8',
    messageColor: '#f5e6c8',
    iconGradient: 'from-[#f9bc60] to-amber-400',
    closeColor: '#f5e6c8',
    closeHover: 'hover:bg-white/10',
    Icon: LucideIcons.AlertTriangle,
  },
  info: {
    backgroundColor: '#0a2a28',
    borderColor: 'rgba(171, 209, 198, 0.45)',
    titleColor: '#ffffff',
    messageColor: '#d8ebe6',
    iconGradient: 'from-[#abd1c6] to-teal-400',
    closeColor: '#abd1c6',
    closeHover: 'hover:bg-white/10',
    Icon: LucideIcons.Info,
  },
} as const;

interface ToastContextValue {
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastState {
  show: boolean;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function BeautifulToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'info',
    title: '',
  });

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      setToast({ show: true, type, title, message, duration });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <BeautifulToast
        show={toast.show}
        onClose={hideToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
}

export default function BeautifulToast({
  show,
  onClose,
  type,
  title,
  message,
  duration = 4000,
}: ToastProps) {
  const config = toastConfig[type] ?? toastConfig.info;
  const Icon = config.Icon;

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            duration: 0.4,
          }}
          className="fixed top-3 right-3 left-3 z-[9999] mx-auto max-w-full xs:top-4 xs:right-4 xs:left-auto xs:mx-0 xs:max-w-sm sm:top-6 sm:right-6 sm:max-w-md"
          role="status"
          aria-live="polite"
        >
          <div
            className="relative w-full rounded-xl border-2 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] xs:p-3.5 sm:p-4"
            style={{
              backgroundColor: config.backgroundColor,
              borderColor: config.borderColor,
            }}
          >
            <div
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-r opacity-10',
                config.iconGradient,
              )}
            />
            <div className="relative z-10 flex items-start gap-2.5 xs:gap-3 sm:gap-3">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r shadow-sm xs:h-8 xs:w-8',
                    config.iconGradient,
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-[#001e1d] xs:h-4 xs:w-4" />
                </div>
              </div>
              <div className="min-w-0 flex-1 pr-1">
                <p
                  className="break-words text-xs font-bold leading-tight xs:text-sm sm:text-base"
                  style={{ color: config.titleColor }}
                >
                  {title}
                </p>
                {message && (
                  <p
                    className="mt-1 break-words text-xs font-medium leading-relaxed xs:mt-1.5 xs:text-sm"
                    style={{ color: config.messageColor }}
                  >
                    {message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'flex-shrink-0 rounded-md p-1 transition-colors duration-200 active:scale-95 xs:p-1.5',
                  config.closeHover,
                )}
                style={{ color: config.closeColor }}
                aria-label="Закрыть уведомление"
              >
                <LucideIcons.X className="h-4 w-4 xs:h-5 xs:w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useBeautifulToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      'useBeautifulToast must be used within BeautifulToastProvider',
    );
  }

  /** @deprecated Тост рендерится глобально в BeautifulToastProvider */
  const ToastComponent = () => null;

  return { ...context, ToastComponent };
}
