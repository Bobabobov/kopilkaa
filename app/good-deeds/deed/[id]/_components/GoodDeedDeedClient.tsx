"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Rss } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { formatTimeAgo } from "@/lib/time";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { StoryAdGallery } from "@/app/good-deeds/_components/StoryAdGallery";
import { throwIfApiFailed } from "@/lib/api/parseApiError";

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
  const router = useRouter();
  const [deed, setDeed] = useState<DeedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/good-deeds/deed/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        const json = await res.json();
        throwIfApiFailed(res, json, "Не удалось загрузить задание");
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
    return (
      <div
        className="mx-auto max-w-3xl px-4 py-16 text-center text-[#abd1c6]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Загрузка отчёта…</span>
        Загрузка…
      </div>
    );
  }

  if (error || !deed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Card variant="darkGlass" padding="md" className="space-y-4">
          <div role="alert">
            <p className="text-[#abd1c6]">{error || "Отчёт не найден"}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-[#abd1c6]/35"
            onClick={() => router.push("/good-deeds")}
          >
            На страницу добрых дел
          </Button>
        </Card>
      </div>
    );
  }

  const avatarUrl = buildUploadUrl(resolveAvatarUrl(deed.user.avatar), {
    variant: "thumb",
  });
  const avatarUnoptimized = isUploadUrl(avatarUrl) || isExternalUrl(avatarUrl);

  const storyBody =
    deed.storyText.trim() ||
    "Текст рассказа не сохранён для этой записи — ниже описание задания.";
  const fallbackDescription =
    !deed.storyText.trim() && deed.taskDescription
      ? deed.taskDescription
      : null;

  const galleryItems = deed.media.map((m, i) => ({
    url: m.url,
    sort: i,
    type: m.type,
  }));

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <nav className="mb-8 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-semibold text-[#abd1c6] transition hover:text-[#f9bc60]"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
        <span className="text-[#5c6d7a]">·</span>
        <Link
          href="/good-deeds"
          className="inline-flex items-center gap-2 font-semibold text-[#abd1c6] transition hover:text-[#f9bc60]"
        >
          <Rss className="h-4 w-4" />
          Лента добрых дел
        </Link>
      </nav>

      <article>
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <Badge
              variant="success"
              className="shrink-0 font-semibold text-sm"
            >
              +{deed.reward} бонусов
            </Badge>
            <span className="text-sm text-[#94a1b2]">
              {formatTimeAgo(deed.updatedAt)}
            </span>
          </div>
          <h1 className="text-balance text-3xl font-black tracking-tight text-[#fffffe] sm:text-4xl">
            {deed.taskTitle}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${deed.user.id}`}
              className="group flex min-w-0 items-center gap-3"
            >
              <Image
                src={avatarUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#f9bc60]/25"
                unoptimized={avatarUnoptimized}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <div className="min-w-0 text-left">
                <p className="truncate font-semibold text-[#fffffe] transition group-hover:text-[#f9bc60]">
                  {deed.user.name}
                </p>
                {deed.user.username && (
                  <p className="truncate text-sm text-[#94a1b2]">
                    @{deed.user.username}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {(deed.user.vkLink ||
            deed.user.telegramLink ||
            deed.user.youtubeLink) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {deed.user.vkLink && (
                <a
                  href={deed.user.vkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#4c75a3]/45 bg-[#4c75a3]/12 px-3 py-1 text-xs font-semibold text-[#8babd9]"
                >
                  <VKIcon className="h-4 w-4" />
                  VK
                </a>
              )}
              {deed.user.telegramLink && (
                <a
                  href={deed.user.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#229ED9]/45 bg-[#229ED9]/12 px-3 py-1 text-xs font-semibold text-[#7ccff0]"
                >
                  <TelegramIcon className="h-4 w-4" />
                  Telegram
                </a>
              )}
              {deed.user.youtubeLink && (
                <a
                  href={deed.user.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ff4f45]/45 bg-[#ff4f45]/12 px-3 py-1 text-xs font-semibold text-[#ffa8a3]"
                >
                  <YouTubeIcon className="h-4 w-4" />
                  YouTube
                </a>
              )}
            </div>
          )}
        </header>

        <div className="prose prose-invert max-w-none">
          <div className="rounded-3xl border border-white/[0.08] bg-[#060f0e]/50 px-5 py-5 sm:px-7 sm:py-7">
            <p className="whitespace-pre-wrap text-[1.05rem] leading-[1.75] text-[#c4d3d0]">
              {storyBody}
            </p>
            {fallbackDescription && (
              <p className="mt-6 border-t border-[#abd1c6]/15 pt-6 text-sm leading-relaxed text-[#94a1b2]">
                <span className="font-semibold text-[#abd1c6]">
                  Описание задания:{" "}
                </span>
                {fallbackDescription}
              </p>
            )}
          </div>
        </div>

        {deed.media.length > 0 && (
          <div className="mt-10">
            <StoryAdGallery
              mode="page"
              title={deed.taskTitle}
              items={galleryItems}
            />
          </div>
        )}
      </article>
    </div>
  );
}
