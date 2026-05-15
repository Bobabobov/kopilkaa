"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import { HomeSectionLayout } from "@/components/home/HomeSectionLayout";

interface Application {
  id: string;
  title: string;
  summary: string;
  amount: number;
  createdAt: string;
  images: Array<{ url: string }>;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
    markedAsDeceiver?: boolean;
  };
}

// Показывает на главной последние одобренные заявки с обложкой и автором
export default function RecentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications/recent?limit=3");
        if (!response.ok) return;
        const data = (await response.json()) as {
          success?: boolean;
          applications?: Application[];
        };
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching recent applications:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white/80"></div>
            <p className="mt-4" style={{ color: "#abd1c6" }}>
              Загрузка заявок...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (applications.length === 0) {
    return null;
  }

  return (
    <section className="pt-10 pb-24 px-4" id="recent-applications">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <Heart className="w-4 h-4" />
            Реальные истории
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Истории людей
          </h2>
          <p
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: "#abd1c6" }}
          >
            Люди, которым уже помогли
          </p>
        </motion.div>

        <HomeSectionLayout ariaLabel="Истории людей">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <Link
                href={`/stories/${app.id}`}
                className="group block h-full rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                {/* Изображение */}
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img
                    src={
                      app.images && app.images.length > 0
                        ? app.images[0].url
                        : "/stories-preview.jpg"
                    }
                    alt={app.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/stories-preview.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: "rgba(249, 188, 96, 0.95)",
                      color: "#001e1d",
                    }}
                  >
                    Помогли
                  </span>
                </div>

                {/* Контент */}
                <div className="p-5 sm:p-6">
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2 leading-snug transition-colors group-hover:text-[#f9bc60]"
                    style={{ color: "#fffffe" }}
                  >
                    {app.title}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-3 leading-relaxed"
                    style={{ color: "#abd1c6" }}
                  >
                    {app.summary}
                  </p>

                  {/* Сумма */}
                  <div
                    className="inline-flex items-baseline gap-1 rounded-xl px-3 py-1.5 mb-4"
                    style={{ background: "rgba(249, 188, 96, 0.12)" }}
                  >
                    <span
                      className="text-xl font-bold tabular-nums"
                      style={{ color: "#f9bc60" }}
                    >
                      {app.amount.toLocaleString("ru-RU")}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#f9bc60" }}
                    >
                      руб
                    </span>
                  </div>

                  {/* Автор */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10 group-hover:ring-[#f9bc60]/40 transition-all">
                      <img
                        src={resolveAvatarUrl(app.user?.avatar)}
                        alt={app.user ? app.user.name || "User" : "User"}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="flex items-center gap-1.5 text-sm font-medium truncate"
                        style={{ color: "#fffffe" }}
                      >
                        <span className="truncate">
                          {app.user ? app.user.name || "Аноним" : "Аноним"}
                        </span>
                        {app.user ? (
                          <UserPublicBadges
                            markedAsDeceiver={app.user.markedAsDeceiver}
                          />
                        ) : null}
                      </p>
                      <p className="text-xs" style={{ color: "#94a1b2" }}>
                        {new Date(app.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </HomeSectionLayout>

        {/* Кнопка "Смотреть все" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 8px 32px rgba(249, 188, 96, 0.25)",
            }}
          >
            Смотреть все истории
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
