"use client";

import { useEffect, useState } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

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

const alertIconClass: Record<AlertType, string> = {
  error: "text-[#e16162]",
  warning: "text-[#f9bc60]",
  info: "text-[#abd1c6]",
  success: "text-[#6ee7b7]",
};

function AlertIcon({ type }: { type: AlertType }) {
  switch (type) {
    case "error":
      return <LucideIcons.AlertTriangle className="h-5 w-5" />;
    case "warning":
      return <LucideIcons.AlertTriangle className="h-5 w-5" />;
    case "info":
      return <LucideIcons.Info className="h-5 w-5" />;
    case "success":
      return <LucideIcons.CheckCircle className="h-5 w-5" />;
  }
}

export default function BeautifulAlert({
  show,
  onClose,
  type,
  title,
  message,
  duration = 0,
  showCloseButton = true,
}: BeautifulAlertProps) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <GlassModal
      show={show}
      onClose={onClose}
      size="md"
      title={title}
      icon={
        <span className={alertIconClass[type]}>
          <AlertIcon type={type} />
        </span>
      }
      showCloseButton={showCloseButton}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors",
              type === "error"
                ? "bg-[#e16162] text-white hover:bg-[#c95556]"
                : type === "success"
                  ? "bg-[#10B981] text-[#001e1d] hover:bg-[#0d9668]"
                  : "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]",
            )}
          >
            Понятно
          </button>
        </div>
      }
    >
      {message && (
        <p className="text-sm leading-relaxed text-[#abd1c6]">{message}</p>
      )}
    </GlassModal>
  );
}

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
    showCloseButton?: boolean,
  ) => {
    setAlert({
      show: true,
      type,
      title,
      message,
      duration,
      showCloseButton,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
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
