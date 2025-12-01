"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { QuickAmountButtons } from "./QuickAmountButtons";

interface DonateFormProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  quickAmounts: number[];
  variant?: "modal" | "inline";
}

export function DonateForm({
  amount,
  onAmountChange,
  onSubmit,
  loading,
  error,
  quickAmounts,
  variant = "modal",
}: DonateFormProps) {
  if (variant === "inline") {
    return (
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={onSubmit}
        className="space-y-4 bg-[#001e1d]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1f2937]"
      >
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: "#abd1c6" }}>
            Сумма (₽)
          </label>
          <input
            type="number"
            min="10"
            max="100000"
            step="1"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="100"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl border text-lg bg-[#020617] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 transition-all"
            style={{ borderColor: amount ? "#4b5563" : "#1f2937", color: "#fffffe" }}
          />
        </div>

        <QuickAmountButtons
          amounts={quickAmounts}
          selectedAmount={amount}
          onSelect={(amt) => onAmountChange(amt.toString())}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-3 py-2 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onAmountChange("");
            }}
            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "#1f2937",
              color: "#abd1c6"
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || !amount}
            className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: "#f9bc60",
              color: "#001e1d"
            }}
          >
            {loading ? "Создаём платёж..." : "Оплатить"}
          </button>
        </div>
      </motion.form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "#abd1c6" }}>
          Сумма (₽)
        </label>
        <input
          type="number"
          min="10"
          max="100000"
          step="1"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="100"
          required
          autoFocus
          className="w-full px-4 py-3 rounded-xl border text-lg bg-[#020617] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 transition-all"
          style={{
            borderColor: amount ? "#4b5563" : "#1f2937",
            color: "#fffffe"
          }}
        />
      </div>

      <QuickAmountButtons
        amounts={quickAmounts}
        selectedAmount={amount}
        onSelect={(amt) => onAmountChange(amt.toString())}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-3 py-2 rounded-xl flex items-start gap-2"
        >
          <LucideIcons.AlertCircle size="sm" className="mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={loading || !amount}
        className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
        style={{
          backgroundColor: "#f9bc60",
          color: "#001e1d"
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[#001e1d] border-t-transparent rounded-full animate-spin" />
            Создаём платёж...
          </span>
        ) : (
          "Оплатить"
        )}
      </button>
    </form>
  );
}

