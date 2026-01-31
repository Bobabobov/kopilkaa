import { motion } from "framer-motion";

interface CustomAmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomAmountInput({
  value,
  onChange,
}: CustomAmountInputProps) {
  return (
    <div className="mb-5 sm:mb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <label
          className="block text-sm sm:text-base font-medium mb-2.5"
          style={{ color: "#abd1c6" }}
        >
          Или введите свою сумму
        </label>
        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
  );
}
