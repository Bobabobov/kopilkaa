"use client";

import { useMemo, useState } from "react";
import type { NewsMedia } from "./types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { NewsLightbox } from "./NewsLightbox";

export function NewsMediaGallery({ media }: { media: NewsMedia[] }) {
  const sorted = useMemo(
    () => [...media].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
    [media],
  );

  if (!sorted.length) return null;

  const imagesOnly = sorted.filter((m) => m.type === "IMAGE");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isSingle = sorted.length === 1;
  const gridClass = isSingle
    ? "grid grid-cols-1"
    : sorted.length === 2
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-2 sm:grid-cols-3 gap-2";

  return (
    <div className="mt-4">
      <NewsLightbox
        isOpen={lightboxOpen}
        images={imagesOnly.map((m) => m.url)}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />

      <div className={gridClass}>
        {sorted.map((m) => {
          if (m.type === "VIDEO") {
            return (
              <div
                key={m.id}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
              >
                <video
                  src={m.url}
                  controls
                  playsInline
                  className="w-full h-full max-h-[420px] object-cover"
                />
              </div>
            );
          }
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                const idx = imagesOnly.findIndex((x) => x.id === m.id);
                if (idx >= 0) {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-left cursor-pointer"
              aria-label="Открыть фото"
              title="Открыть фото"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt=""
                className="w-full h-full max-h-[420px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 border border-white/10 text-xs font-semibold text-white">
                  <LucideIcons.ZoomIn size="xs" />
                  Смотреть
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


