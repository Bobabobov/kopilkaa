"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PROFILE_EMERALD_PANEL } from "@/components/profile/profileEmerald";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";
import { PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT } from "@/components/profile/achievements/profileAchievementPinsEvents";
import { Button } from "@/components/ui/button";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import {
  AchievementListCard,
  PROFILE_ACHIEVEMENTS_PREVIEW_LIMIT,
  sortAchievementsForPreview,
  type AchievementListItem,
} from "@/components/profile/achievements/AchievementListCard";
import { ProfileAchievementsModal } from "@/components/profile/achievements/ProfileAchievementsModal";

type AchievementsResponse = {
  success: boolean;
  data: {
    items: AchievementListItem[];
    unlockedCount: number;
    totalCount: number;
    pinnedSlugs: string[];
  };
};

type ViewerAchievementsResponse = {
  success: boolean;
  data: {
    items: AchievementListItem[];
    unlockedCount: number;
    totalCount: number;
  };
};

type ProfileAchievementsSectionProps = {
  userId: string;
  isOwner?: boolean;
};

export default function ProfileAchievementsSection({
  userId,
  isOwner = true,
}: ProfileAchievementsSectionProps) {
  const [items, setItems] = useState<AchievementListItem[]>([]);
  const [summary, setSummary] = useState({ unlockedCount: 0, totalCount: 0 });
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([]);
  const [savingPinSlug, setSavingPinSlug] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAchievements = useCallback(async () => {
    setError(null);
    try {
      const endpoint = isOwner
        ? "/api/profile/achievements"
        : `/api/users/${encodeURIComponent(userId)}/achievements`;

      const response = await fetch(endpoint, {
        cache: "no-store",
      });
      const json = (await response.json().catch(() => null)) as
        | AchievementsResponse
        | ViewerAchievementsResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(json, "Не удалось загрузить достижения"),
        );
      }

      if (isOwner) {
        const payload = json as AchievementsResponse;
        setItems(payload.data.items);
        setSummary({
          unlockedCount: payload.data.unlockedCount,
          totalCount: payload.data.totalCount,
        });
        setPinnedSlugs(payload.data.pinnedSlugs ?? []);
      } else {
        const payload = json as ViewerAchievementsResponse;
        setItems(payload.data.items);
        setSummary({
          unlockedCount: payload.data.unlockedCount,
          totalCount: payload.data.totalCount,
        });
        setPinnedSlugs([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить достижения",
      );
    } finally {
      setLoading(false);
    }
  }, [isOwner, userId]);

  useEffect(() => {
    void loadAchievements();
  }, [loadAchievements]);

  useEffect(() => {
    const handlePinsUpdated = () => {
      void loadAchievements();
    };
    window.addEventListener(
      PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT,
      handlePinsUpdated,
    );
    return () => {
      window.removeEventListener(
        PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT,
        handlePinsUpdated,
      );
    };
  }, [loadAchievements]);

  const togglePin = useCallback(
    async (slug: string) => {
      setPinError(null);
      const isPinned = pinnedSlugs.includes(slug);
      const nextPinned = isPinned
        ? pinnedSlugs.filter((item) => item !== slug)
        : [...pinnedSlugs, slug];

      setSavingPinSlug(slug);
      try {
        const response = await fetch("/api/profile/achievements/pins", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs: nextPinned }),
        });
        const json = (await response.json().catch(() => null)) as
          | { success?: boolean; data?: { pinnedSlugs?: string[] }; error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(json, "Не удалось обновить избранные достижения"),
          );
        }

        const updated = json?.data?.pinnedSlugs ?? nextPinned;
        setPinnedSlugs(updated);
        window.dispatchEvent(
          new CustomEvent(PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT, {
            detail: { userId },
          }),
        );
      } catch (err) {
        setPinError(
          err instanceof Error
            ? err.message
            : "Не удалось обновить избранные достижения",
        );
      } finally {
        setSavingPinSlug(null);
      }
    },
    [pinnedSlugs, userId],
  );

  const previewItems = useMemo(
    () =>
      sortAchievementsForPreview(items).slice(
        0,
        PROFILE_ACHIEVEMENTS_PREVIEW_LIMIT,
      ),
    [items],
  );

  const hasMoreAchievements = items.length > PROFILE_ACHIEVEMENTS_PREVIEW_LIMIT;

  return (
    <section
      aria-labelledby="profile-achievements-heading"
      className={PROFILE_EMERALD_PANEL}
    >
      <ProfileSectionTitle
        imageSrc="/icon/pig7.png"
        imageAlt="Достижения"
        title="Достижения"
        subtitle={
          isOwner
            ? "Закрепите достижения — они появятся в профиле"
            : "Полученные достижения участника"
        }
        className="mb-5"
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl bg-emerald-950/50" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-400">
          {isOwner
            ? "Пока нет полученных достижений. Выполняйте задания на сайте — они появятся здесь."
            : "У участника пока нет полученных достижений."}
        </p>
      ) : (
        <>
          {isOwner && pinError && !modalOpen && (
            <p className="mb-2 text-xs text-red-400">{pinError}</p>
          )}

          <div className="space-y-2">
            {previewItems.map((item, index) => {
              const isPinned = pinnedSlugs.includes(item.slug);
              const pinDisabled = !item.unlocked || savingPinSlug !== null;

              return (
                <AchievementListCard
                  key={item.slug}
                  item={item}
                  index={index}
                  strip
                  isOwner={isOwner}
                  isPinned={isPinned}
                  pinDisabled={pinDisabled}
                  savingPinSlug={savingPinSlug}
                  onTogglePin={isOwner ? togglePin : undefined}
                />
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500">
            Достижения: {summary.unlockedCount} из {summary.totalCount} получено
          </p>

          {hasMoreAchievements && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="mt-3 w-full border-emerald-500/20 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50"
            >
              <LucideIcons.LayoutGrid className="mr-2 h-4 w-4" />
              Смотреть все ({items.length})
            </Button>
          )}
        </>
      )}

      <ProfileAchievementsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        items={items}
        unlockedCount={summary.unlockedCount}
        totalCount={summary.totalCount}
        isOwner={isOwner}
        pinnedSlugs={pinnedSlugs}
        savingPinSlug={savingPinSlug}
        pinError={pinError}
        onTogglePin={isOwner ? togglePin : undefined}
      />
    </section>
  );
}
