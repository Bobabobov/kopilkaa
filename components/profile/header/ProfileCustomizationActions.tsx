"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileCustomizationActionsProps {
  onOpenCover?: () => void;
  onTriggerAvatar?: () => void;
  onOpenSettings?: () => void;
}

const actions = [
  {
    key: "cover",
    title: "Обложка",
    icon: "Image" as const,
  },
  {
    key: "avatar",
    title: "Аватар",
    icon: "Upload" as const,
  },
  {
    key: "settings",
    title: "Профиль",
    icon: "Settings" as const,
  },
];

export function ProfileCustomizationActions({
  onOpenCover,
  onTriggerAvatar,
  onOpenSettings,
}: ProfileCustomizationActionsProps) {
  const handlers = {
    cover: onOpenCover,
    avatar: onTriggerAvatar,
    settings: onOpenSettings,
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {actions.map((action, index) => {
        const Icon = LucideIcons[action.icon];
        const onClick = handlers[action.key as keyof typeof handlers];

        return (
          <motion.button
            key={action.key}
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.04 * index }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#abd1c6]/20 bg-[#001e1d]/55 px-2.5 py-1.5 text-xs font-medium text-[#abd1c6] shadow-sm backdrop-blur-sm transition-colors hover:border-[#f9bc60]/35 hover:bg-[#004643]/70 hover:text-[#fffffe] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#f9bc60]" />
            <span>{action.title}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
