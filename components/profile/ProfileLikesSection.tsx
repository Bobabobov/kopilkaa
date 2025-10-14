"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import LikesModal from "./LikesModal";
import { LucideIcons } from "@/components/ui/LucideIcons";

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
  const [lastReadLikeId, setLastReadLikeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch("/api/profile/my-story-likes");
        if (!response.ok) {
          throw new Error("Ошибка загрузки лайков");
        }
        const data = await response.json();
        const newLikes = data.likes || [];
        setLikes(newLikes);
        
        // Загружаем последний прочитанный лайк из localStorage
        const savedLastRead = localStorage.getItem('lastReadLikeId');
        setLastReadLikeId(savedLastRead);
        
      } catch (err) {
        console.error("Error fetching likes:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  // Определяем количество новых лайков
  const getNewLikesCount = () => {
    if (!lastReadLikeId || likes.length === 0) return likes.length;
    
    // Находим индекс последнего прочитанного лайка
    const lastReadIndex = likes.findIndex(like => like.id === lastReadLikeId);
    
    // Если не найден или это первый лайк, считаем все как новые
    if (lastReadIndex === -1) return likes.length;
    
    // Возвращаем количество лайков после последнего прочитанного
    return lastReadIndex;
  };

  const newLikesCount = getNewLikesCount();

  // Отмечаем лайки как прочитанные при открытии модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Сохраняем ID последнего лайка как прочитанный
    if (likes.length > 0) {
      const latestLikeId = likes[0].id;
      setLastReadLikeId(latestLikeId);
      localStorage.setItem('lastReadLikeId', latestLikeId);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#004643]/30 backdrop-blur-sm rounded-3xl p-6 border border-[#abd1c6]/20"
      >
        {/* Заголовок секции */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                newLikesCount > 0 
                  ? "bg-red-500/20 animate-pulse shadow-lg shadow-red-500/30" 
                  : "bg-[#f9bc60]/20"
              }`}>
                <LucideIcons.Heart 
                  className={`transition-all duration-300 ${
                    newLikesCount > 0 
                      ? "text-red-500 drop-shadow-lg heart-notification" 
                      : "text-[#f9bc60]"
                  }`} 
                  size="sm" 
                />
              </div>
              
              {/* Уведомление о количестве новых лайков */}
              {newLikesCount > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce shadow-lg border-2 border-white">
                  {newLikesCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#fffffe]">
                Лайки ваших историй
              </h3>
              <p className="text-sm text-[#abd1c6]">
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
              onClick={handleOpenModal}
              className="text-sm text-[#f9bc60] hover:text-[#e8a545] transition-colors font-medium flex items-center gap-1"
            >
              Все лайки
              <LucideIcons.ArrowRight size="sm" />
            </button>
          )}
        </div>

        {/* Контент */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Loader2 className="text-[#abd1c6] animate-spin" size="lg" />
            </div>
            <p className="text-sm text-[#abd1c6]">
              Загрузка...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <LucideIcons.Alert className="text-red-500" size="lg" />
            </div>
            <p className="text-sm text-[#abd1c6]">
              Ошибка загрузки
            </p>
          </div>
        ) : likes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#abd1c6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcons.Heart className="text-[#abd1c6]" size="xl" />
            </div>
            <p className="text-sm text-[#abd1c6] mb-4">
              Пока нет лайков
            </p>
            <Link
              href="/applications"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-xl transition-colors text-sm font-semibold"
            >
              <LucideIcons.Plus size="sm" />
              Подать заявку
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {likes.slice(0, 1).map((like, index) => {
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
                  className="bg-[#001e1d]/40 rounded-2xl p-4 border border-[#abd1c6]/10 hover:border-[#f9bc60]/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Аватар */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#004643] flex items-center justify-center text-[#abd1c6] font-bold text-sm border border-[#abd1c6]/20 flex-shrink-0">
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

                    {/* Контент */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-[#fffffe] text-sm truncate">
                          {like.user.name || like.user.email.split("@")[0]}
                        </h4>
                        <span className="text-[#abd1c6] text-xs flex-shrink-0">
                          {new Date(like.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <p className="text-[#abd1c6] text-xs line-clamp-2">
                        Лайкнул историю: "{like.application.title}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Модальное окно с лайками */}
      <LikesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}