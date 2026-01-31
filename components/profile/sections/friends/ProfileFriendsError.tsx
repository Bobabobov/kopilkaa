import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsErrorProps {
  onRetry: () => void;
}

export function ProfileFriendsError({ onRetry }: ProfileFriendsErrorProps) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-8"
    >
      <LucideIcons.AlertTriangle
        className="text-red-400 mx-auto mb-2"
        size="lg"
      />
      <p className="text-sm text-[#abd1c6] mb-2">Ошибка загрузки</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="text-xs text-[#f9bc60] hover:text-[#e8a545] transition-colors"
      >
        Попробовать еще раз
      </motion.button>
    </motion.div>
  );
}
