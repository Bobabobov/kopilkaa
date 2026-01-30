"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import {
  StoryHeader,
  StoryContent,
  StoryImages,
  StoryActions,
  StoryMetadata,
  StoryNavigation,
} from "@/components/stories";

interface Story {
  id: string;
  title: string;
  summary: string;
  story?: string;
  createdAt?: string;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    hideEmail?: boolean;
  };
  _count?: {
    likes: number;
  };
  userLiked?: boolean;
  advertiserLink?: string;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const pushAuth = (mode: "auth" | "signup") => {
    const href = buildAuthModalUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      modal: mode === "signup" ? "auth/signup" : "auth",
    });
    router.push(href);
  };

  const loadAdStory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/ads/stories", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const ad = data.ad as any;

        if (ad) {
          const config = (ad.config || {}) as {
            storyTitle?: string;
            storyText?: string;
            storyImageUrls?: string[];
            advertiserName?: string;
            advertiserLink?: string;
          };

          const images: Array<{ url: string; sort: number }> = [];

          if (Array.isArray(config.storyImageUrls)) {
            config.storyImageUrls.forEach((url, index) => {
              if (url) {
                images.push({ url, sort: index + 1 });
              }
            });
          } else if (ad.imageUrl) {
            images.push({ url: ad.imageUrl as string, sort: 1 });
          }

          const advertiserName = config.advertiserName || "Команда проекта";
          const advertiserLink: string | undefined =
            config.advertiserLink || ad.linkUrl || undefined;

          const adStory: Story = {
            id: "ad",
            title: config.storyTitle || ad.title || "Рекламная история",
            summary:
              ad.content ||
              "Рекламная история в разделе /stories. Описание будет здесь.",
            story: config.storyText || ad.content || "",
            createdAt: ad.createdAt || new Date().toISOString(),
            images,
            user: {
              id: "advertising",
              name: advertiserName,
              email: "support@kopilka-online.ru",
              avatar: null,
            },
            _count: {
              likes: 0,
            },
            userLiked: false,
            advertiserLink,
          };

          setStory(adStory);
          setLiked(false);
          setLikesCount(0);
          setLoading(false);
          setError(null);
          return;
        }
      }
    } catch (error) {
      console.error("Error loading stories ad:", error);
    }

    // Текс если нет активной рекламы
    const fallbackStory: Story = {
      id: "ad",
      title: "Как работает реклама в историях",
      summary:
        "Подробно о том, как разместить рекламную историю на сайте, какие есть форматы и чего можно ожидать.",
      story: `Проект сейчас на старте. Рекламная история — это отдельный блок на странице историй, который видят все посетители. Главное: вы занимаете заметное место там, где люди читают реальные истории других участников.

Здесь можно простым человеческим языком рассказать о себе: чем вы занимаетесь, кому помогаете, почему вам можно доверять. Добавьте несколько фотографий — витрина, продукт, команда, процесс «до/после», — чтобы у человека сложилась живая картинка, а не сухое объявление.

Мы не обещаем чудес и сотни заявок в первый день. Важно: мы честно показываем, где именно будет ваша реклама и как она выглядит на сайте, без приукрашивания и фейковых цифр.

Когда проект наберёт статистику, мы добавим реальные данные по показам и кликам именно вашей рекламной истории. До этого момента все числа на странице рекламы — это аккуратные ориентиры по опыту похожих проектов, а не красивые обещания из воздуха.`,
      createdAt: new Date().toISOString(),
      images: [
        { url: "/stories-preview.jpg", sort: 1 },
        { url: "/stories-icon.png", sort: 2 },
      ],
      user: {
        id: "advertising",
        name: "Команда проекта",
        email: "support@kopilka-online.ru",
        avatar: null,
      },
      _count: {
        likes: 0,
      },
      userLiked: false,
      advertiserLink: "/advertising",
    };

    setStory(fallbackStory);
    setLiked(false);
    setLikesCount(0);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    // ПроверОЧКа регистрации
    checkAuth();

    if (params.id) {
      const id = params.id as string;

      // Специальная "история-реклама", не из базы
      if (id === "ad") {
        loadAdStory();
        return;
      }

      // Валидация ID (без модификации входных данных)
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        setError("Неправильный формат ID истории");
        setLoading(false);
        return;
      }

      loadStory(id);
    }
  }, [params.id]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/profile/me", { cache: "no-store" });
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const loadStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stories/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStory(data);
      setLiked(data.userLiked || false);
      setLikesCount(data._count?.likes || 0);
    } catch (error) {
      console.error("Error loading story:", error);
      setError("Не удалось загрузить историю");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!story || story.id === "ad") return;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("stories-read-ids");
      const parsed = raw ? JSON.parse(raw) : [];
      const current = Array.isArray(parsed)
        ? parsed.filter((id) => typeof id === "string")
        : [];
      if (!current.includes(story.id)) {
        window.localStorage.setItem(
          "stories-read-ids",
          JSON.stringify([...current, story.id]),
        );
      }
    } catch {
      // ignore malformed storage
    }
  }, [story?.id]);

  const handleLike = async () => {
    if (!story) return;

    // ПроверОЧка авторизации
    if (!isAuthenticated) {
      pushAuth("signup");
      return;
    }

    try {
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          pushAuth("signup");
          return;
        }
        const errorData = await response.json();
        console.error("Ошибка лайка:", errorData.message);
        return;
      }

      // Сначала обновляем локально для мгновенной реакции
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

      if (method === "POST") {
        const submitted = await submitPendingApplicationIfNeeded();
        if (submitted && typeof window !== "undefined") {
          window.location.href = "/applications";
          return;
        }
      }

      // Затем перезагружаем данные с сервера для синхронизации
      await loadStory(story.id);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent mx-auto mb-4"
              style={{ borderColor: "#f9bc60" }}
            ></div>
            <p style={{ color: "#abd1c6" }}>Загрузка истории...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#fffffe" }}
            >
              Ошибка
            </h1>
            <p className="mb-6" style={{ color: "#abd1c6" }}>
              {error}
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: "#f9bc60", color: "#001e1d" }}
            >
              ← Вернуться к историям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#fffffe" }}
            >
              История не найдена
            </h1>
            <p className="mb-6" style={{ color: "#abd1c6" }}>
              Возможно, история была удалена или не существует
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: "#f9bc60", color: "#001e1d" }}
            >
              ← Вернуться к историям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Навигация */}
        <StoryNavigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Заголовок истории */}
            <StoryHeader
              title={story.title}
              author={
                story.user?.name || story.user?.email || "Неизвестный автор"
              }
              authorId={story.user?.id}
              authorAvatar={story.user?.avatar}
              createdAt={story.createdAt}
              isAd={story.id === "ad"}
              authorExternalUrl={
                story.id === "ad" ? story.advertiserLink : undefined
              }
            />

            {/* Метаданные */}
            <StoryMetadata
              story={story}
              liked={liked}
              likesCount={likesCount}
              onLike={handleLike}
              isAuthenticated={isAuthenticated}
              isAd={story.id === "ad"}
            />

            {/* Контент */}
            <StoryContent
              content={
                story.story || story.summary || "Текст истории недоступен."
              }
              isAd={story.id === "ad"}
            />

            {/* Изображения */}
            {story.images && story.images.length > 0 && (
              <StoryImages images={story.images} title={story.title} />
            )}

            {/* Информационный блок для рекламы */}
            {story.id === "ad" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 bg-gradient-to-br from-[#f9bc60]/10 via-[#f9bc60]/5 to-transparent backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-[#f9bc60]/30 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
                    <LucideIcons.Megaphone size="lg" className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#fffffe] mb-2">
                      Рекламная история
                    </h3>
                    <p className="text-[#abd1c6] leading-relaxed mb-4">
                      Это рекламная история в разделе историй. Рекламодатель
                      может разместить здесь информацию о себе, своих услугах
                      или продуктах. История отображается в первой позиции
                      списка и доступна всем посетителям сайта.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
                        <LucideIcons.Star
                          size="sm"
                          className="text-[#f9bc60]"
                        />
                        <span>Первая позиция в списке</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
                        <LucideIcons.Users
                          size="sm"
                          className="text-[#f9bc60]"
                        />
                        <span>Доступна всем посетителям</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
                        <LucideIcons.Calendar
                          size="sm"
                          className="text-[#f9bc60]"
                        />
                        <span>От 2000₽/неделя</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Действия */}
            <StoryActions
              isAd={story.id === "ad"}
              advertiserLink={story.advertiserLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
