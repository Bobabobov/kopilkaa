// components/profile/OtherUserCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAvatarFrame } from "@/lib/header-customization";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import ReportUserModal from "./modals/ReportUserModal";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

interface Friendship {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
}

interface OtherUserCardProps {
  user: User;
  friendship: Friendship | null;
  currentUserId: string | null;
  onSendFriendRequest: () => void;
  onAcceptFriendRequest: () => void;
  onDeclineFriendRequest: () => void;
}

export default function OtherUserCard({
  user,
  friendship,
  currentUserId,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
}: OtherUserCardProps) {
  const router = useRouter();
  const { showToast, confirm } = useBeautifulNotifications();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-7 shadow-2xl border border-[#abd1c6]/20 hover:shadow-3xl hover:border-[#abd1c6]/30 transition-all duration-500 group sticky top-6"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <div className="relative z-10">
          {/* Аватар */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-5 sm:mb-6"
          >
            <div className="relative inline-block group/avatar">
              {(() => {
                const frame = getAvatarFrame(user.avatarFrame || "none");
                const frameKey = user.avatarFrame || "none";

                if (frame.type === "image") {
                  // Рамка-картинка
                  return (
                    <div className="w-24 h-24 rounded-lg mx-auto mb-4 overflow-hidden relative group-hover/avatar:scale-105 transition-transform duration-300">
                      {/* Рамка как фон */}
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                        style={{
                          backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                        }}
                      />
                      {/* Аватар поверх рамки */}
                      <div className="absolute inset-2 rounded-md overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Аватар"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl">
                            {user.name
                              ? user.name[0].toUpperCase()
                              : user.email[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  // CSS рамка (only 'none' remains now)
                  return (
                    <div
                      className={`w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-2xl mx-auto mb-4 group-hover/avatar:scale-105 transition-transform duration-300 ${frame.className} ${
                        user.avatar
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
                      }`}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Аватар"
                          className={`w-full h-full object-cover rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                        >
                          {user.name
                            ? user.name[0].toUpperCase()
                            : user.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                }
              })()}
              {/* Декоративное кольцо - только когда нет аватарки */}
              {!user.avatar && (
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-sm group-hover/avatar:scale-110 transition-transform duration-500 -z-10"></div>
              )}
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-[#fffffe] mb-2"
            >
              {user.name || "Пользователь"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[#abd1c6]"
            >
              {!user.hideEmail ? user.email : "Email скрыт"}
            </motion.p>
            {(user.vkLink || user.telegramLink || user.youtubeLink) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-4 w-full"
              >
                <p className="text-xs uppercase tracking-wide text-center text-[#abd1c6]/70 mb-2">
                  Соц сети
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {user.vkLink && (
                    <a
                      href={user.vkLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                      aria-label="VK"
                    >
                      <VKIcon className="w-4 h-4" />
                      <span>VK</span>
                    </a>
                  )}
                  {user.telegramLink && (
                    <a
                      href={user.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                      aria-label="Telegram"
                    >
                      <TelegramIcon className="w-4 h-4" />
                      <span>Telegram</span>
                    </a>
                  )}
                  {user.youtubeLink && (
                    <a
                      href={user.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                      aria-label="YouTube"
                    >
                      <YouTubeIcon className="w-4 h-4" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Информация */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="space-y-3 mb-5 sm:mb-6"
          >
            <div className="group/info bg-[#001e1d]/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-[#001e1d]/40 transition-all duration-300 border border-[#abd1c6]/10 hover:border-[#abd1c6]/20">
              <div className="flex justify-between items-center">
                <span className="text-[#abd1c6] text-sm">
                  Дата регистрации:
                </span>
                <span className="text-[#fffffe] font-semibold text-sm">
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Действия с дружбой */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-3"
          >
            {!friendship && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onSendFriendRequest}
                className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                Добавить в друзья
              </motion.button>
            )}

            {friendship &&
              friendship.status === "PENDING" &&
              friendship.requesterId !== currentUserId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <p className="text-[#abd1c6] text-sm text-center bg-[#001e1d]/30 p-3 rounded-xl border border-[#abd1c6]/10">
                    Пользователь отправил вам заявку в друзья
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onAcceptFriendRequest}
                      className="flex-1 px-3 py-2 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] rounded-lg transition-colors text-sm font-medium"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Принять
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onDeclineFriendRequest}
                      className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Отклонить
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

            {friendship &&
              friendship.status === "PENDING" &&
              friendship.requesterId === currentUserId && (
                <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-[#f9bc60]/10 text-[#f9bc60]">
                  Заявка отправлена
                </div>
              )}

            {friendship && friendship.status === "ACCEPTED" && (
              <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-[#10B981]/20 text-[#10B981]">
                ✓ Друзья
              </div>
            )}

            {friendship && friendship.status === "DECLINED" && (
              <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-red-500/20 text-red-400">
                Заявка отклонена
              </div>
            )}

            {/* Доп. действия — встроены в карточку */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#abd1c6]/20">
              {friendship && (
                <button
                  onClick={async () => {
                    if (!friendship?.id) return;
                    const agree = await confirm(
                      "Удалить этого пользователя из друзей?",
                      "Удаление из друзей",
                    );
                    if (!agree) return;
                    try {
                      const res = await fetch(`/api/profile/friends/${friendship.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) {
                        showToast("success", "Пользователь удалён из друзей");
                        router.refresh();
                      } else {
                        const e = await res.json().catch(() => ({} as any));
                        showToast(
                          "error",
                          "Не удалось удалить",
                          e.message || "Попробуйте ещё раз позднее",
                        );
                      }
                    } catch {
                      showToast(
                        "error",
                        "Не удалось удалить",
                        "Попробуйте ещё раз позднее",
                      );
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Удалить из друзей
                </button>
              )}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-full px-4 py-3 rounded-xl bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 border border-[#f9bc60]/30 hover:border-[#f9bc60]/50 text-[#f9bc60] font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f9bc60]/20 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Пожаловаться
              </button>
            </div>

            {/* Быстрые действия */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="pt-3 sm:pt-4 border-t border-[#abd1c6]/20"
            >
              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Открываем модальное окно друзей с вкладкой поиска
                      const event = new CustomEvent("open-friends-modal", {
                        detail: { tab: "search" },
                      });
                      window.dispatchEvent(event);
                    }}
                    className="group px-3 py-2 bg-[#001e1d]/30 hover:bg-[#001e1d]/40 text-[#abd1c6] rounded-lg transition-all duration-200 text-center text-sm font-medium block border border-[#abd1c6]/10"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Поиск друзей
                    </div>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link
                    href="/profile"
                    className="group px-3 py-2 bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 text-[#f9bc60] rounded-lg transition-all duration-200 text-center text-sm font-semibold block border border-[#f9bc60]/20"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Мой профиль
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Модальное окно жалобы */}
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
}
