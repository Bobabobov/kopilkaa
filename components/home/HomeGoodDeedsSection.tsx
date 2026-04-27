"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { LucideIcons } from "@/components/ui/LucideIcons";

type HomeGoodDeedItem = {
  id: string;
  taskTitle: string;
  taskDescription: string;
  storyText: string;
  reward: number;
  media: { url: string; type: "IMAGE" | "VIDEO" }[];
  user: { name: string };
};

const MAX_HOME_GOOD_DEEDS = 3;

export default function HomeGoodDeedsSection() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HomeGoodDeedItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/good-deeds", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const feed = Array.isArray(json?.feed) ? json.feed : [];
        setItems(feed.slice(0, MAX_HOME_GOOD_DEEDS));
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load good deeds feed:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="pt-10 pb-24 px-4" id="home-good-deeds">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <HeartHandshake className="h-4 w-4" />
            Добрые дела
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Последние принятые отчеты
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "#abd1c6" }}
          >
            Реальные добрые дела участников: что сделали и за что начислены
            бонусы.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 items-center justify-center mb-4 border border-white/10">
              <HeartHandshake className="h-6 w-6 text-[#f9bc60]" />
            </div>
            <p className="text-[#fffffe] font-semibold mb-1">
              Пока нет принятых отчетов
            </p>
            <p className="text-sm text-[#abd1c6]">
              Как только модератор примет первые добрые дела, они появятся
              здесь.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_8px_26px_rgba(0,0,0,0.22)]"
              >
                <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <img
                    src={
                      item.media.find((m) => m.type === "IMAGE")?.url ||
                      item.media[0]?.url ||
                      "/stories-preview.jpg"
                    }
                    alt={item.taskTitle}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/stories-preview.jpg";
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
                    +{item.reward} бонусов
                  </span>
                  <span className="text-xs text-[#abd1c6]/80">
                    {item.user?.name || "Участник"}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold leading-tight text-[#fffffe] line-clamp-2">
                  {item.taskTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#abd1c6] line-clamp-3">
                  {item.storyText || item.taskDescription}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/good-deeds/deed/${item.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#fffffe] transition hover:bg-white/10 hover:border-[#f9bc60]/40"
                  >
                    Смотреть отчет
                    <LucideIcons.ArrowRight size="sm" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/good-deeds"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 bg-white/5 text-[#fffffe] hover:bg-white/10 hover:border-[#f9bc60]/30"
          >
            Все добрые дела
            <LucideIcons.ArrowRight size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
