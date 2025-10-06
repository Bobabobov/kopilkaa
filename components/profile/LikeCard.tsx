"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getAvatarFrame } from "@/lib/header-customization";
import Link from "next/link";

interface LikeCardProps {
  like: {
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
      avatarFrame: string | null;
      hideEmail?: boolean;
    };
    application: {
      id: string;
      title: string;
      summary: string;
      createdAt: string;
    };
    createdAt: string;
  };
  index: number;
}

export default function LikeCard({ like, index }: LikeCardProps) {
  const frame = getAvatarFrame(like.user.avatarFrame || "none");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-start gap-6">
          {/* Аватар пользователя */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const frame = getAvatarFrame(like.user.avatarFrame || "none");

              if (frame.type === "image") {
                // Рамка-картинка
                return (
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative shadow-lg">
                    {/* Рамка как фон */}
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                      style={{
                        backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                      }}
                    />
                    {/* Аватар поверх рамки */}
                    <div className="absolute inset-2 rounded-md overflow-hidden">
                      {like.user.avatar ? (
                        <img
                          src={like.user.avatar}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl">
                          {(like.user.name ||
                            (!like.user.hideEmail
                              ? like.user.email
                              : "Пользователь"))[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // CSS рамка или без рамки
                return (
                  <div
                    className={`w-16 h-16 rounded-lg overflow-hidden relative shadow-lg ${frame.className}`}
                  >
                    {like.user.avatar ? (
                      <img
                        src={like.user.avatar}
                        alt="Аватар"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl">
                        {(like.user.name ||
                          (!like.user.hideEmail
                            ? like.user.email
                            : "Пользователь"))[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              }
            })()}
          </motion.div>

          {/* Информация о лайке */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Link
                  href={`/profile/${like.user.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {like.user.name ||
                    (!like.user.hideEmail
                      ? like.user.email.split("@")[0]
                      : "Пользователь")}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <LucideIcons.Heart size="sm" className="text-pink-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Лайкнул вашу историю
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <LucideIcons.Calendar size="sm" />
                  <span>
                    {new Date(like.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
            </div>

            {/* История */}
            <Link
              href={`/stories/${like.application.id}`}
              className="block group"
            >
              <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/10 dark:to-red-900/10 rounded-xl p-4 border border-pink-200 dark:border-pink-700/30 group-hover:from-pink-100 group-hover:to-red-100 dark:group-hover:from-pink-900/20 dark:group-hover:to-red-900/20 transition-all duration-300">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {like.application.title}
                </h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {like.application.summary}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-pink-600 dark:text-pink-400">
                  <LucideIcons.ArrowRight size="sm" />
                  <span>Читать историю</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
