import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface GuestActionsMenuProps {
  isOpen: boolean;
  style: { top: number; right: number };
  onClose: () => void;
  onReport: () => void;
}

export function GuestActionsMenu({ isOpen, style, onClose, onReport }: GuestActionsMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-menu="guest"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed z-[99999] w-44 sm:w-48 md:w-56 rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl shadow-xl p-2 space-y-1"
        style={{
          top: `${style.top}px`,
          right: `${style.right}px`,
        }}
        onMouseLeave={onClose}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => {
            onReport();
            onClose();
          }}
          className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all duration-200"
        >
          <LucideIcons.Flag size="sm" className="text-red-400" />
          Пожаловаться
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
