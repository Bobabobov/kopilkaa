"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

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
    heroBadge?: HeroBadgeType | null;
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
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
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
    <section className="py-24 px-4" id="recent-applications">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Истории людей
          </h2>
          <p className="text-xl" style={{ color: "#abd1c6" }}>
            Люди, которым уже помогли
          </p>
        </motion.div>

        {/* Сетка заявок */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/stories/${app.id}`}
                className="block bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] h-full"
              >
                {/* Изображение */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  <img
                    src={
                      app.images && app.images.length > 0 ? app.images[0].url : "/stories-preview.jpg"
                    }
                    alt={app.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/stories-preview.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Контент */}
                <div className="p-6">
                  {/* Заголовок */}
                  <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: "#fffffe" }}>
                    {app.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-sm mb-4 line-clamp-3" style={{ color: "#abd1c6" }}>
                    {app.summary}
                  </p>

                  {/* Сумма */}
                     <div className="flex items-center justify-between mb-4">
                       <span className="text-2xl font-bold">
                         <span style={{ color: "#f9bc60" }}>
                           {app.amount.toLocaleString('ru-RU')}
                         </span>
                         <span style={{ color: "#ffffff", fontWeight: "900" }}>
                           {' '}руб
                         </span>
                       </span>
                     </div>

                  {/* Автор */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      <img
                        src={app.user && app.user.avatar ? app.user.avatar : "/default-avatar.png"}
                        alt={app.user ? (app.user.name || "User") : "User"}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <p className="text-sm font-medium truncate min-w-0" style={{ color: "#fffffe" }}>
                        {app.user ? (app.user.name || "Аноним") : "Аноним"}
                      </p>
                        {app.user?.heroBadge && <HeroBadge badge={app.user.heroBadge} size="xs" />}
                      </div>
                      <p className="text-xs" style={{ color: "#abd1c6" }}>
                        {new Date(app.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Кнопка "Смотреть все" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            Смотреть все истории
            <LucideIcons.ArrowRight size="sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}