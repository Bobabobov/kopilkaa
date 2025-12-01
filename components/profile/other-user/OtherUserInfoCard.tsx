"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { getHeaderTheme } from "@/lib/header-customization";
import { getAvatarFrame } from "@/lib/header-customization";
import { 
  getTextColorForBackground, 
  getSecondaryTextColorForBackground,
  getOverlayOpacity 
} from "@/lib/color-utils";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string | null;
}

interface OtherUserInfoCardProps {
  user: User;
  friendship: {
    id: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
    requesterId: string;
    receiverId: string;
  } | null;
  currentUserId: string | null;
  currentUserRole?: "USER" | "ADMIN" | null;
  onSendFriendRequest: () => void;
  onAcceptFriendRequest: () => void;
  onDeclineFriendRequest: () => void;
  onRemoveFriend?: () => void;
}

function OtherUserInfoCard({
  user,
  friendship,
  currentUserId,
  currentUserRole,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onRemoveFriend,
}: OtherUserInfoCardProps) {
  const theme = getHeaderTheme(user.headerTheme || "default");
  
  // Определяем цвета для цветного фона
  const isColorTheme = theme.background === "color";
  const backgroundColor = isColorTheme ? (theme as any).color : null;
  const textColor = backgroundColor ? getTextColorForBackground(backgroundColor) : "#fffffe";
  const secondaryTextColor = backgroundColor ? getSecondaryTextColorForBackground(backgroundColor) : "#abd1c6";
  const overlayOpacity = backgroundColor ? getOverlayOpacity(backgroundColor) : 0;

  // Определяем статус пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };

    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes <= 5) {
      return { status: "online", text: "Онлайн" };
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 1)
      return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24)
      return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString("ru-RU") };
  };

  const status = getUserStatus(user.lastSeen || null);
  const frame = getAvatarFrame(user.avatarFrame || "none");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl ${
        theme.background === "gradient"
          ? `bg-gradient-to-br ${(theme as any).gradient} border border-[#abd1c6]/20`
          : theme.background === "color"
          ? ""
          : "border border-[#abd1c6]/20"
      }`}
      style={{
        ...(theme.background === "image"
          ? {
              backgroundImage: `url(${(theme as any).image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : theme.background === "color"
          ? {
              backgroundColor: (theme as any).color || "#004643",
              borderColor: backgroundColor ? `${backgroundColor}40` : undefined,
            }
          : {}),
      }}
    >
      {/* Декоративные градиентные круги */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f9bc60]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#e16162]/10 rounded-full blur-3xl"></div>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(171, 209, 198, 0.08) 0%, rgba(171, 209, 198, 0.04) 50%, transparent 100%)"
        }}
      ></div>
      
      {/* Декоративные линии */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent"></div>
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-[#abd1c6]/30 to-transparent"></div>
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-[#abd1c6]/30 to-transparent"></div>

      {/* Затемнение для читаемости текста */}
      {theme.background !== "color" ? (
        <div className="absolute inset-0 bg-[#004643]/80 backdrop-blur-sm"></div>
      ) : overlayOpacity > 0 ? (
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{ 
            backgroundColor: isColorTheme && backgroundColor 
              ? `rgba(0, 30, 29, ${overlayOpacity})` 
              : "transparent" 
          }}
        ></div>
      ) : null}

      <div className="relative z-10">
        {/* Аватар и основная информация */}
        <div className="text-center p-3 sm:p-5 md:p-6 pb-3 sm:pb-4">
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="relative">
              {frame.type === "image" ? (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg mx-auto overflow-hidden relative">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                    style={{
                      backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                    }}
                  />
                  <div className="absolute inset-2 rounded-md overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "Аватар"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl sm:text-2xl">
                        {user.name
                          ? user.name[0].toUpperCase()
                          : user.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ) : frame.type === "color" ? (
                <div 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg mx-auto overflow-hidden relative"
                  style={{
                    backgroundColor: (frame as any).color || "#004643",
                  }}
                >
                  <div className="absolute inset-2 rounded-md overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "Аватар"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl sm:text-2xl">
                        {user.name
                          ? user.name[0].toUpperCase()
                          : user.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-lg flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg ${frame.className} ${
                    user.avatar
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
                  }`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "Аватар"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-lg">
                      {user.name
                        ? user.name[0].toUpperCase()
                        : user.email[0].toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 
              className="text-lg sm:text-xl font-semibold"
              style={{ color: textColor }}
            >
              {user.name || "Пользователь"}
            </h2>
            {user.role === "ADMIN" && (
              currentUserRole === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <LucideIcons.Shield className="w-3 h-3" />
                  <span>ADMIN</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-[10px] sm:text-xs font-bold shadow-md">
                  <LucideIcons.Shield className="w-3 h-3" />
                  <span>ADMIN</span>
                </span>
              )
            )}
          </div>
          {!user.hideEmail && (
            <p 
              className="text-xs sm:text-sm mb-2 sm:mb-3 break-all px-2"
              style={{ color: secondaryTextColor }}
            >
              {user.email}
            </p>
          )}
          {user.hideEmail && (
            <p 
              className="text-xs sm:text-sm italic mb-2 sm:mb-3"
              style={{ color: `${secondaryTextColor}99` }}
            >
              Email скрыт
            </p>
          )}

              {/* Статус и дата регистрации */}
              <div 
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs mb-2 sm:mb-3"
                style={{ color: secondaryTextColor }}
              >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  status.status === "online"
                    ? "bg-[#abd1c6] animate-pulse"
                    : "bg-[#94a1b2]"
                }`}
              ></div>
              <span className="whitespace-nowrap">
                {status.status === "online" ? status.text : `Был ${status.text}`}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <LucideIcons.Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Социальные сети */}
          {(user.vkLink || user.telegramLink || user.youtubeLink) && (
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              {user.vkLink && (
                <a
                  href={user.vkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-xl border-2 border-[#0077FF]/50 bg-[#0077FF]/15 hover:bg-[#0077FF]/25 hover:border-[#0077FF]/70 transition-all shadow-lg shadow-[#0077FF]/20"
                  aria-label="VK"
                >
                  <VKIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0077FF]" />
                </a>
              )}
              {user.telegramLink && (
                <a
                  href={user.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-xl border-2 border-[#0088cc]/50 bg-[#0088cc]/15 hover:bg-[#0088cc]/25 hover:border-[#0088cc]/70 transition-all shadow-lg shadow-[#0088cc]/20"
                  aria-label="Telegram"
                >
                  <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0088cc]" />
                </a>
              )}
              {user.youtubeLink && (
                <a
                  href={user.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-xl border-2 border-[#FF0000]/50 bg-[#FF0000]/15 hover:bg-[#FF0000]/25 hover:border-[#FF0000]/70 transition-all shadow-lg shadow-[#FF0000]/20"
                  aria-label="YouTube"
                >
                  <YouTubeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000]" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Действия с дружбой */}
        <div 
          className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t pt-2 sm:pt-3"
          style={{ 
            borderColor: isColorTheme && backgroundColor 
              ? `${backgroundColor}20` 
              : "rgba(171, 209, 198, 0.1)" 
          }}
        >
          {!friendship && (
            <button
              onClick={onSendFriendRequest}
              className="w-full flex items-center justify-center gap-2 p-2.5 sm:p-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors text-sm"
            >
              <LucideIcons.UserPlus size="sm" />
              <span>Добавить в друзья</span>
            </button>
          )}

          {friendship &&
            friendship.status === "PENDING" &&
            friendship.requesterId !== currentUserId && (
              <div className="space-y-2">
                <p 
                  className="text-xs text-center mb-2"
                  style={{ color: secondaryTextColor }}
                >
                  Пользователь отправил вам заявку в друзья
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onAcceptFriendRequest}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] rounded-lg transition-colors text-xs sm:text-sm font-medium"
                  >
                    <LucideIcons.Check size="sm" />
                    Принять
                  </button>
                  <button
                    onClick={onDeclineFriendRequest}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                  >
                    <LucideIcons.X size="sm" />
                    Отклонить
                  </button>
                </div>
              </div>
            )}

          {friendship &&
            friendship.status === "PENDING" &&
            friendship.requesterId === currentUserId && (
              <div 
                className="w-full text-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-[#f9bc60]/10 border border-[#f9bc60]/20"
                style={{ color: textColor }}
              >
                Заявка отправлена
              </div>
            )}

          {friendship && friendship.status === "ACCEPTED" && (
            <div className="space-y-2">
              <div 
                className="w-full text-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-[#10B981]/20 border border-[#10B981]/30"
                style={{ color: textColor }}
              >
                ✓ Друзья
              </div>
              {onRemoveFriend && (
                <button
                  onClick={onRemoveFriend}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-xs sm:text-sm font-medium border border-red-500/20"
                >
                  <LucideIcons.UserMinus size="sm" />
                  <span>Удалить из друзей</span>
                </button>
              )}
            </div>
          )}

          {friendship && friendship.status === "DECLINED" && (
            <div 
              className="w-full text-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-red-500/20 border border-red-500/30"
              style={{ color: textColor }}
            >
              Заявка отклонена
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(OtherUserInfoCard);

