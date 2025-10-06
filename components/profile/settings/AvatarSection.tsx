"use client";

import { motion } from "framer-motion";
import AvatarUpload from "@/components/profile/AvatarUpload";

interface AvatarSectionProps {
  currentAvatar: string | null;
  userName: string;
  avatarFrame?: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
  onFrameChange?: (frame: string) => void;
}

export default function AvatarSection({
  currentAvatar,
  userName,
  avatarFrame,
  onAvatarChange,
  onFrameChange,
}: AvatarSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-1"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Аватарка
        </h2>
        <div className="text-center">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={userName}
            avatarFrame={avatarFrame}
            onAvatarChange={onAvatarChange}
            onFrameChange={onFrameChange}
          />
        </div>
      </div>
    </motion.div>
  );
}
