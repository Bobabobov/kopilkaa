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
}

export function DonateForm({
  amount,
  onAmountChange,
  onSubmit,
  loading,
  error,
  quickAmounts,
}: DonateFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: "#abd1c6" }}>
          Сумма пожертвования
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold" style={{ color: "#f9bc60" }}>
            ₽
          </div>
          <input
            type="number"
            min="1"
            max="100000"
            step="1"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="100"
            required
            autoFocus
            className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 text-xl font-semibold bg-gradient-to-br from-[#020617] to-[#001e1d] placeholder:text-[#6b7280] focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/30 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{
              borderColor: amount ? "rgba(249, 188, 96, 0.4)" : "#1f2937",
              color: "#fffffe"
            }}
          />
        </div>
        {amount && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs mt-2 text-center" 
            style={{ color: "#6b7280" }}
          >
            Минимум: 1₽ • Максимум: 100 000₽
          </motion.p>
        )}
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


