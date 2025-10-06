"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LikesModal from "./LikesModal";

interface LikeData {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    avatarFrame: string | null;
  };
  application: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
  };
  createdAt: string;
}

export default function ProfileLikesSection() {
  const [likes, setLikes] = useState<LikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch("/api/profile/my-story-likes");
        if (!response.ok) {
          throw new Error("Ошибка загрузки лайков");
        }
        const data = await response.json();
        setLikes(data.likes || []);
      } catch (err) {
        console.error("Error fetching likes:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20"
      >
        {/* Заголовок секции */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">❤️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Лайки ваших историй
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {likes.length}{" "}
                {likes.length === 1
                  ? "лайк"
                  : likes.length < 5
                    ? "лайка"
                    : "лайков"}
              </p>
            </div>
          </div>

          {likes.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors font-medium"
            >
              Все лайки →
            </button>
          )}
        </div>

        {/* Контент */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Загрузка...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ошибка загрузки
            </p>
          </div>
        ) : likes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-3xl mb-3">💔</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Пока нет лайков
            </p>
            <Link
              href="/applications"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
            >
              Подать заявку
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {likes.slice(0, 3).map((like, index) => {
              if (!like.id || !like.id.trim()) return null;
              return (
                <motion.div
                  key={
                    like.id && like.id.trim()
                      ? like.id
                      : `profile-like-${index}`
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/10 dark:to-red-900/10 rounded-xl p-4 border border-pink-200 dark:border-pink-700/30 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Аватар */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {like.user.avatar ? (
                        <img
                          src={like.user.avatar}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {(like.user.name ||
                            like.user.email.split("@")[0])[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/profile/${like.user.id}`}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors truncate"
                        >
                          {like.user.name || like.user.email.split("@")[0]}
                        </Link>
                        <span className="text-pink-500 text-xs">❤️</span>
                      </div>

                      <Link
                        href={`/stories/${like.application.id}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors truncate mb-1">
                          {like.application.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {like.application.summary}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(like.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                        <Link
                          href={`/stories/${like.application.id}`}
                          className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                        >
                          Читать →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {likes.length > 3 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  И еще {likes.length - 3} лайков...
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Модальное окно */}
      <LikesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
