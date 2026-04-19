"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";
import { cn } from "@/lib/utils";
import type { GoodDeedsResponse } from "../types";

type MediaItem = GoodDeedsResponse["feed"][number]["media"][number];

function thumbSrc(url: string) {
  if (!isUploadUrl(url)) return url;
  return buildUploadUrl(url, { variant: "medium" });
}

type Props = {
  media: MediaItem[];
  onOpen: (index: number) => void;
};

function mediaMaxClassDense() {
  return "max-h-[min(280px,44vh)] sm:max-h-[min(320px,46vh)]";
}

/** Как в VK: один кадр — полная ширина колонки, своя высота по пропорциям, без обрезки. */
function AlbumRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl", className)}>
      {children}
    </div>
  );
}

export function GoodDeedsTelegramAlbum({ media, onOpen }: Props) {
  const n = media.length;
  if (n === 0) return null;

  const dense = n > 1;

  /** Сетка: несколько файлов — ячейки с object-contain и лимитом высоты. */
  const renderInner = (m: MediaItem) => {
    const src = thumbSrc(m.url);
    const bypass =
      isUploadUrl(thumbSrc(m.url)) || isExternalUrl(thumbSrc(m.url));

    if (m.type === "VIDEO") {
      return (
        <>
          <video
            src={m.url}
            muted
            playsInline
            preload="metadata"
            className={cn(
              "object-contain",
              dense
                ? "max-h-[min(240px,40vh)] w-auto max-w-full sm:max-h-[min(280px,42vh)]"
                : "h-auto w-full max-w-full sm:max-h-none",
            )}
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-95 transition group-hover:bg-black/5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-[#fffffe] shadow-md sm:h-12 sm:w-12">
              <LucideIcons.Play size="sm" />
            </span>
          </span>
        </>
      );
    }

    return (
      <div className="relative flex min-h-[80px] w-full flex-1 items-center justify-center">
        <Image
          src={src}
          alt=""
          width={1600}
          height={1200}
          className={cn(
            "h-auto w-auto max-w-full object-contain",
            dense && mediaMaxClassDense(),
          )}
          sizes="(max-width: 768px) 100vw, 896px"
          unoptimized={bypass}
        />
      </div>
    );
  };

  const cellBtn = (index: number, className?: string) => {
    const m = media[index];
    return (
      <button
        key={`album-${index}-${m.url}`}
        type="button"
        onClick={() => onOpen(index)}
        className={cn(
          "group relative flex w-full min-w-0 items-center justify-center overflow-hidden bg-transparent text-left outline-none transition hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-0",
          className,
        )}
        aria-label={`Открыть медиа ${index + 1} из ${n}`}
      >
        <div className="flex min-h-[120px] w-full flex-col items-center justify-center px-0 py-0.5 sm:min-h-[140px]">
          {renderInner(m)}
        </div>
      </button>
    );
  };

  const m0 = media[0]!;

  /** Один файл — как в VK: картинка/видео на всю ширину, скругление, без подложки-«рамки». */
  if (n === 1) {
    const src = thumbSrc(m0.url);
    const bypass =
      isUploadUrl(thumbSrc(m0.url)) || isExternalUrl(thumbSrc(m0.url));

    return (
      <AlbumRoot>
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group relative block w-full cursor-zoom-in text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]"
          aria-label="Открыть медиа"
        >
          {m0.type === "VIDEO" ? (
            <>
              <video
                src={m0.url}
                muted
                playsInline
                preload="metadata"
                className="block h-auto w-full rounded-xl object-contain"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/10 transition group-hover:bg-black/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-[#fffffe] shadow-lg">
                  <LucideIcons.Play size="sm" />
                </span>
              </span>
            </>
          ) : (
            <Image
              src={src}
              alt=""
              width={1600}
              height={1200}
              className="block h-auto w-full rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, min(896px, 92vw)"
              unoptimized={bypass}
            />
          )}
        </button>
      </AlbumRoot>
    );
  }

  const gridClass = "gap-0 bg-transparent";

  if (n === 2) {
    return (
      <AlbumRoot>
        <div className={cn("grid grid-cols-2", gridClass)}>
          {cellBtn(0)}
          {cellBtn(1)}
        </div>
      </AlbumRoot>
    );
  }

  if (n === 3) {
    return (
      <AlbumRoot>
        <div className={cn("grid grid-cols-2 grid-rows-2", gridClass)}>
          <div className="row-span-2 min-h-0">{cellBtn(0, "h-full min-h-[200px]")}</div>
          {cellBtn(1)}
          {cellBtn(2)}
        </div>
      </AlbumRoot>
    );
  }

  if (n === 4) {
    return (
      <AlbumRoot>
        <div className={cn("grid grid-cols-2 grid-rows-2", gridClass)}>
          {cellBtn(0)}
          {cellBtn(1)}
          {cellBtn(2)}
          {cellBtn(3)}
        </div>
      </AlbumRoot>
    );
  }

  if (n === 5) {
    return (
      <AlbumRoot>
        <div className={cn("grid grid-cols-2", gridClass)}>
          {cellBtn(0)}
          {cellBtn(1)}
          {cellBtn(2)}
          {cellBtn(3)}
          <div className="col-span-2 min-h-0">{cellBtn(4)}</div>
        </div>
      </AlbumRoot>
    );
  }

  return (
    <AlbumRoot>
      <div className={cn("grid grid-cols-3", gridClass)}>
        {media.map((_, idx) => cellBtn(idx))}
      </div>
    </AlbumRoot>
  );
}
