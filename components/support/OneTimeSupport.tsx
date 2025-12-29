"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface OneTimeSupportProps {
  customAmount: string;
  onAmountChange: (amount: string) => void;
  showSocialPrompt?: boolean;
}

const predefinedAmounts = [100, 300, 500, 1000, 2000, 5000];

export default function OneTimeSupport({
  customAmount,
  onAmountChange,
  showSocialPrompt,
}: OneTimeSupportProps) {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);

  const handlePurchase = async () => {
    const amountNumber = parseInt(customAmount || "0", 10);
    if (!amountNumber || amountNumber <= 0) return;

    try {
      setLoading(true);
      setResultMessage(null);
      setResultError(null);

      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNumber,
          // В API сейчас допустимы только существующие типы (fallback -> SUPPORT),
          // поэтому "SERVICE" выражаем через comment.
          type: "SUPPORT",
          comment: "heroes_placement",
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Не удалось оформить оплату услуги");
      }

      setResultMessage(
        "Оплата принята. Ваш профиль будет размещён в разделе «Герои» и будет участвовать в рейтинге.",
      );
    } catch (error) {
      console.error("Heroes placement purchase error:", error);
      setResultError("Не получилось оформить оплату услуги. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9bc60]/10 border border-[#f9bc60]/30 mb-3">
            <LucideIcons.Trophy className="w-4 h-4 text-[#f9bc60]" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#e16162" }}>
              Цифровая услуга
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3" style={{ color: "#fffffe" }}>
            Размещение в разделе «Герои»
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto px-2 leading-relaxed" style={{ color: "#abd1c6" }}>
            Разовая оплата без подписки. Профиль размещается публично и участвует в рейтинге.
          </p>
        </motion.div>

        <div className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-xl sm:rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6 text-center" style={{ color: "#abd1c6" }}>
            Выберите сумму оплаты услуги
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 sm:mb-6">
            {predefinedAmounts.map((amount, index) => {
              const isSelected = customAmount === amount.toString();
              const isLarge = amount >= 1000;
              return (
                <motion.button
                  key={amount}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAmountChange(amount.toString())}
                  className={`py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 relative overflow-hidden ${
                    isSelected ? "shadow-lg ring-2 ring-[#f9bc60]/50" : "hover:border-[#abd1c6]/40"
                  } ${isLarge ? "md:col-span-1" : ""}`}
                  style={{
                    backgroundColor: isSelected ? "#f9bc60" : "transparent",
                    color: isSelected ? "#001e1d" : "#abd1c6",
                    border: isSelected ? "none" : "1px solid #abd1c6/20",
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="absolute top-2 right-2"
                    >
                      <LucideIcons.CheckCircle className="w-4 h-4 text-[#001e1d]" />
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <div className="text-lg sm:text-xl font-bold">
                      ₽{amount.toLocaleString()}
                    </div>
                    {isLarge && (
                      <div className="text-xs opacity-70 font-normal mt-1">Размещение</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mb-5 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <label className="block text-sm sm:text-base font-medium mb-2.5" style={{ color: "#abd1c6" }}>
                Или введите свою сумму
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-[#004643]/40 border border-[#abd1c6]/25 rounded-xl px-4 sm:px-5 py-3 text-base font-medium placeholder-[#abd1c6]/40 focus:border-[#e16162] focus:outline-none focus:ring-2 focus:ring-[#e16162]/50 transition-all duration-200"
                  style={{ color: "#fffffe" }}
                />
                <span 
                  className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-sm font-medium opacity-70"
                  style={{ color: "#abd1c6" }}
                >
                  ₽
                </span>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={
              loading || !customAmount || parseInt(customAmount || "0", 10) <= 0
            }
            className="w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            style={{
              background: customAmount && parseInt(customAmount) > 0 
                ? "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)" 
                : "#004643",
              color: customAmount && parseInt(customAmount) > 0 ? "#001e1d" : "#abd1c6",
              border: customAmount && parseInt(customAmount) > 0 ? "none" : "1px solid #abd1c6/20",
            }}
            onClick={handlePurchase}
          >
            <LucideIcons.Trophy className="w-5 h-5 sm:w-6 sm:h-6 inline mr-2" />
            <span className="hidden sm:inline">
              {loading
                ? "Оформляем..."
                : customAmount && parseInt(customAmount) > 0
                  ? `Оплатить размещение на ₽${parseInt(customAmount).toLocaleString()}`
                  : "Введите сумму"}
            </span>
            <span className="sm:hidden">
              {loading
                ? "Оформляем..."
                : customAmount && parseInt(customAmount) > 0
                  ? `Оплатить ₽${parseInt(customAmount).toLocaleString()}`
                  : "Введите сумму"}
            </span>
          </motion.button>

          {(resultMessage || resultError) && (
            <div
              className={`mt-4 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${
                resultError
                  ? "border-red-500/50 bg-red-500/10 text-red-200"
                  : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {resultError || resultMessage}
            </div>
          )}

          {showSocialPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 sm:mt-7 rounded-2xl sm:rounded-3xl border border-[#f9bc60]/40 bg-gradient-to-r from-[#f9bc60]/18 via-[#e16162]/10 to-transparent px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            >
              <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-center gap-2 md:gap-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#f9bc60]/25 flex items-center justify-center">
                  <LucideIcons.Share className="text-[#f9bc60]" size="sm" />
                </div>
                <span className="md:hidden text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
                  Рекомендуем
                </span>
                <span className="hidden md:inline-block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
                  Рекомендуем
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-[#fffffe]">
                  Привяжите соцсети — они будут видны в «Героях»
                </p>
                <p className="text-xs sm:text-sm text-[#ffd499] mt-1">
                  VK, Telegram или YouTube будут отображаться рядом с вашим профилем на странице героев.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/profile?settings=socials"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f9bc60] text-[#001e1d] text-xs sm:text-sm font-semibold hover:bg-[#e8a545] transition-colors w-full md:w-auto justify-center"
                >
                  <LucideIcons.User size="xs" />
                  Привязать соцсети
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
