import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface OwnerActionsMenuProps {
  isOpen: boolean;
  style: { top: number; right: number };
  onClose: () => void;
  onOpenSettings?: () => void;
  onOpenCover?: () => void;
  onTriggerAvatar?: () => void;
}

export function OwnerActionsMenu({
  isOpen,
  style,
  onClose,
  onOpenSettings,
  onOpenCover,
  onTriggerAvatar,
}: OwnerActionsMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-menu="actions"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed z-[99999] w-48 sm:w-52 md:w-60 rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl shadow-xl p-2 space-y-1"
        style={{
          top: `${style.top}px`,
          right: `${style.right}px`,
        }}
        onMouseLeave={onClose}
      >
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onOpenSettings?.();
            onClose();
          }}
          className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
        >
          <LucideIcons.Settings size="sm" className="text-white/70" />
          Редактировать
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onOpenCover?.();
            onClose();
          }}
          className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
        >
          <LucideIcons.Image size="sm" className="text-white/70" />
          Изменить обложку
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            onTriggerAvatar?.();
            onClose();
          }}
          className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
        >
          <LucideIcons.Upload size="sm" className="text-white/70" />
          Изменить аватар
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          disabled
          title="Скоро"
          className="w-full inline-flex items-center gap-2.5 rounded-lg px-4 py-2 text-sm font-medium text-red-400/60 bg-transparent opacity-60 cursor-not-allowed"
        >
          <LucideIcons.Trash size="sm" className="text-red-400" />
          Удалить (скоро)
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
