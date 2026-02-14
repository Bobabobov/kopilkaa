"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

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

export default function HomeAdsScene() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAd = async () => {
      try {
        const response = await fetch("/api/ads/active", { cache: "no-store" });
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

  return (
    <section className="relative py-10 px-4 pb-16 sm:py-12">
      <div className="pointer-events-none absolute right-0 top-8 h-40 w-40 rounded-full bg-[#abd1c6]/10 blur-[90px]" />
      <div className="w-full lg:pr-8 xl:pr-16">
        {loading ? (
          <div className="ml-auto rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/60 px-6 py-8 text-center shadow-lg lg:max-w-4xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9bc60] text-[#001e1d]">
              <LucideIcons.Megaphone size="sm" />
            </div>
            <p className="text-sm text-[#abd1c6]">Загружаем рекламный блок…</p>
          </div>
        ) : ad ? (
          <Link
            href={ad.linkUrl || "#"}
            target={ad.linkUrl ? "_blank" : undefined}
            rel={ad.linkUrl ? "noopener noreferrer" : undefined}
            className="block ml-auto lg:max-w-4xl"
          >
            <div className="rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/70 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#f9bc60]/40 hover:shadow-xl hover:shadow-[#f9bc60]/10">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="h-28 w-full rounded-2xl object-cover md:h-24 md:w-40"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
                    Партнёрский блок
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#fffffe]">
                    {ad.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#abd1c6]">{ad.content}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#f9bc60]">
                  Подробнее <LucideIcons.ArrowRight size="sm" />
                </div>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
