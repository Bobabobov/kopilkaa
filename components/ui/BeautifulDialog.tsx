"use client";

import { useEffect, useState } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

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

const dialogIconClass: Record<DialogType, string> = {
  alert: "text-[#e16162]",
  confirm: "text-[#f9bc60]",
  prompt: "text-[#abd1c6]",
};

function DialogIcon({ type }: { type: DialogType }) {
  if (type === "alert") {
    return <LucideIcons.AlertTriangle className="h-5 w-5" />;
  }
  if (type === "confirm") {
    return <LucideIcons.HelpCircle className="h-5 w-5" />;
  }
  return <LucideIcons.MessageCircle className="h-5 w-5" />;
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
  placeholder = "Введите значение",
}: BeautifulDialogProps) {
  const [inputValue, setInputValue] = useState(promptValue);

  useEffect(() => {
    if (show) setInputValue(promptValue);
  }, [promptValue, show]);

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

  return (
    <GlassModal
      show={show}
      onClose={onClose}
      size="md"
      title={title}
      icon={
        <span className={dialogIconClass[type]}>
          <DialogIcon type={type} />
        </span>
      }
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          {(type === "confirm" || type === "prompt") && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-[#abd1c6] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-white/10 hover:text-white"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors",
              type === "alert"
                ? "bg-[#e16162] text-white hover:bg-[#c95556]"
                : "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]",
            )}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-[#abd1c6]">{message}</p>

      {type === "prompt" && (
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          className="mt-4 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-[#94a1b2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition-colors focus:border-[#f9bc60]/40 focus:ring-2 focus:ring-[#f9bc60]/20"
          autoFocus
        />
      )}
    </GlassModal>
  );
}

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
    setDialog((prev) => ({ ...prev, show: false }));
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
