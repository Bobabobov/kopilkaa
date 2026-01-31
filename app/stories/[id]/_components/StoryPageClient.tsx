"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import { useAuth } from "@/hooks/useAuth";
import {
  StoryHeader,
  StoryContent,
  StoryImages,
  StoryActions,
  StoryMetadata,
  StoryNavigation,
} from "@/components/stories";
import { StoryPageLoading } from "./sections/StoryPageLoading";
import { StoryPageError } from "./sections/StoryPageError";
import { StoryPageNotFound } from "./sections/StoryPageNotFound";
import { StoryAdInfoBanner } from "./sections/StoryAdInfoBanner";

export interface Story {
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

interface StoryPageClientProps {
  storyId: string;
  initialStory: Story | null;
  initialError: string | null;
}

export default function StoryPageClient({
  storyId,
  initialStory,
  initialError,
}: StoryPageClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState<Story | null>(initialStory);
  const [loading, setLoading] = useState(storyId === "ad" || (!initialStory && !initialError));
  const [error, setError] = useState<string | null>(initialError);
  const [liked, setLiked] = useState(initialStory?.userLiked ?? false);
  const [likesCount, setLikesCount] = useState(initialStory?._count?.likes ?? 0);

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

      const response = await fetch("/api/ads/stories", { cache: "no-store" });

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
    } catch (err) {
      console.error("Error loading stories ad:", err);
    }

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

  const loadStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stories/${id}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStory(data);
      setLiked(data.userLiked || false);
      setLikesCount(data._count?.likes || 0);
    } catch (err) {
      console.error("Error loading story:", err);
      setError("Не удалось загрузить историю");
    } finally {
      setLoading(false);
    }
  };

  // Синхронизация с серверными данными при навигации (новая история)
  useEffect(() => {
    setStory(initialStory);
    setError(initialError);
    setLiked(initialStory?.userLiked ?? false);
    setLikesCount(initialStory?._count?.likes ?? 0);
  }, [storyId, initialStory, initialError]);

  useEffect(() => {
    if (storyId === "ad") {
      loadAdStory();
      return;
    }
    if (!initialStory && !initialError) {
      loadStory(storyId);
    }
  }, [storyId]);

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

    if (!isAuthenticated) {
      pushAuth("signup");
      return;
    }

    try {
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method,
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
        console.error("Ошибка лайка:", errorData.error || errorData.message);
        return;
      }

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

      await loadStory(story.id);
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  if (loading) {
    return <StoryPageLoading />;
  }

  if (error) {
    return <StoryPageError error={error} />;
  }

  if (!story) {
    return <StoryPageNotFound />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <StoryNavigation />

        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
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

            <StoryMetadata
              story={story}
              liked={liked}
              likesCount={likesCount}
              onLike={handleLike}
              isAuthenticated={isAuthenticated}
              isAd={story.id === "ad"}
            />

            <StoryContent
              content={
                story.story || story.summary || "Текст истории недоступен."
              }
              isAd={story.id === "ad"}
            />

            {story.images && story.images.length > 0 && (
              <StoryImages images={story.images} title={story.title} />
            )}

            {story.id === "ad" && <StoryAdInfoBanner />}

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
