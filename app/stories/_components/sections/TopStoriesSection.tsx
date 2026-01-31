import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";

interface TopStoriesSectionProps {
  topStories: StoryItem[];
  readStoryIds: Set<string>;
}

export function TopStoriesSection({
  topStories,
  readStoryIds,
}: TopStoriesSectionProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 pt-2 pb-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-[#f9bc60]/10 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg sm:text-xl font-black text-[#fffffe]">
            Топ историй
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f9bc60]/20 text-[#f9bc60] text-[11px] font-bold uppercase tracking-wide">
            по лайкам
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topStories.map((story, index) => {
            const amountText = formatAmount(story.amount);
            const imageUrl = story.images?.[0]?.url || "/stories-preview.jpg";
            const avatarUrl = story.user?.avatar || "/default-avatar.png";
            const authorName =
              story.user?.name || story.user?.email || "Неизвестный автор";
            const rankIcon =
              index === 0 ? "Crown" : index === 1 ? "Medal" : "Award";
            const rankColor =
              index === 0
                ? "text-[#f9bc60]"
                : index === 1
                  ? "text-[#abd1c6]"
                  : "text-[#e8a545]";
            const RankIcon =
              rankIcon === "Crown"
                ? LucideIcons.Crown
                : rankIcon === "Medal"
                  ? LucideIcons.Medal
                  : LucideIcons.Award;

            return (
              <div
                key={`top-${story.id}`}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/stories/${story.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/stories/${story.id}`);
                  }
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-[#f9bc60]/50 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#f9bc60]/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={story.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/stories-preview.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-black text-white">
                    <RankIcon size="xs" className={rankColor} />
                    #{index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {story.user?.id ? (
                      <Link
                        href={`/profile/${story.user.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
                      >
                        <img
                          src={avatarUrl}
                          alt={authorName}
                          loading="lazy"
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                        <span className="line-clamp-1">{authorName}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-[#abd1c6]">
                        <img
                          src={avatarUrl}
                          alt={authorName}
                          loading="lazy"
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                        <span className="line-clamp-1">{authorName}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-[#fffffe] line-clamp-1">
                    {story.title}
                  </div>
                  <div className="text-xs text-[#abd1c6] mt-1 line-clamp-1">
                    {story.summary}
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#abd1c6] bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                      <LucideIcons.Heart size="xs" className="text-[#e16162]" />
                      {story._count?.likes ?? 0}
                    </span>
                    {amountText && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#f9bc60] bg-[#f9bc60]/10 border border-[#f9bc60]/30 rounded-full px-2 py-0.5">
                        <LucideIcons.Ruble size="xs" className="text-[#f9bc60]" />
                        {amountText} ₽
                      </span>
                    )}
                    {readStoryIds.has(story.id) && (
                      <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wide text-[#001e1d] bg-[#abd1c6] rounded-full px-2 py-0.5">
                        прочитано
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
