// components/stories/TimelineStoryCard.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getAvatarFrame } from "@/lib/header-customization";

interface TimelineStoryCardProps {
  story: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    images: { url: string; sort: number }[];
    user: {
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
      avatarFrame: string | null;
      headerTheme: string | null;
      hideEmail?: boolean;
    };
    _count: {
      likes: number;
    };
  };
  index: number;
}

export function TimelineStoryCard({ story, index }: TimelineStoryCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
      }}
      className="relative flex items-center"
    >
      {/* Timeline Dot */}
      <div className="absolute left-8 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
          className="w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg"
        />
      </div>

      {/* Story Card */}
      <div
        className={`ml-20 w-full max-w-2xl ${isEven ? "mr-auto" : "ml-auto"}`}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={() => (window.location.href = `/stories/${story.id}`)}
        >
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            {story.images && story.images.length > 0 ? (
              <img
                src={story.images[0].url}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                <LucideIcons.BookOpen
                  size="xl"
                  className="text-blue-500 dark:text-blue-400"
                />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Date Badge */}
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              {new Date(story.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {story.title}
            </h3>

            {/* Summary */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
              {story.summary}
            </p>

            {/* Author and Stats */}
            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {story.user.avatar ? (
                    <img
                      src={story.user.avatar}
                      alt="Аватар"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold">
                      {(story.user.name ||
                        (!story.user.hideEmail
                          ? story.user.email
                          : "Пользователь"))[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {story.user.name ||
                      (!story.user.hideEmail
                        ? story.user.email.split("@")[0]
                        : "Пользователь")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Автор истории
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-red-500">
                  <LucideIcons.Heart size="sm" />
                  <span className="text-sm font-medium">
                    {story._count.likes}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                  <LucideIcons.Clock size="sm" />
                  <span className="text-sm font-medium">
                    {Math.max(1, Math.ceil(story.summary.length / 200))} мин
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
