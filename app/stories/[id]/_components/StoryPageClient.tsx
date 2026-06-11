"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import { useAuth } from "@/hooks/useAuth";
import {
  StoryContent,
  StoryImages,
  StoryActions,
  StoryNavigation,
} from "@/components/stories";
import { StoryPageLoading } from "./sections/StoryPageLoading";
import { StoryPageError } from "./sections/StoryPageError";
import { StoryPageNotFound } from "./sections/StoryPageNotFound";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { StoryMoreStories } from "./StoryMoreStories";
import { StoryPageHero } from "./StoryPageHero";
import { StoryPageSidebar } from "./StoryPageSidebar";
import { StoryPageReactions } from "./StoryPageReactions";
import { StoryCommentsSection } from "@/components/stories/StoryCommentsSection";
import { StoriesPageBackground } from "@/app/stories/_components/stories-ui/StoriesPageBackground";
import StoryAdLanding from "./StoryAdLanding";
import {
  getMessageFromApiJson,
  logRouteCatchError,
} from "@/lib/api/parseApiError";
import {
  createEmptyStoryReactionCounts,
  type StoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import {
  applyOptimisticReactionToggle,
  createReactionStateFromStory,
  syncReactionStateFromApi,
  type StoryReactionState,
} from "@/lib/stories/reactionToggle";
import { submitStoryReaction } from "@/lib/stories/submitStoryReaction";

export interface Story {
  id: string;
  title: string;
  summary: string;
  story?: string;
  previewImageUrl?: string;
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
  userReaction?: StoryReactionType | null;
  reactionCounts?: StoryReactionCounts;
  advertiserLink?: string;
  advertiserWebsite?: string;
  advertiserTelegram?: string;
}

/** Ответ GET /api/ads/stories — узкая проверка без `any`. */
interface StoriesApiAdRow {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  createdAt?: string;
  config?: unknown;
}

function isStoriesApiAdRow(value: unknown): value is StoriesApiAdRow {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.title === "string";
}

function parseStoriesAdConfig(raw: unknown): {
  storyTitle?: string;
  storyText?: string;
  storyImageUrls?: string[];
  advertiserName?: string;
  advertiserLink?: string;
  advertiserWebsite?: string;
  advertiserTelegram?: string;
} {
  if (!raw || typeof raw !== "object") return {};
  const c = raw as Record<string, unknown>;
  const storyImageUrls = Array.isArray(c.storyImageUrls)
    ? c.storyImageUrls.filter((u): u is string => typeof u === "string")
    : undefined;
  return {
    storyTitle: typeof c.storyTitle === "string" ? c.storyTitle : undefined,
    storyText: typeof c.storyText === "string" ? c.storyText : undefined,
    storyImageUrls,
    advertiserName:
      typeof c.advertiserName === "string" ? c.advertiserName : undefined,
    advertiserLink:
      typeof c.advertiserLink === "string" ? c.advertiserLink : undefined,
    advertiserWebsite:
      typeof c.advertiserWebsite === "string" ? c.advertiserWebsite : undefined,
    advertiserTelegram:
      typeof c.advertiserTelegram === "string"
        ? c.advertiserTelegram
        : undefined,
  };
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
  const [loading, setLoading] = useState(
    storyId === "ad" || (!initialStory && !initialError),
  );
  const [error, setError] = useState<string | null>(initialError);
  const [selectedReaction, setSelectedReaction] =
    useState<StoryReactionType | null>(
      initialStory?.userReaction ?? (initialStory?.userLiked ? "HEART" : null),
    );
  const [likesCount, setLikesCount] = useState(
    initialStory?._count?.likes ?? 0,
  );
  const [reactionCounts, setReactionCounts] = useState<StoryReactionCounts>(
    initialStory?.reactionCounts ?? createEmptyStoryReactionCounts(),
  );
  const liked = Boolean(selectedReaction);
  const reactionRequestSeq = useRef(0);

  const applyReactionState = useCallback((state: StoryReactionState) => {
    setSelectedReaction(state.selectedReaction);
    setReactionCounts(state.reactionCounts);
    setLikesCount(state.likesCount);
  }, []);

  // При открытии страницы истории всегда показывать сверху (текст, а не низ)
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, [storyId]);

  const pushAuth = useCallback(
    (mode: "auth" | "signup") => {
      const href = buildAuthModalUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        modal: mode === "signup" ? "auth/signup" : "auth",
      });
      router.push(href);
    },
    [router],
  );

  const loadAdStory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/ads/stories", { cache: "no-store" });

      if (response.ok) {
        const data = (await response.json()) as { ad?: unknown };
        const ad = data.ad;

        if (isStoriesApiAdRow(ad)) {
          const config = parseStoriesAdConfig(ad.config);

          const images: Array<{ url: string; sort: number }> = [];

          if (config.storyImageUrls?.length) {
            config.storyImageUrls.forEach((url, index) => {
              if (url) {
                images.push({ url, sort: index + 1 });
              }
            });
          } else if (ad.imageUrl) {
            images.push({ url: ad.imageUrl, sort: 1 });
          }

          const advertiserName = config.advertiserName || "Команда проекта";
          const advertiserLink: string | undefined =
            config.advertiserLink || ad.linkUrl || undefined;

          const adStory: Story = {
            id: "ad",
            title: config.storyTitle || ad.title || "Рекламная история",
            summary:
              (typeof ad.content === "string" && ad.content) ||
              "Рекламная история в разделе /stories. Описание будет здесь.",
            story:
              config.storyText ||
              (typeof ad.content === "string" ? ad.content : "") ||
              "",
            previewImageUrl: ad.imageUrl || undefined,
            createdAt:
              (typeof ad.createdAt === "string" && ad.createdAt) ||
              new Date().toISOString(),
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
            userReaction: null,
            reactionCounts: createEmptyStoryReactionCounts(),
            advertiserLink,
            advertiserWebsite: config.advertiserWebsite || undefined,
            advertiserTelegram: config.advertiserTelegram || undefined,
          };

          setStory(adStory);
          setSelectedReaction(null);
          setLikesCount(0);
          setReactionCounts(createEmptyStoryReactionCounts());
          setLoading(false);
          setError(null);
          return;
        }
      }
    } catch (err) {
      logRouteCatchError("[StoryPageClient] loadAdStory", err);
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
      previewImageUrl: "/stories-preview.jpg",
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
      userReaction: null,
      reactionCounts: createEmptyStoryReactionCounts(),
      advertiserLink: "/advertising",
      advertiserWebsite: undefined,
      advertiserTelegram: undefined,
    };

    setStory(fallbackStory);
    setSelectedReaction(null);
    setLikesCount(0);
    setReactionCounts(createEmptyStoryReactionCounts());
    setLoading(false);
    setError(null);
  };

  const loadStory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stories/${id}`, { cache: "no-store" });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(getMessageFromApiJson(body, "Не удалось загрузить историю"));
        return;
      }

      const data = body as Story;
      setStory(data);
      setSelectedReaction(
        data.userReaction ?? (data.userLiked ? "HEART" : null),
      );
      setLikesCount(data._count?.likes || 0);
      setReactionCounts(
        data.reactionCounts ?? createEmptyStoryReactionCounts(),
      );
    } catch (err) {
      logRouteCatchError("[StoryPageClient] loadStory", err);
      setError("Не удалось загрузить историю");
    } finally {
      setLoading(false);
    }
  };

  // Синхронизация с серверными данными при навигации (новая история)
  useEffect(() => {
    setStory(initialStory);
    setError(initialError);
    setSelectedReaction(
      initialStory?.userReaction ?? (initialStory?.userLiked ? "HEART" : null),
    );
    setLikesCount(initialStory?._count?.likes ?? 0);
    setReactionCounts(
      initialStory?.reactionCounts ?? createEmptyStoryReactionCounts(),
    );
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
    } catch (err) {
      logRouteCatchError(
        "[StoryPageClient] stories-read-ids localStorage",
        err,
      );
    }
  }, [story?.id]);

  const handleLike = useCallback(
    async (type: StoryReactionType = "HEART") => {
      if (!story) return;

      if (!isAuthenticated) {
        pushAuth("signup");
        return;
      }

      const before = createReactionStateFromStory({
        userReaction: selectedReaction,
        reactionCounts,
        _count: { likes: likesCount },
      });
      const { next, method } = applyOptimisticReactionToggle(before, type);
      applyReactionState(next);

      const requestId = ++reactionRequestSeq.current;

      try {
        const result = await submitStoryReaction(story.id, method, type);

        if (requestId !== reactionRequestSeq.current) return;

        if (!result.ok) {
          if (result.status === 401) {
            applyReactionState(before);
            pushAuth("signup");
            return;
          }
          applyReactionState(before);
          logRouteCatchError(
            "[StoryPageClient] like",
            new Error(result.error ?? `Код ${result.status}`),
          );
          return;
        }

        applyReactionState(syncReactionStateFromApi(result.data, next));

        if (method === "POST") {
          const submitted = await submitPendingApplicationIfNeeded();
          if (submitted && typeof window !== "undefined") {
            window.location.href = "/applications";
          }
        }
      } catch (err) {
        if (requestId === reactionRequestSeq.current) {
          applyReactionState(before);
        }
        logRouteCatchError("[StoryPageClient] handleLike", err);
      }
    },
    [
      story,
      selectedReaction,
      reactionCounts,
      likesCount,
      isAuthenticated,
      pushAuth,
      applyReactionState,
    ],
  );

  if (loading) {
    return <StoryPageLoading />;
  }

  if (error) {
    return <StoryPageError error={error} />;
  }

  if (!story) {
    return <StoryPageNotFound />;
  }

  if (story.id === "ad") {
    return <StoryAdLanding story={story} />;
  }

  const authorName =
    story.user?.name || story.user?.email || "Неизвестный автор";
  const sortedImages = [...(story.images ?? [])].sort((a, b) => a.sort - b.sort);
  const storyBody = story.story?.trim();
  const summaryText = story.summary?.trim();
  const contentForBody =
    storyBody ?? (summaryText ? null : "Текст истории недоступен.");
  const readTime = Math.max(
    1,
    Math.ceil(
      (storyBody?.length || summaryText?.length || 0) / 200,
    ),
  );

  return (
    <div data-stories-page className="relative min-h-screen">
      <StoriesPageBackground />
      <ReadingProgressBar />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8 pb-14 sm:pb-20">
          <StoryNavigation />

          <StoryPageHero
            title={story.title}
            summary={summaryText}
            author={authorName}
            authorId={story.user?.id}
            authorAvatar={story.user?.avatar}
            createdAt={story.createdAt}
            readTime={readTime}
            imagesCount={sortedImages.length}
          />

          <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-10 items-start">
            <main id="story-content" className="min-w-0">
              {contentForBody && (
                <StoryContent
                  content={contentForBody}
                  footer={
                    <StoryPageReactions
                      liked={liked}
                      likesCount={likesCount}
                      selectedReaction={selectedReaction}
                      reactionCounts={reactionCounts}
                      onLike={handleLike}
                      isAuthenticated={isAuthenticated}
                      storyId={story.id}
                      storyTitle={story.title}
                    />
                  }
                />
              )}

              {sortedImages.length > 0 && (
                <StoryImages images={sortedImages} title={story.title} />
              )}

              <StoryActions />

              <StoryCommentsSection
                storyId={story.id}
                isAuthenticated={isAuthenticated}
                onAuthRequired={() => pushAuth("signup")}
              />
            </main>

            <StoryPageSidebar
              author={authorName}
              authorId={story.user?.id}
              authorAvatar={story.user?.avatar}
            />
          </div>

          <StoryMoreStories />
        </div>
      </div>
    </div>
  );
}
