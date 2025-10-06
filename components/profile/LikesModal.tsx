"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

    // Блокируем прокрутку фона более надежно
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;

    // Блокируем прокрутку
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // Плавно восстанавливаем позицию прокрутки
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: "instant",
        });
      });
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="likes-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="likes-modal-content"
          initial={{ opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 32 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
          style={{
            backgroundColor: "#004643",
            border: "1px solid #abd1c6",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="p-4" style={{ backgroundColor: "#f9bc60" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 30, 29, 0.2)" }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: "#001e1d" }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "#001e1d" }}
                  >
                    Лайки ваших историй
                  </h2>
                  <p style={{ color: "#001e1d", opacity: 0.8 }}>
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
                className="w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: "rgba(0, 30, 29, 0.2)" }}
              >
                <span className="text-xl" style={{ color: "#001e1d" }}>
                  ✕
                </span>
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mb-4 p-3 rounded-lg text-sm font-medium shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #f9bc60, #fac570)",
                  color: "#001e1d",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0, 30, 29, 0.2)" }}
                  >
                    <span className="text-lg" style={{ color: "#001e1d" }}>
                      {localNotification.type === "success"
                        ? "✅"
                        : localNotification.type === "error"
                          ? "❌"
                          : "ℹ️"}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold">{localNotification.title}</div>
                    <div
                      className="text-sm"
                      style={{ color: "#001e1d", opacity: 0.8 }}
                    >
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#f9bc60" }}
                ></div>
                <p style={{ color: "#abd1c6" }}>Загрузка лайков...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4" style={{ color: "#f9bc60" }}>
                  ⚠️
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#fffffe" }}
                >
                  Ошибка загрузки
                </h3>
                <p style={{ color: "#abd1c6" }}>{error}</p>
              </div>
            ) : likes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">💔</div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#fffffe" }}
                >
                  Пока нет лайков
                </h3>
                <p style={{ color: "#abd1c6" }} className="mb-6">
                  Когда кто-то лайкнет ваши истории, они появятся здесь
                </p>
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{ backgroundColor: "#f9bc60", color: "#001e1d" }}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
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
                      className="backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(171, 209, 198, 0.1)",
                        border: "1px solid rgba(171, 209, 198, 0.2)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Аватар */}
                        <div
                          className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg"
                          style={{ backgroundColor: "#f9bc60" }}
                        >
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
                                className="text-base font-semibold transition-colors truncate block"
                                style={{ color: "#fffffe" }}
                              >
                                {like.user.name ||
                                  like.user.email.split("@")[0]}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span
                                  className="text-sm"
                                  style={{ color: "#abd1c6" }}
                                >
                                  Лайкнул вашу историю
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    userStatus.status === "online"
                                      ? "text-[#001e1d]"
                                      : "text-[#abd1c6]"
                                  }`}
                                >
                                  {userStatus.text}
                                </span>
                              </div>
                            </div>
                            <div
                              className="text-sm ml-4"
                              style={{ color: "#abd1c6" }}
                            >
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
                            <div
                              className="rounded-xl p-3 hover:shadow-lg transition-all"
                              style={{
                                backgroundColor: "rgba(249, 188, 96, 0.1)",
                                border: "1px solid rgba(249, 188, 96, 0.2)",
                              }}
                            >
                              <h4
                                className="font-semibold mb-2 line-clamp-1"
                                style={{ color: "#fffffe" }}
                              >
                                {like.application.title}
                              </h4>
                              <p
                                className="text-sm line-clamp-2 mb-2"
                                style={{ color: "#abd1c6" }}
                              >
                                {like.application.summary}
                              </p>
                              <div
                                className="flex items-center gap-1 text-sm font-medium"
                                style={{ color: "#f9bc60" }}
                              >
                                <span>Читать историю</span>
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
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
}
