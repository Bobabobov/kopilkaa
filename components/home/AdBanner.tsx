"use client";

import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Advertisement {
  title: string;
  content: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
}

export default function AdBanner() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch("/api/ads?placement=home_banner", {
          cache: "no-store",
        });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as {
          title: string | null;
          content: string | null;
          imageUrl: string | null;
          linkUrl: string | null;
        } | null;
        if (!data) {
          setAd(null);
          return;
        }
        setAd({
          title: data.title || "Реклама",
          content: data.content || "",
          imageUrl: data.imageUrl,
          linkUrl: data.linkUrl,
        });
      } catch (error) {
        console.error("Error fetching banner ad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading || !ad) {
    return null;
  }

  return (
    <div className="px-4 mt-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/40 bg-gradient-to-r from-[#004643] via-[#003131] to-[#001e1d] shadow-2xl">
          <div className="grid md:grid-cols-[2fr,1.3fr] gap-0">
            {/* Текстовая часть */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#f9bc60]/10 border border-[#f9bc60]/60 text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
                <LucideIcons.Megaphone size="sm" />
                <span>Реклама</span>
              </div>

              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: "#fffffe" }}
              >
                {ad.title}
              </h2>
              <p
                className="text-sm md:text-base mb-5 max-w-xl"
                style={{ color: "#abd1c6" }}
              >
                {ad.content}
              </p>

              <div className="flex flex-wrap gap-3">
                {ad.linkUrl && (
                  <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] transition-colors shadow-md"
                  >
                    Перейти на сайт
                    <LucideIcons.ArrowRight size="sm" />
                  </a>
                )}
                <a
                  href="/advertising"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold border border-[#abd1c6] text-[#abd1c6] hover:border-[#f9bc60] hover:text-[#f9bc60] transition-colors"
                >
                  Разместить свою рекламу
                </a>
              </div>
            </div>

            {/* Картинка баннера */}
            {ad.imageUrl && (
              <div className="relative h-40 md:h-full">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#001e1d]/60 via-transparent to-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
