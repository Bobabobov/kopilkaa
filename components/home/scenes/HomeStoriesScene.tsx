"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";
import GlareHover from "@/components/ui/glare-hover";

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
  };
}

export default function HomeStoriesScene() {
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
      <section className="py-16 px-4 sm:py-20 md:py-24">
        <div className="w-full">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
          <p className="mt-4 text-sm text-[#abd1c6]">Загрузка заявок...</p>
        </div>
      </section>
    );
  }

  if (applications.length === 0) {
    return null;
  }

  const [first, second, third] = applications;

  return (
    <section className="relative py-16 px-4 sm:py-20 md:py-24" id="recent-applications">
      <div className="pointer-events-none absolute left-6 top-10 h-52 w-52 rounded-full bg-[#f9bc60]/10 blur-[110px]" />
      <div className="w-full lg:pl-8 xl:pl-16">
        <motion.div
          className="max-w-2xl text-left lg:ml-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            Реальные истории
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Истории людей
          </h2>
          <p className="mt-3 text-base text-[#abd1c6] sm:text-lg">
            Люди, которым уже помогли
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,1.1fr)_minmax(240px,0.9fr)] lg:items-start lg:pr-12">
          {first && (
            <Link href={`/stories/${first.id}`} className="lg:translate-y-6">
              <GlareHover
                className="h-full rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/70 p-0 text-left shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-rotate-1"
                borderRadius="24px"
                borderColor="rgba(249, 188, 96, 0.3)"
                glareOpacity={0.25}
              >
                <Card variant="glass" padding="none" className="h-full">
                  <div className="relative h-64 overflow-hidden rounded-3xl md:h-72">
                    <img
                      src={
                        first.images?.length > 0
                          ? first.images[0].url
                          : "/stories-preview.jpg"
                      }
                      alt={first.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/stories-preview.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="default">
                        {first.amount.toLocaleString("ru-RU")} ₽
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#fffffe]">
                      {first.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-[#abd1c6]">
                      {first.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-[#abd1c6]">
                      <span>{first.user?.name || "Аноним"}</span>
                      <span>•</span>
                      <span>
                        {new Date(first.createdAt).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                </Card>
              </GlareHover>
            </Link>
          )}
          <div className="flex flex-col gap-6 lg:-translate-y-6">
            {[second, third].filter(Boolean).map((app) => {
              const data = app as Application;
              return (
                <Link key={data.id} href={`/stories/${data.id}`}>
                  <Card
                    variant="glass"
                    padding="none"
                  className="h-full overflow-hidden rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#f9bc60]/50 hover:shadow-xl hover:shadow-[#f9bc60]/10"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          data.images?.length > 0
                            ? data.images[0].url
                            : "/stories-preview.jpg"
                        }
                        alt={data.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/stories-preview.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h4 className="text-base font-semibold text-[#fffffe]">
                        {data.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm text-[#abd1c6]">
                        {data.summary}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-start lg:ml-auto lg:max-w-xs">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 border-[#abd1c6]/50 px-10 py-6 text-lg font-semibold text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/15 hover:text-[#f9bc60]"
          >
            <Link href="/stories" className="inline-flex items-center gap-3">
              Смотреть все истории
              <LucideIcons.ArrowRight size="md" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
