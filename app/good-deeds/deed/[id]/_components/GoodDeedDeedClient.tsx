"use client";

import { useEffect, useState } from "react";
import { StoriesPageBackground } from "@/app/stories/_components/stories-ui/StoriesPageBackground";
import { StoryAdGallery } from "@/app/good-deeds/_components/StoryAdGallery";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import { GoodDeedDeedActions } from "./GoodDeedDeedActions";
import { GoodDeedDeedContent } from "./GoodDeedDeedContent";
import { GoodDeedDeedError } from "./GoodDeedDeedError";
import { GoodDeedDeedHero } from "./GoodDeedDeedHero";
import { GoodDeedDeedLoading } from "./GoodDeedDeedLoading";
import { GoodDeedDeedNavigation } from "./GoodDeedDeedNavigation";
import { GoodDeedDeedSidebar } from "./GoodDeedDeedSidebar";

type DeedPayload = {
  id: string;
  taskTitle: string;
  taskDescription: string;
  storyText: string;
  reward: number;
  createdAt: string;
  updatedAt: string;
  media: { url: string; type: "IMAGE" | "VIDEO" }[];
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    vkLink?: string | null;
    telegramLink?: string | null;
    youtubeLink?: string | null;
  };
};

export function GoodDeedDeedClient({ id }: { id: string }) {
  const [deed, setDeed] = useState<DeedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/good-deeds/deed/${encodeURIComponent(id)}`,
          { cache: "no-store" },
        );
        const json = await res.json();
        throwIfApiFailed(res, json, "Не удалось загрузить отчёт");
        if (!cancelled) {
          setDeed(json.deed as DeedPayload);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка");
          setDeed(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <GoodDeedDeedLoading />;
  }

  if (error || !deed) {
    return <GoodDeedDeedError error={error || "Отчёт не найден"} />;
  }

  const storyBody =
    deed.storyText.trim() ||
    "Текст рассказа не сохранён для этой записи — ниже описание задания.";
  const fallbackDescription =
    !deed.storyText.trim() && deed.taskDescription
      ? deed.taskDescription
      : null;
  const summaryText =
    deed.storyText.trim() && deed.taskDescription
      ? deed.taskDescription
      : undefined;

  const readTime = Math.max(1, Math.ceil(storyBody.length / 200));
  const galleryItems = deed.media.map((m, i) => ({
    url: m.url,
    sort: i,
    type: m.type,
  }));

  return (
    <div data-good-deeds-page className="relative min-h-screen">
      <StoriesPageBackground />

      <div className="relative z-10">
        <div className="container mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
          <GoodDeedDeedNavigation />

          <GoodDeedDeedHero
            title={deed.taskTitle}
            summary={summaryText}
            reward={deed.reward}
            authorName={deed.user.name}
            authorId={deed.user.id}
            authorAvatar={deed.user.avatar}
            authorUsername={deed.user.username}
            createdAt={deed.updatedAt}
            readTime={readTime}
            mediaCount={deed.media.length}
          />

          <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
            <main id="good-deed-content" className="min-w-0">
              <GoodDeedDeedContent
                content={storyBody}
                taskDescription={fallbackDescription}
              />

              {deed.media.length > 0 ? (
                <StoryAdGallery
                  mode="page"
                  title={deed.taskTitle}
                  items={galleryItems}
                />
              ) : null}

              <GoodDeedDeedActions />
            </main>

            <GoodDeedDeedSidebar
              authorName={deed.user.name}
              authorId={deed.user.id}
              authorAvatar={deed.user.avatar}
              authorUsername={deed.user.username}
              vkLink={deed.user.vkLink}
              telegramLink={deed.user.telegramLink}
              youtubeLink={deed.user.youtubeLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
