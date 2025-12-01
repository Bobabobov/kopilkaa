"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DonateForm } from "./DonateForm";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  quickAmounts: number[];
}

export function DonateModal({
  isOpen,
  onClose,
  amount,
  onAmountChange,
  onSubmit,
  loading,
  error,
  quickAmounts,
}: DonateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md rounded-3xl bg-[#001e1d] border border-[#1f2937] shadow-2xl px-8 py-7 pointer-events-auto">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#f9bc60] hover:bg-[#1f2937] rounded-lg transition-all"
              >
                ×
              </button>

              <div className="mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
                  <LucideIcons.Heart size="md" className="text-[#001e1d]" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#fffffe" }}>
                  Пополнить копилку
                </h2>
                <p className="text-xs text-center" style={{ color: "#6b7280" }}>
                  Ваша поддержка помогает проекту
                </p>
              </div>

              <DonateForm
                amount={amount}
                onAmountChange={onAmountChange}
                onSubmit={onSubmit}
                loading={loading}
                error={error}
                quickAmounts={quickAmounts}
                variant="modal"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


