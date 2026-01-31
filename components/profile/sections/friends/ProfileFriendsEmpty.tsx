import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsEmptyProps {
  onFindFriends: () => void;
}

export function ProfileFriendsEmpty({
  onFindFriends,
}: ProfileFriendsEmptyProps) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <LucideIcons.UserPlus
          className="text-[#abd1c6] mx-auto mb-3"
          size="2xl"
        />
      </motion.div>
      <p className="text-base text-[#fffffe] mb-2 font-medium">
        Пока нет друзей
      </p>
      <p className="text-sm text-[#abd1c6] mb-4">
        Найдите интересных людей и заводите новые знакомства
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onFindFriends}
        className="px-6 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-xl transition-colors text-sm font-medium"
      >
        Найти друзей
      </motion.button>
    </motion.div>
  );
}
