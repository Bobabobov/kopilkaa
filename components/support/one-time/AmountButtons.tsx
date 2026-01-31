import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AmountButtonsProps {
  amounts: number[];
  selectedAmount: string;
  onAmountChange: (amount: string) => void;
}

export function AmountButtons({
  amounts,
  selectedAmount,
  onAmountChange,
}: AmountButtonsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 sm:mb-6">
      {amounts.map((amount, index) => {
        const isSelected = selectedAmount === amount.toString();
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
              isSelected
                ? "shadow-lg ring-2 ring-[#f9bc60]/50"
                : "hover:border-[#abd1c6]/40"
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
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
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
                <div className="text-xs opacity-70 font-normal mt-1">
                  Вклад
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
