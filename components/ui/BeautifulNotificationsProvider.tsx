// components/ui/BeautifulNotificationsProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useBeautifulAlert } from "./BeautifulAlert";
import { useBeautifulModal } from "./BeautifulModal";
import { useBeautifulDialog } from "./BeautifulDialog";
import { useBeautifulToast } from "./BeautifulToast";

interface BeautifulNotificationsContextType {
  // Alert функции
  showAlert: (
    type: "error" | "warning" | "info" | "success",
    title: string,
    message?: string,
    duration?: number,
    showCloseButton?: boolean,
  ) => void;
  hideAlert: () => void;

  // Modal функции
  showModal: (
    title: string,
    content: ReactNode,
    options?: {
      size?: "sm" | "md" | "lg" | "xl";
      showCloseButton?: boolean;
      closeOnBackdropClick?: boolean;
    },
  ) => void;
  hideModal: () => void;

  // Dialog функции
  showDialog: (options: {
    type: "alert" | "confirm" | "prompt";
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    promptValue?: string;
    onPromptChange?: (value: string) => void;
    placeholder?: string;
  }) => void;
  hideDialog: () => void;

  // Toast функции
  showToast: (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  hideToast: () => void;

  // Замена стандартных окон браузера
  alert: (message: string, title?: string) => void;
  confirm: (message: string, title?: string) => Promise<boolean>;
  prompt: (
    message: string,
    defaultValue?: string,
    title?: string,
  ) => Promise<string | null>;
}

const BeautifulNotificationsContext =
  createContext<BeautifulNotificationsContextType | null>(null);

export function BeautifulNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { showAlert, hideAlert, AlertComponent } = useBeautifulAlert();
  const { showModal, hideModal, ModalComponent } = useBeautifulModal();
  const { showDialog, hideDialog, DialogComponent } = useBeautifulDialog();
  const { showToast, hideToast, ToastComponent } = useBeautifulToast();

  // Замена стандартного alert
  const alert = (message: string, title: string = "Уведомление") => {
    showAlert("info", title, message, 0, true);
  };

  // Замена стандартного confirm
  const confirm = (
    message: string,
    title: string = "Подтверждение",
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      showDialog({
        type: "confirm",
        title,
        message,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
        confirmText: "Да",
        cancelText: "Нет",
      });
    });
  };

  // Замена стандартного prompt
  const prompt = (
    message: string,
    defaultValue: string = "",
    title: string = "Ввод",
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      let currentValue = defaultValue;
      showDialog({
        type: "prompt",
        title,
        message,
        promptValue: defaultValue,
        onPromptChange: (value) => {
          currentValue = value;
        },
        onConfirm: () => resolve(currentValue),
        onCancel: () => resolve(null),
        confirmText: "OK",
        cancelText: "Отмена",
        placeholder: "Введите значение",
      });
    });
  };

  const value: BeautifulNotificationsContextType = {
    showAlert,
    hideAlert,
    showModal,
    hideModal,
    showDialog,
    hideDialog,
    showToast,
    hideToast,
    alert,
    confirm,
    prompt,
  };

  return (
    <BeautifulNotificationsContext.Provider value={value}>
      {children}
      <AlertComponent key="alert-component" />
      <ModalComponent key="modal-component" />
      <DialogComponent key="dialog-component" />
      <ToastComponent key="toast-component" />
    </BeautifulNotificationsContext.Provider>
  );
}

export function useBeautifulNotifications() {
  const context = useContext(BeautifulNotificationsContext);
  if (!context) {
    throw new Error(
      "useBeautifulNotifications must be used within BeautifulNotificationsProvider",
    );
  }
  return context;
}

// Глобальные функции для замены стандартных окон браузера
declare global {
  interface Window {
    beautifulAlert: (message: string, title?: string) => void;
    beautifulConfirm: (message: string, title?: string) => Promise<boolean>;
    beautifulPrompt: (
      message: string,
      defaultValue?: string,
      title?: string,
    ) => Promise<string | null>;
  }
}

// Инициализация глобальных функций
export function initBeautifulNotifications() {
  if (typeof window !== "undefined") {
    // Получаем контекст из провайдера
    const provider = document.querySelector("[data-beautiful-notifications]");
    if (provider) {
      // Здесь можно добавить логику для получения функций из контекста
      // Пока что оставляем заглушки
      window.beautifulAlert = (message: string, title?: string) => {
      };

      window.beautifulConfirm = (
        message: string,
        title?: string,
      ): Promise<boolean> => {
        return Promise.resolve(true);
      };

      window.beautifulPrompt = (
        message: string,
        defaultValue?: string,
        title?: string,
      ): Promise<string | null> => {
        return Promise.resolve(defaultValue || null);
      };
    }
  }
}
