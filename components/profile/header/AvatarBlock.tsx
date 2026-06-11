"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AvatarUpload from "../AvatarUpload";
import type { UserStatus } from "../hooks/useUserStatus";
import { needsNoReferrerAvatar, resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
const DEFAULT_AVATAR = "/default-avatar.png";

type AvatarUser = {
  id: string;
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
}

export function AvatarBlock({
  isOwner,
  user,
  currentAvatar,
  status,
  onAvatarChange,
}: AvatarBlockProps) {
  const [avatarSrc, setAvatarSrc] = useState(
    resolveAvatarUrl(user.avatar || DEFAULT_AVATAR),
  );
  const [avatarFailed, setAvatarFailed] = useState(false);
  useEffect(() => {
    setAvatarSrc(resolveAvatarUrl(user.avatar || DEFAULT_AVATAR));
    setAvatarFailed(false);
  }, [user.id, user.avatar]);

  const resolvedAvatar = buildUploadUrl(
    avatarFailed ? DEFAULT_AVATAR : avatarSrc || DEFAULT_AVATAR,
    { variant: "thumb" },
  );
  const shouldBypassOptimization =
    isUploadUrl(resolvedAvatar) || isExternalUrl(resolvedAvatar);

  const statusLabel =
    status.status === "online"
      ? status.text
      : status.text.startsWith("Никогда")
        ? status.text
        : `Был(а) ${status.text}`;

  if (isOwner) {
    return (
      <div className="flex-shrink-0">
        <div className="relative -mt-12 xs:-mt-14 sm:-mt-20 md:-mt-24 transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:shadow-none hover:brightness-100 [&_*]:transition-none [&_*]:duration-0 [&_*]:transform-none [&_*:hover]:transform-none">
          <AvatarUpload
            currentAvatar={currentAvatar}
            userName={
              user.name ||
              (!user.hideEmail && user.email ? user.email : "Пользователь")
            }
            onAvatarChange={onAvatarChange || (() => {})}
          />
        </div>
        <div className="mt-1.5 xs:mt-2 flex items-center gap-2 text-xs xs:text-sm text-white min-w-0">
          <span
            className={`w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full flex-shrink-0 ${
              status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
            }`}
          />
          <span className="text-white/90 truncate">{statusLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <div className="relative -mt-12 xs:-mt-14 sm:-mt-20 md:-mt-24 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 xs:border-4 border-white/90 shadow-lg transition-none duration-0 transform-none hover:transform-none hover:scale-100">
        <Image
          src={resolvedAvatar}
          alt=""
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className="object-cover transition-none duration-0 transform-none hover:transform-none hover:scale-100 hover:brightness-100"
          unoptimized={shouldBypassOptimization}
          referrerPolicy={
            needsNoReferrerAvatar(user.avatar) ? "no-referrer" : undefined
          }
          onError={() => setAvatarFailed(true)}
        />
        <span
          className={`absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
            status.status === "online" ? "bg-emerald-400" : "bg-slate-500"
          }`}
          aria-label={status.status === "online" ? "Онлайн" : "Оффлайн"}
          title={status.status === "online" ? "Онлайн" : "Оффлайн"}
        />
      </div>
      <div className="mt-1.5 xs:mt-2 flex items-center gap-2 text-xs xs:text-sm text-white min-w-0">
        <span
          className={`w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full flex-shrink-0 ${
            status.status === "online" ? "bg-emerald-400" : "bg-slate-400"
          }`}
        />
        <span className="text-white/90 truncate">{statusLabel}</span>
      </div>
    </div>
  );
}
