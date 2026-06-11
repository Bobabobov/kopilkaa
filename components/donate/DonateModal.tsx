"use client";

import { motion } from "framer-motion";
import { GlassModal, GlassModalCloseButton } from "@/components/ui/GlassModal";
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
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="lg"
      zIndex={50}
      hideHeader
      showCloseButton={false}
      bodyClassName="px-6 py-8 sm:px-8"
      ariaLabelledBy="donate-modal-title"
      header={
        <div className="relative shrink-0 border-b border-white/[0.08] px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <div className="absolute right-4 top-4 z-10">
            <GlassModalCloseButton onClose={onClose} />
          </div>
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9bc60] via-[#e8a545] to-[#f9bc60] shadow-lg shadow-[#f9bc60]/30"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <LucideIcons.Heart size="lg" className="text-[#001e1d]" />
              </motion.div>
            </motion.div>

            <motion.h2
              id="donate-modal-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-3xl font-bold text-transparent"
            >
              Пополнить копилку
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-[#abd1c6]"
            >
              Ваша поддержка помогает проекту развиваться
            </motion.p>
          </div>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DonateForm
          amount={amount}
          onAmountChange={onAmountChange}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
          quickAmounts={quickAmounts}
        />
      </motion.div>
    </GlassModal>
  );
}
