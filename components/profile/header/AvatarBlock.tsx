"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AvatarUpload from "../AvatarUpload";
import type { UserStatus } from "../hooks/useUserStatus";

const DEFAULT_AVATAR = "/default-avatar.png";

type AvatarUser = {
  name?: string | null;
  email: string | null;
  hideEmail?: boolean;
  avatar?: string | null;
};

interface AvatarBlockProps {
  isOwner: boolean;
  user: AvatarUser;
  currentAvatar: string | null;
  status: UserStatus;
  onAvatarChange?: (val: string | null) => void;
  onOpenCover?: () => void;
  onTriggerAvatar?: () => void;
}

export function AvatarBlock({
  isOwner,
  user,
  currentAvatar,
  status,
  onAvatarChange,
  onOpenCover,
  onTriggerAvatar,
}: AvatarBlockProps) {
  const [avatarSrc, setAvatarSrc] = useState(
    user.avatar || DEFAULT_AVATAR,
  );
  // Сбрасываем аватар только при переходе на другого пользователя (user.id).
  // Иначе при ре-рендере затирается fallback на default после 404.
  useEffect(() => {
    setAvatarSrc(user.avatar || DEFAULT_AVATAR);
  }, [user.id]);

  const statusLabel =
    status.status === "online"
      ? status.text
      : status.text.startsWith("Никогда")
        ? status.text
        : `Был(а) ${status.text}`;

  if (isOwner) {
    return (
      <div className="flex-shrink-0">
        <div className="relative -mt-16 sm:-mt-20 md:-mt-24 transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:shadow-none hover:brightness-100 [&_*]:transition-none [&_*]:duration-0 [&_*]:transform-none [&_*:hover]:transform-none">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={
              user.name ||
              (!user.hideEmail && user.email ? user.email : "Пользователь")
            }
            onAvatarChange={onAvatarChange || (() => {})}
          />
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-white">
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
            }`}
          />
          <span className="text-white/90">{statusLabel}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCover}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-200"
            title="Изменить обложку"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h3l2-3h6l2 3h3v12H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span>Обложка</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTriggerAvatar}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-200"
            title="Изменить аватар"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Аватар</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <div className="relative -mt-16 sm:-mt-20 md:-mt-24 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-lg transition-none duration-0 transform-none hover:transform-none hover:scale-100">
        <img
          src={avatarSrc}
          alt=""
          className="w-full h-full object-cover transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:brightness-100"
          onError={() => setAvatarSrc(DEFAULT_AVATAR)}
        />
        <span
          className={`absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
            status.status === "online" ? "bg-emerald-400" : "bg-slate-500"
          }`}
          aria-label={status.status === "online" ? "Онлайн" : "Оффлайн"}
          title={status.status === "online" ? "Онлайн" : "Оффлайн"}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-white">
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
          }`}
        />
        <span className="text-white/90">{statusLabel}</span>
      </div>
    </div>
  );
}
