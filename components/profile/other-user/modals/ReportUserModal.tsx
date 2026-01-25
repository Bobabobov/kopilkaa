// components/profile/other-user/modals/ReportUserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface ReportUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string | null;
}

export default function ReportUserModal({
  isOpen,
  onClose,
  userId,
  userName,
}: ReportUserModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      showToast("error", "Ошибка", "Пожалуйста, укажите причину жалобы");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/users/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: reason.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Жалоба отправлена", "Мы рассмотрим обращение");
        setReason("");
        onClose();
      } else {
        showToast(
          "error",
          "Ошибка",
          data.message || "Не удалось отправить жалобу",
        );
      }
    } catch (error) {
      console.error("Report error:", error);
      showToast("error", "Ошибка", "Не удалось отправить жалобу");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] rounded-3xl p-6 shadow-2xl border border-[#abd1c6]/20"
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-2">
                Пожаловаться на пользователя
              </h2>
              <p className="text-[#abd1c6] text-sm">
                {userName
                  ? `Жалоба на пользователя: ${userName}`
                  : "Расскажите о проблеме"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#abd1c6] text-sm mb-2">
                  Причина жалобы
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Чего паренек или девчонка сделали такого, чтобы жаловаться на него?"
                  className="w-full px-4 py-3 bg-[#001e1d]/50 border border-[#abd1c6]/20 rounded-xl text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/20 transition-all resize-none"
                  rows={5}
                  disabled={submitting}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-[#001e1d]/30 hover:bg-[#001e1d]/40 text-[#abd1c6] rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason.trim()}
                  className="flex-1 px-4 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Отправка..." : "Отправить жалобу"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Toast */}
          <ToastComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
