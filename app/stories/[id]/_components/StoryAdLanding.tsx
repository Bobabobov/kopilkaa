"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { Story } from "./StoryPageClient";
import StoryContent from "@/components/stories/StoryContent";
import StoryActions from "@/components/stories/StoryActions";
import StoryAdImages from "@/components/stories/StoryAdImages";
import { buildUploadUrl } from "@/lib/uploads/url";
import AdLandingCtaCard from "./ad-landing/AdLandingCtaCard";
import {
  stripHTML,
  normalizeWebsiteUrl,
  normalizeTelegramUrl,
} from "./ad-landing/utils";

interface StoryAdLandingProps {
  story: Story;
  liked: boolean;
  likesCount: number;
  onLike: () => void;
  isAuthenticated: boolean;
  storyId: string;
  isLiking: boolean;
}

export default function StoryAdLanding({ story }: StoryAdLandingProps) {
  const primaryCta = useMemo(() => {
    if (!story.advertiserLink) return null;
    return story.advertiserLink;
  }, [story.advertiserLink]);
  const websiteUrl = useMemo(
    () => normalizeWebsiteUrl(story.advertiserWebsite),
    [story.advertiserWebsite],
  );
  const telegramUrl = useMemo(
    () => normalizeTelegramUrl(story.advertiserTelegram),
    [story.advertiserTelegram],
  );
  const fallbackUrl = useMemo(
    () => normalizeWebsiteUrl(story.advertiserLink),
    [story.advertiserLink],
  );
  const mainAction = useMemo(() => {
    if (websiteUrl) return { type: "website" as const, href: websiteUrl };
    if (telegramUrl) return { type: "telegram" as const, href: telegramUrl };
    if (fallbackUrl) return { type: "fallback" as const, href: fallbackUrl };
    return null;
  }, [websiteUrl, telegramUrl, fallbackUrl]);

  const headline = useMemo(
    () => stripHTML(story.title || "Рекламная история"),
    [story.title],
  );
  const advertiserName = useMemo(
    () => stripHTML(story.user?.name || "").trim(),
    [story.user?.name],
  );
  const heroPreviewUrl = useMemo(() => {
    if (!story.previewImageUrl) return null;
    return buildUploadUrl(story.previewImageUrl, { variant: "medium" });
  }, [story.previewImageUrl]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/18 bg-gradient-to-br from-[#001e1d]/82 via-[#003d3a]/34 to-transparent backdrop-blur-sm shadow-[0_28px_80px_-48px_rgba(0,0,0,0.55)]">
              <div className="pointer-events-none absolute -top-28 -right-36 h-72 w-72 rounded-full bg-[#f9bc60]/12 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-40 -left-36 h-96 w-96 rounded-full bg-[#abd1c6]/10 blur-3xl" />

              <div className="relative p-5 sm:p-8 md:p-10">
                {/* Top bar */}
                <div className="mb-6 flex justify-center">
                  {mainAction ? (
                    <a
                      href={mainAction.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 rounded-full border border-[#abd1c6]/45 bg-gradient-to-r from-[#0f3f3d]/95 via-[#14514d]/95 to-[#0f3f3d]/95 px-5 py-2.5 text-sm font-extrabold tracking-wide text-[#e6f5ef] shadow-[0_14px_34px_-18px_rgba(0,0,0,0.65)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#abd1c6]/70 hover:shadow-[0_18px_38px_-16px_rgba(171,209,198,0.35)] active:translate-y-0"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#abd1c6] shadow-[0_0_0_4px_rgba(171,209,198,0.22)]" />
                      {advertiserName || "Реклама"}
                      <LucideIcons.ArrowRight
                        size="xs"
                        className="text-[#cbe8df] transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <Link
                      href="/advertising"
                      className="group inline-flex items-center gap-2.5 rounded-full border border-[#abd1c6]/45 bg-gradient-to-r from-[#0f3f3d]/95 via-[#14514d]/95 to-[#0f3f3d]/95 px-5 py-2.5 text-sm font-extrabold tracking-wide text-[#e6f5ef] shadow-[0_14px_34px_-18px_rgba(0,0,0,0.65)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#abd1c6]/70 hover:shadow-[0_18px_38px_-16px_rgba(171,209,198,0.35)] active:translate-y-0"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#abd1c6] shadow-[0_0_0_4px_rgba(171,209,198,0.22)]" />
                      {advertiserName || "Реклама"}
                      <LucideIcons.ArrowRight
                        size="xs"
                        className="text-[#cbe8df] transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  )}
                </div>

                {/* Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-8 items-start">
                  <div className="min-w-0">
                    <div className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/28 min-h-[190px] sm:min-h-[220px]">
                      {heroPreviewUrl && (
                        <>
                          <img
                            src={heroPreviewUrl}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover scale-110 blur-md opacity-55"
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-[#001e1d]/82 via-[#001e1d]/64 to-[#003d3a]/58" />
                        </>
                      )}
                      <div className="relative z-10 p-5 sm:p-7 md:p-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-[#fffffe] break-words overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                          {headline}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <AdLandingCtaCard
                    mainAction={mainAction}
                    websiteUrl={websiteUrl}
                    telegramUrl={telegramUrl}
                  />
                </div>

                {/* Body */}
                <div className="mt-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">
                      О предложении
                    </span>
                  </div>

                  <StoryContent
                    content={
                      story.story || story.summary || "Описание недоступно."
                    }
                    isAd
                  />

                  {story.images && story.images.length > 0 && (
                    <StoryAdImages images={story.images} title={story.title} />
                  )}

                  <div className="mt-8">
                    <StoryActions isAd advertiserLink={story.advertiserLink} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/stories"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/35 px-6 py-4 text-[#abd1c6] font-semibold transition-all duration-200 hover:border-[#abd1c6]/45 hover:text-[#fffffe]"
              >
                <LucideIcons.BookOpen size="md" />
                Читать истории
              </Link>
              <Link
                href="/advertising"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-6 py-4 text-[#001e1d] font-extrabold shadow-[0_12px_36px_rgba(249,188,96,0.25)] transition-all duration-200 hover:shadow-[0_16px_44px_rgba(249,188,96,0.35)] hover:-translate-y-0.5"
              >
                <LucideIcons.Megaphone size="md" />
                Разместить рекламу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
