"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeDate } from "@/lib/time";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import {
  PROFILE_EMERALD_INNER,
  PROFILE_EMERALD_PANEL,
} from "@/components/profile/profileEmerald";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  STORY_REACTION_TYPES,
  type StoryReactionCounts,
} from "@/lib/stories/reactions";
import { StoryReactionIcon } from "@/components/stories/StoryReactionIcon";

type StoryData = {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: { url: string; sort: number }[];
  _count: { likes: number };
  reactionCounts?: StoryReactionCounts;
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
        logRouteCatchError("[ProfileStoriesSection] load", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [userId]);

  const title = isOwner ? "Мои истории" : "Истории";

  if (loading) {
    return (
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={PROFILE_EMERALD_PANEL}
      >
        <Skeleton className="mb-4 h-8 w-40 rounded-lg bg-emerald-950/50" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl bg-emerald-950/50" />
          <Skeleton className="h-20 w-full rounded-xl bg-emerald-950/50" />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={PROFILE_EMERALD_PANEL}
    >
      <ProfileSectionTitle
        imageSrc="/icon/pig4.png"
        imageAlt={title}
        title={title}
        subtitle={
          stories.length > 0
            ? `${stories.length} ${
                stories.length === 1
                  ? "история"
                  : stories.length < 5
                    ? "истории"
                    : "историй"
              }`
            : undefined
        }
        className="mb-5"
      />

      {stories.length === 0 ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-950/30">
            <LucideIcons.BookOpen className="h-7 w-7 text-emerald-500/40" />
          </div>
          <p className="mb-1 text-sm font-medium text-zinc-200">
            Пока нет историй
          </p>
          <p className="px-4 text-xs text-zinc-500">
            {isOwner
              ? "После одобрения заявки здесь появятся ваши истории"
              : "У пользователя нет историй"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={`/stories/${story.id}`}
                className={`group block p-3 transition-colors hover:bg-emerald-950/40 sm:p-4 ${PROFILE_EMERALD_INNER}`}
              >
                <div className="flex gap-3">
                  {story.images && story.images.length > 0 ? (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-emerald-500/20 sm:h-24 sm:w-24">
                      <img
                        src={story.images[0].url}
                        alt={story.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/30 sm:h-24 sm:w-24">
                      <LucideIcons.BookOpen className="h-5 w-5 text-emerald-500/40" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-100 transition-colors group-hover:text-emerald-400 sm:text-base">
                      {story.title}
                    </h4>
                    {story.summary && (
                      <p className="mb-2 line-clamp-2 text-xs text-zinc-400 sm:text-sm">
                        {story.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <LucideIcons.Calendar className="h-3 w-3" />
                      <span>{formatRelativeDate(story.createdAt)}</span>
                      {story._count.likes > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            {STORY_REACTION_TYPES.filter(
                              (type) =>
                                (story.reactionCounts?.[type] ?? 0) > 0,
                            ).map((type) => (
                              <StoryReactionIcon
                                key={type}
                                type={type}
                                size="xs"
                                className="shrink-0"
                              />
                            ))}
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
      )}
    </motion.article>
  );
}
