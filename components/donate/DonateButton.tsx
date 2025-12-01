"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DonateModal } from "./DonateModal";
import { DonateForm } from "./DonateForm";

interface DonateButtonProps {
  className?: string;
  variant?: "default" | "large";
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function DonateButton({ className = "", variant = "default" }: DonateButtonProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setIsOpen(false);
    setAmount("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          comment: "Донат в копилку"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Ошибка создания платежа");
      }

      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        alert("Платёжная система ещё не настроена. Нужно установить SDK и добавить ключи в .env.local");
      }
    } catch (err: any) {
      setError(err.message || "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "large") {
    return (
      <div className={className}>
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                backgroundColor: "#f9bc60",
                color: "#001e1d"
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <LucideIcons.Heart size="md" />
                <span>Пополнить копилку</span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: "#fffffe" }}>
                  Введите сумму
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[#9ca3af] hover:text-[#f9bc60] transition-colors"
                >
                  ×
                </button>
              </div>
              <DonateForm
                amount={amount}
                onAmountChange={setAmount}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                quickAmounts={QUICK_AMOUNTS}
                variant="inline"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
        style={{
          backgroundColor: "#f9bc60",
          color: "#001e1d"
        }}
      >
        <LucideIcons.Heart size="sm" />
        <span>Пополнить копилку</span>
      </button>

      <DonateModal
        isOpen={isOpen}
        onClose={resetForm}
        amount={amount}
        onAmountChange={setAmount}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        quickAmounts={QUICK_AMOUNTS}
      />
    </div>
  );
}
