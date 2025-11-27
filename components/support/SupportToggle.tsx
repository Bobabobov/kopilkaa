"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface SupportToggleProps {
  isSubscription: boolean;
  onToggle: (isSubscription: boolean) => void;
}

export default function SupportToggle({ isSubscription, onToggle }: SupportToggleProps) {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto flex justify-center">
        <div className="bg-[#004643]/50 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(true)}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              isSubscription
                ? "text-[#001e1d] shadow-lg"
                : "hover:bg-[#004643]/30"
            }`}
            style={{
              backgroundColor: isSubscription ? "#f9bc60" : "transparent",
              color: isSubscription ? "#001e1d" : "#abd1c6",
            }}
          >
            <LucideIcons.Heart className="w-5 h-5 inline mr-2" />
            Ежемесячная поддержка
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(false)}
            className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
              !isSubscription
                ? "text-[#001e1d] shadow-lg"
                : "hover:bg-[#004643]/30"
            }`}
            style={{
              backgroundColor: !isSubscription ? "#f9bc60" : "transparent",
              color: !isSubscription ? "#001e1d" : "#abd1c6",
            }}
          >
            <LucideIcons.Zap className="w-5 h-5 inline mr-2" />
            Разовая поддержка
          </motion.button>
        </div>
      </div>
    </section>
  );
}
















