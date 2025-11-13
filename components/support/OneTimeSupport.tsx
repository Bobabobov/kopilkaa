"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface OneTimeSupportProps {
  customAmount: string;
  onAmountChange: (amount: string) => void;
}

const predefinedAmounts = [100, 300, 500, 1000, 2000, 5000];

export default function OneTimeSupport({ customAmount, onAmountChange }: OneTimeSupportProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Разовая поддержка
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#abd1c6" }}>
            Поддержи проект любой удобной суммой. Каждый рубль идёт на помощь авторам историй.
          </p>
        </motion.div>

        <div className="bg-[#004643]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: "#fffffe" }}>
            Выберите сумму поддержки
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {predefinedAmounts.map((amount, index) => (
              <motion.button
                key={amount}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAmountChange(amount.toString())}
                className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  customAmount === amount.toString()
                    ? "shadow-xl"
                    : "hover:shadow-lg"
                }`}
                style={{
                  backgroundColor: customAmount === amount.toString() ? "#f9bc60" : "#004643",
                  color: customAmount === amount.toString() ? "#001e1d" : "#abd1c6",
                  border: customAmount === amount.toString() ? "none" : "2px solid #abd1c6",
                }}
              >
                ₽{amount.toLocaleString()}
              </motion.button>
            ))}
          </div>

          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-lg font-semibold mb-4" style={{ color: "#abd1c6" }}>
                Или введите свою сумму
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-[#004643]/50 border-2 border-[#abd1c6]/30 rounded-2xl px-6 py-4 text-xl font-semibold placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-all duration-300"
                  style={{ color: "#fffffe" }}
                />
                <span 
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl font-semibold"
                  style={{ color: "#abd1c6" }}
                >
                  ₽
                </span>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!customAmount || parseInt(customAmount) <= 0}
            className="w-full py-4 rounded-2xl font-bold text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            style={{
              background: customAmount && parseInt(customAmount) > 0 
                ? "linear-gradient(135deg, #f9bc60 0%, #e16162 100%)" 
                : "#004643",
              color: customAmount && parseInt(customAmount) > 0 ? "#001e1d" : "#abd1c6",
              border: customAmount && parseInt(customAmount) > 0 ? "none" : "2px solid #abd1c6",
            }}
          >
            <LucideIcons.Heart className="w-6 h-6 inline mr-2" />
            {customAmount && parseInt(customAmount) > 0 
              ? `Поддержать на ₽${parseInt(customAmount).toLocaleString()}`
              : "Введите сумму поддержки"
            }
          </motion.button>
        </div>
      </div>
    </section>
  );
}
