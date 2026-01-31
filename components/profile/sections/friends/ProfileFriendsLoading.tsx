import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function ProfileFriendsLoading() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <LucideIcons.Loader2
          className="text-[#abd1c6] mx-auto mb-2"
          size="lg"
        />
      </motion.div>
      <p className="text-sm text-[#abd1c6]">Загрузка...</p>
    </motion.div>
  );
}
