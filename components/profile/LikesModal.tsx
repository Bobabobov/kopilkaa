"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface LikeData {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    avatarFrame: string | null;
    lastSeen?: string | null;
  };
  application: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
  };
  createdAt: string;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LikesModal({ isOpen, onClose }: LikesModalProps) {
  const [likes, setLikes] = useState<LikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Автоскрытие скроллбаров
  useAutoHideScrollbar();

  // Локальные уведомления
  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  // Горячие клавиши и блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return;

    // Блокируем прокрутку фона
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Функция для показа локального уведомления
  const showLocalNotification = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    setLocalNotification({ show: true, type, title, message });
    setTimeout(() => {
      setLocalNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Функция для определения статуса пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Недавно" };

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor(
      (now.getTime() - lastSeenDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 5) return { status: "online", text: "Онлайн" };

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 1)
      return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24)
      return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return {
      status: "offline",
      text: lastSeenDate.toLocaleDateString("ru-RU"),
    };
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="likes-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="likes-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] border border-[#abd1c6]/30 mx-4 flex flex-col custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
                  <LucideIcons.Heart size="lg" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Лайки ваших историй
                  </h2>
                  <p className="text-[#abd1c6]">
                    {likes.length}{" "}
                    {likes.length === 1
                      ? "лайк"
                      : likes.length < 5
                        ? "лайка"
                        : "лайков"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <LucideIcons.X size="sm" className="text-[#fffffe]" />
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mt-4 p-3 bg-[#f9bc60] text-[#001e1d] rounded-lg text-sm font-medium shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#001e1d]/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">
                      {localNotification.type === "success"
                        ? "✅"
                        : localNotification.type === "error"
                          ? "❌"
                          : "ℹ️"}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold">{localNotification.title}</div>
                    <div className="text-sm opacity-80">
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9bc60] mx-auto mb-4"></div>
                <p className="text-[#abd1c6]">Загрузка лайков...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 text-[#f9bc60]">⚠️</div>
                <h3 className="text-xl font-bold mb-2 text-[#fffffe]">
                  Ошибка загрузки
                </h3>
                <p className="text-[#abd1c6]">{error}</p>
              </div>
            ) : likes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">💔</div>
                <h3 className="text-xl font-bold mb-3 text-[#fffffe]">
                  Пока нет лайков
                </h3>
                <p className="text-[#abd1c6] mb-6">
                  Когда кто-то лайкнет ваши истории, они появятся здесь
                </p>
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#f9bc60] text-[#001e1d] rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <LucideIcons.Plus size="sm" />
                  Подать заявку
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {likes.map((like, index) => {
                  if (!like.id || !like.id.trim()) return null;
                  const userStatus = getUserStatus(like.user.lastSeen || null);
                  return (
                    <motion.div
                      key={
                        like.id && like.id.trim()
                          ? like.id
                          : `modal-like-${index}`
                      }
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.02 * index,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="bg-[#abd1c6]/10 border border-[#abd1c6]/20 rounded-xl p-4 hover:bg-[#abd1c6]/15 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Аватар */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg bg-[#f9bc60]">
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
                          {/* Статус онлайн/оффлайн */}
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              userStatus.status === "online"
                                ? "animate-pulse"
                                : ""
                            }`}
                            style={{
                              backgroundColor:
                                userStatus.status === "online"
                                  ? "#f9bc60"
                                  : "#abd1c6",
                            }}
                            title={
                              userStatus.status === "online"
                                ? "Онлайн"
                                : `Последний вход: ${userStatus.text}`
                            }
                          ></div>
                        </div>

                        {/* Информация */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/profile/${like.user.id}`}
                                className="text-base font-semibold text-[#fffffe] transition-colors truncate block hover:text-[#f9bc60]"
                              >
                                {like.user.name ||
                                  like.user.email.split("@")[0]}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <LucideIcons.Heart size="sm" className="text-red-500" />
                                <span className="text-sm text-[#abd1c6]">
                                  Лайкнул вашу историю
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    userStatus.status === "online"
                                      ? "bg-[#f9bc60] text-[#001e1d]"
                                      : "bg-[#abd1c6]/20 text-[#abd1c6]"
                                  }`}
                                >
                                  {userStatus.text}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm ml-4 text-[#abd1c6]">
                              <span>
                                {new Date(like.createdAt).toLocaleDateString(
                                  "ru-RU",
                                )}
                              </span>
                            </div>
                          </div>

                          {/* История */}
                          <Link
                            href={`/stories/${like.application.id}`}
                            className="block"
                          >
                            <div className="bg-[#f9bc60]/10 border border-[#f9bc60]/20 rounded-xl p-3 hover:bg-[#f9bc60]/15 transition-all">
                              <h4 className="font-semibold mb-2 line-clamp-1 text-[#fffffe]">
                                {like.application.title}
                              </h4>
                              <p className="text-sm line-clamp-2 mb-2 text-[#abd1c6]">
                                {like.application.summary}
                              </p>
                              <div className="flex items-center gap-1 text-sm font-medium text-[#f9bc60]">
                                <span>Читать историю</span>
                                <LucideIcons.ArrowRight size="sm" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
