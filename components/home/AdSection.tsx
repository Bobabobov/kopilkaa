"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Megaphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
  isActive: boolean;
  placement?: string;
  config?: {
    sidebarMobileImageUrl?: string;
    sidebarMobileTitle?: string;
    sidebarMobileContent?: string;
  } | null;
}

interface AdSectionProps {
  /**
   * sidebar – горизонтальный блок под кнопками (десктоп)
   * feed – карточка в ленте (мобильный герой)
   */
  variant?: "sidebar" | "feed";
}

const SUPPORT_MAIL = "support@kopilka-online.ru";
const MAILTO_PLACEHOLDER = `mailto:${SUPPORT_MAIL}?subject=${encodeURIComponent("Размещение рекламы на главной")}`;

function AdLoading({ variant }: { variant: "sidebar" | "feed" }) {
  if (variant === "feed") {
    return (
      <div className="w-full">
        <Card variant="darkGlass" padding="md" className="border-white/10">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-4 h-9 w-full rounded-lg" />
        </Card>
      </div>
    );
  }

  return (
    <div className="order-4 xl:order-4">
      <Card variant="darkGlass" padding="lg" className="border-white/10">
        <div className="flex flex-col items-center justify-center gap-4 py-2">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
      </Card>
    </div>
  );
}

/**
 * Обёртка: карточка-клик по внешней ссылке (без вложенных <a>)
 */
function BannerLink({
  href,
  className,
  children,
}: {
  href: string | null | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block rounded-2xl outline-none ring-offset-[#004643] transition-shadow focus-visible:ring-2 focus-visible:ring-[#f9bc60]/80 focus-visible:ring-offset-2",
          className,
        )}
      >
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}

export default function AdSection({ variant = "sidebar" }: AdSectionProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAd = async () => {
      try {
        const response = await fetch("/api/ads/active", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setAd(data.ad);
        }
      } catch (error) {
        console.error("Error fetching active ad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveAd();
  }, []);

  if (loading) {
    return <AdLoading variant={variant} />;
  }

  const defaultAd = {
    title: "",
    content:
      "Ваша реклама здесь поможет поддержать проект и достичь целевой аудитории",
    imageUrl: null as string | null,
    linkUrl: null as string | null,
  };

  const displayAd = ad || defaultAd;

  if (variant === "feed") {
    const mobileImageUrl =
      ad?.config?.sidebarMobileImageUrl &&
      ad.config.sidebarMobileImageUrl.trim() !== ""
        ? ad.config.sidebarMobileImageUrl
        : displayAd.imageUrl;
    const mobileTitle =
      ad?.config?.sidebarMobileTitle &&
      ad.config.sidebarMobileTitle.trim() !== ""
        ? ad.config.sidebarMobileTitle
        : displayAd.title || "Реклама";
    const mobileContent =
      ad?.config?.sidebarMobileContent &&
      ad.config.sidebarMobileContent.trim() !== ""
        ? ad.config.sidebarMobileContent
        : displayAd.content;

    return (
      <div className="w-full">
        <Card
          variant="darkGlass"
          padding="md"
          hoverable
          className="border-white/10 shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary" className="font-bold tracking-wide">
              Реклама
            </Badge>
            <a
              href={`mailto:${SUPPORT_MAIL}`}
              className="text-xs font-semibold text-[#f9bc60] underline-offset-4 transition-colors hover:text-[#ffd27f] hover:underline"
            >
              Разместить
            </a>
          </div>

          <div className="mt-4 flex gap-3">
            {mobileImageUrl ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <img
                  src={mobileImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]">
                <Megaphone className="h-6 w-6" aria-hidden />
              </div>
            )}
            <div className="min-w-0 flex-1 text-left">
              <h3 className="text-sm font-semibold leading-snug text-[#fffffe]">
                {mobileTitle}
              </h3>
              <p className="mt-1 line-clamp-3 break-words text-xs leading-relaxed text-[#abd1c6]">
                {mobileContent}
              </p>
            </div>
          </div>

          {displayAd.linkUrl ? (
            <Button
              asChild
              className="mt-4 w-full bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#e8a545]"
              size="sm"
            >
              <a
                href={displayAd.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                Перейти
                <ExternalLink className="h-3.5 w-3.5 opacity-90" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="mt-4 w-full border-[#abd1c6]/35 text-[#abd1c6]/80"
              size="sm"
            >
              Перейти
            </Button>
          )}
        </Card>
      </div>
    );
  }

  const isFallbackAd = !ad;
  const desktopImageUrl = displayAd.imageUrl;
  const rawTitle = (displayAd.title ?? "").trim();
  const rawContent = (displayAd.content ?? "").trim();

  const desktopTitle = isFallbackAd ? "Реклама на главной" : rawTitle;
  const desktopContent = isFallbackAd
    ? "Ваше предложение увидят пользователи главной страницы. Напишите нам — подберём формат и запустим размещение."
    : rawContent;

  const isImageOnlyAd =
    Boolean(ad) && Boolean(desktopImageUrl) && !rawTitle && !rawContent;

  const showSupportEmail = isFallbackAd || (!displayAd.linkUrl && Boolean(ad));

  const bannerShell = (inner: React.ReactNode, linkUrl?: string | null) => (
    <BannerLink href={linkUrl || undefined} className="w-full">
      <Card
        padding="none"
        variant="darkGlass"
        hoverable={Boolean(linkUrl)}
        className={cn(
          "overflow-hidden border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
          linkUrl && "transition-transform duration-200 hover:-translate-y-0.5",
        )}
      >
        {inner}
      </Card>
    </BannerLink>
  );

  if (isImageOnlyAd && desktopImageUrl) {
    return (
      <div className="w-full">
        {bannerShell(
          <div className="relative isolate min-h-[220px] md:min-h-[260px]">
            <img
              src={desktopImageUrl}
              alt={ad?.title ? ad.title : "Реклама"}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-transparent to-black/15"
            />
            <Badge
              variant="secondary"
              className="absolute left-4 top-4 z-[2] border-white/15 bg-black/50 text-[10px] font-bold uppercase tracking-wider text-[#fffffe] shadow-sm backdrop-blur-md"
            >
              <Megaphone className="h-3 w-3 text-[#f9bc60]" aria-hidden />
              Реклама
            </Badge>
            <div className="absolute bottom-4 right-4 z-[2] flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
              {displayAd.linkUrl ? (
                <span className="inline-flex items-center gap-2 rounded-xl bg-[#f9bc60] px-5 py-2.5 text-sm font-semibold text-[#001e1d] shadow-lg shadow-black/30">
                  Перейти
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </span>
              ) : (
                <>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#f9bc60] font-semibold text-[#001e1d] shadow-lg shadow-black/30 hover:bg-[#e8a545]"
                  >
                    <a href={MAILTO_PLACEHOLDER}>Обсудить размещение</a>
                  </Button>
                  <a
                    href={`mailto:${SUPPORT_MAIL}`}
                    className="text-xs text-[#fffffe] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] underline-offset-2 hover:text-[#f9bc60] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {SUPPORT_MAIL}
                  </a>
                </>
              )}
            </div>
          </div>,
          displayAd.linkUrl,
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {bannerShell(
        <div className="relative isolate min-h-[220px] md:min-h-[260px]">
          {desktopImageUrl ? (
            <>
              <img
                src={desktopImageUrl}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-45"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/65 via-black/40 to-black/25"
              />
            </>
          ) : null}

          <div className="relative z-[2] flex h-full min-h-[220px] flex-col gap-6 p-6 md:min-h-[260px] md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
              <Badge
                variant="default"
                className="h-fit shrink-0 gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
              >
                <Megaphone className="h-3.5 w-3.5" aria-hidden />
                Реклама
              </Badge>
              <div className="min-w-0 space-y-1.5">
                {desktopTitle ? (
                  <h3 className="text-balance text-lg font-semibold leading-snug text-[#fffffe] md:text-xl">
                    {desktopTitle}
                  </h3>
                ) : null}
                {desktopContent ? (
                  <p className="text-pretty text-sm leading-relaxed text-[#abd1c6] md:max-w-xl">
                    {desktopContent}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              {displayAd.linkUrl ? (
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f9bc60] px-6 py-2.5 text-sm font-semibold text-[#001e1d] shadow-md shadow-black/20">
                  Перейти
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </span>
              ) : (
                <Button
                  asChild
                  className="bg-[#f9bc60] font-semibold text-[#001e1d] shadow-md hover:bg-[#e8a545]"
                >
                  <a href={MAILTO_PLACEHOLDER}>Обсудить размещение</a>
                </Button>
              )}
              {showSupportEmail ? (
                <a
                  href={`mailto:${SUPPORT_MAIL}`}
                  className="text-center text-xs text-[#abd1c6] underline-offset-2 transition-colors hover:text-[#f9bc60] hover:underline sm:text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {SUPPORT_MAIL}
                </a>
              ) : null}
            </div>
          </div>
        </div>,
        displayAd.linkUrl,
      )}
    </div>
  );
}
