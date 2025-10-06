// components/profile/OtherUserCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getAvatarFrame } from "@/lib/header-customization";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
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
  return (
    <div className="lg:col-span-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 hover:shadow-3xl transition-all duration-500 group"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>

        <div className="relative z-10">
          {/* Аватар */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
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
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {user.name || "Пользователь"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {!user.hideEmail ? user.email : "Email скрыт"}
            </motion.p>
          </motion.div>

          {/* Информация */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            <div className="group/info bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm group-hover/info:text-emerald-600 dark:group-hover/info:text-emerald-400 transition-colors">
                  Дата регистрации:
                </span>
                <span className="text-gray-900 dark:text-white font-semibold text-sm group-hover/info:text-emerald-700 dark:group-hover/info:text-emerald-300 transition-colors">
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Действия с дружбой */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {!friendship && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onSendFriendRequest}
                className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg transition-all duration-200 border border-emerald-200 dark:border-emerald-700/30 hover:border-emerald-300 dark:hover:border-emerald-600/50"
              >
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center bg-lime-50 dark:bg-lime-900/20 p-3 rounded-xl">
                    Пользователь отправил вам заявку в друзья
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onAcceptFriendRequest}
                      className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-all duration-200 text-sm font-medium border border-emerald-200 dark:border-emerald-700/30 hover:border-emerald-300 dark:hover:border-emerald-600/50"
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
                      className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/50"
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
                <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300">
                  Заявка отправлена
                </div>
              )}

            {friendship && friendship.status === "ACCEPTED" && (
              <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                ✓ Друзья
              </div>
            )}

            {friendship && friendship.status === "DECLINED" && (
              <div className="w-full text-center px-4 py-3 rounded-2xl text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                Заявка отклонена
              </div>
            )}

            {/* Быстрые действия */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
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
                    className="group px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 text-center text-sm font-medium block border border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/50"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
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
                    className="group px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 text-center text-sm font-medium block border border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/50"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
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
    </div>
  );
}
