"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/time";
import { LucideIcons } from "@/components/ui/LucideIcons";

type StoryData = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: { url: string; sort: number }[];
  _count: { likes: number };
};

interface ProfileStoriesSectionProps {
  userId: string;
  isOwner?: boolean;
}

export default function ProfileStoriesSection({
  userId,
  isOwner = false,
}: ProfileStoriesSectionProps) {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stories/user/${userId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (res.ok && json.stories) {
          setStories(json.stories);
        } else {
          setStories([]);
        }
      } catch (error) {
        console.error("Failed to load stories:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg p-4 sm:p-5 md:p-6"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-5 bg-white/10 rounded w-32"></div>
              <div className="h-3 bg-white/5 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-20 bg-white/5 rounded-xl"></div>
            <div className="h-20 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (stories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
              <LucideIcons.BookOpen className="w-5 h-5 text-[#f9bc60]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isOwner ? "Мои истории" : "Истории"}
              </h3>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LucideIcons.BookOpen className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">
              Пока нет историй
            </p>
            <p className="text-xs text-white/60 px-4">
              {isOwner
                ? "После одобрения заявки здесь появятся ваши истории"
                : "У пользователя нет историй"}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/3 backdrop-blur-xl shadow-lg"
    >
      {/* Подсветки */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#abd1c6]/10 blur-2xl rounded-full" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60]/20 to-[#f9bc60]/10 border-2 border-[#f9bc60]/40 flex items-center justify-center shadow-lg">
            <LucideIcons.BookOpen className="w-5 h-5 text-[#f9bc60]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isOwner ? "Мои истории" : "Истории"}
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              {stories.length}{" "}
              {stories.length === 1
                ? "история"
                : stories.length < 5
                  ? "истории"
                  : "историй"}
            </p>
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/stories/${story.id}`}
                className="block p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#f9bc60]/40 transition-all group"
              >
                <div className="flex gap-2 xs:gap-3">
                  {/* Image */}
                  {story.images && story.images.length > 0 ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0 group-hover:border-[#f9bc60]/50 transition-colors shadow-md">
                      <img
                        src={story.images[0].url}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/5 border-2 border-white/10 flex items-center justify-center flex-shrink-0">
                      <LucideIcons.BookOpen className="w-5 h-5 text-white/40" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-[#f9bc60] transition-colors mb-1">
                      {story.title}
                    </h4>
                    {story.summary && (
                      <p className="text-xs sm:text-sm text-white/70 line-clamp-2 mb-2">
                        {story.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <LucideIcons.Calendar className="w-3 h-3" />
                      <span>{formatRelativeDate(story.createdAt)}</span>
                      {story._count.likes > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <LucideIcons.Heart className="w-3 h-3" />
                            <span>{story._count.likes}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
