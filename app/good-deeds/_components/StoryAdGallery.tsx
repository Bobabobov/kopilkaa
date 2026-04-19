"use client";

/**
 * Вёрстка медиа как у StoryAdImages (/stories/ad): рамки, contain, «Смотреть».
 * Видео поддержаны; лайтбокс — GoodDeedsMediaLightbox (страница отчёта).
 * Режим feed — превью в карточке ленты (без лайтбокса), без нижней полоски внутри рамки.
 */

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  GoodDeedsMediaLightbox,
  type LightboxMediaItem,
} from "@/app/good-deeds/_components/GoodDeedsMediaLightbox";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";

export type StoryAdGalleryItem = {
  url: string;
  sort: number;
  type: "IMAGE" | "VIDEO";
};

export interface StoryAdGalleryProps {
  items: StoryAdGalleryItem[];
  title?: string;
  mode?: "page" | "feed";
}

const buildPreviewUrl = (url: string) =>
  buildUploadUrl(url, { variant: "medium" });

function videoSrc(url: string) {
  return isUploadUrl(url) ? buildUploadUrl(url) : url;
}

function StoryAdGalleryInner({
  items,
  title = "",
  mode = "page",
}: StoryAdGalleryProps) {
  const sorted = useMemo(
    () =>
      [...items]
        .sort((a, b) => a.sort - b.sort)
        .filter((i) => !!i?.url),
    [items],
  );

  const toShow = mode === "feed" && sorted[0] ? [sorted[0]] : sorted;

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const probeKey = sorted.map((i) => `${i.url}|${i.type}`).join(";");

  useEffect(() => {
    if (sorted.length === 0) return;

    let cancelled = false;

    const probeOne = async (
      item: StoryAdGalleryItem,
    ): Promise<readonly [string, number] | null> => {
      if (item.type === "VIDEO") {
        const src = videoSrc(item.url);
        return await new Promise((resolve) => {
          const el = document.createElement("video");
          el.preload = "metadata";
          el.muted = true;
          el.onloadedmetadata = () => {
            const w = el.videoWidth || 16;
            const h = el.videoHeight || 9;
            resolve([src, w / h] as const);
          };
          el.onerror = () => resolve([src, 16 / 9] as const);
          el.src = src;
        });
      }

      const previewUrl = buildPreviewUrl(item.url);
      return await new Promise((resolve) => {
        const probe = new window.Image();
        probe.onload = () => {
          const w = probe.naturalWidth || 1;
          const h = probe.naturalHeight || 1;
          resolve([previewUrl, w / h] as const);
        };
        probe.onerror = () => resolve(null);
        probe.src = previewUrl;
      });
    };

    const load = async () => {
      const entries = await Promise.all(sorted.map((img) => probeOne(img)));

      if (cancelled) return;

      setRatios((prev) => {
        const next = { ...prev };
        for (const item of entries) {
          if (!item) continue;
          const [k, r] = item;
          if (!next[k]) next[k] = r;
        }
        return next;
      });
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [probeKey]);

  const lightboxMedia: LightboxMediaItem[] = useMemo(
    () => sorted.map((x) => ({ url: x.url, type: x.type })),
    [sorted],
  );

  const openLightbox = useCallback(
    (index: number) => {
      if (mode === "feed") return;
      setCurrentIndex(index);
      setIsOpen(true);
    },
    [mode],
  );

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const onIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (sorted.length === 0) return null;

  const renderFigure = (image: StoryAdGalleryItem, index: number) => {
    const previewUrl =
      image.type === "VIDEO"
        ? videoSrc(image.url)
        : buildPreviewUrl(image.url);
    const ratioKey =
      image.type === "VIDEO" ? previewUrl : buildPreviewUrl(image.url);

    const shouldBypassOptimization =
      isUploadUrl(previewUrl) || isExternalUrl(previewUrl);
    const isFailed = failedUrls[previewUrl] || failedUrls[image.url];

    const ratioRaw = ratios[ratioKey];
    const ratio =
      typeof ratioRaw === "number"
        ? Math.max(0.6, Math.min(2.2, ratioRaw))
        : 16 / 10;
    const isHero = index === 0;

    const maxHeight =
      mode === "feed" ? "14rem" : isHero ? "72vh" : "62vh";

    const paddingY =
      mode === "feed"
        ? "px-2 py-2 sm:px-3 sm:py-3"
        : isHero
          ? "px-3 py-4 sm:px-6 sm:py-6"
          : "px-3 py-4 sm:px-5 sm:py-5";

    const frameInner = (
      <>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-20 h-52 w-52 rounded-full bg-[#f9bc60]/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-[#abd1c6]/10 blur-3xl" />
        </div>

        <div
          className={[
            "relative w-full max-w-5xl",
            "rounded-2xl border border-[#abd1c6]/15 bg-black/20",
            "shadow-[0_18px_55px_-35px_rgba(0,0,0,0.5)]",
            "overflow-hidden",
          ].join(" ")}
          style={{
            aspectRatio: `${ratio} / 1`,
            maxHeight,
          }}
        >
          {isFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-white/70">
              <LucideIcons.Image size="sm" />
              {image.type === "VIDEO"
                ? "Видео недоступно"
                : "Изображение недоступно"}
            </div>
          ) : image.type === "VIDEO" ? (
            <video
              src={previewUrl}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              onError={() =>
                setFailedUrls((prev) => ({
                  ...prev,
                  [previewUrl]: true,
                  [image.url]: true,
                }))
              }
            />
          ) : shouldBypassOptimization ? (
            <img
              src={previewUrl}
              alt={`${title || "Галерея"} — ${index + 1}`}
              className="h-full w-full object-contain"
              loading={isHero ? "eager" : "lazy"}
              onError={() =>
                setFailedUrls((prev) => ({
                  ...prev,
                  [previewUrl]: true,
                  [image.url]: true,
                }))
              }
            />
          ) : (
            <img
              src={previewUrl}
              alt={`${title || "Галерея"} — ${index + 1}`}
              className="h-full w-full object-contain"
              loading={isHero ? "eager" : "lazy"}
              onError={() =>
                setFailedUrls((prev) => ({
                  ...prev,
                  [previewUrl]: true,
                  [image.url]: true,
                }))
              }
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          {mode === "page" && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60]" />
          )}
        </div>

        {mode === "page" && (
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <LucideIcons.ZoomIn size="xs" />
            Смотреть
          </span>
        )}
      </>
    );

    return (
      <figure
        key={`${image.url}-${index}-${image.type}`}
        className={[
          "relative overflow-hidden rounded-3xl border border-[#abd1c6]/20",
          "bg-gradient-to-br from-[#001e1d]/70 via-[#002724]/35 to-transparent",
          "shadow-[0_18px_55px_-30px_rgba(0,0,0,0.35)]",
        ].join(" ")}
      >
        {mode === "page" ? (
          <button
            type="button"
            onClick={() => {
              if (!isFailed) openLightbox(index);
            }}
            disabled={isFailed}
            className={[
              "relative flex w-full items-center justify-center",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60",
              paddingY,
            ].join(" ")}
            aria-label={`Открыть ${image.type === "VIDEO" ? "видео" : "изображение"} ${index + 1} из ${sorted.length}`}
          >
            {frameInner}
          </button>
        ) : (
          <div
            className={[
              "relative flex w-full items-center justify-center",
              paddingY,
            ].join(" ")}
          >
            {frameInner}
          </div>
        )}

        <figcaption className="sr-only">
          Кадр {index + 1} из {sorted.length}
        </figcaption>
      </figure>
    );
  };

  const inner = (
    <div className={mode === "page" ? "space-y-5 sm:space-y-6" : ""}>
      {toShow.map((img) => {
        const index = sorted.findIndex(
          (s) => s.url === img.url && s.sort === img.sort,
        );
        return renderFigure(img, index >= 0 ? index : 0);
      })}
    </div>
  );

  if (mode === "feed") {
    return <div className="relative w-full">{inner}</div>;
  }

  return (
    <section className="mb-10" aria-label="Галерея">
      <div className="mb-4 flex items-start justify-between gap-4 sm:mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#fffffe] sm:text-xl">
          <LucideIcons.Image size="md" className="text-[#f9bc60]" aria-hidden />
          Галерея
        </h2>
      </div>
      {inner}

      <GoodDeedsMediaLightbox
        isOpen={isOpen}
        media={lightboxMedia}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onIndexChange={onIndexChange}
      />
    </section>
  );
}

export const StoryAdGallery = memo(StoryAdGalleryInner);
