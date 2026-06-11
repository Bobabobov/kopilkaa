"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <section aria-labelledby="profile-achievements-heading" className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <ProfileSectionTitle
          imageSrc="/icon/pig7.png"
          imageAlt="Достижения"
          title="Достижения"
          subtitle={
            isOwner
              ? "Закрепите достижения — они появятся в профиле"
              : "Полученные достижения участника"
          }
        />
        {!loading && !error && summary.totalCount > 0 && (
          <Badge
            variant="outline"
            className="border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]"
          >
            {summary.unlockedCount} из {summary.totalCount} получено
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4 text-sm text-[#e16162]">{error}</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4 text-sm text-[#94a1b2]">
            {isOwner
              ? "Пока нет полученных достижений. Выполняйте задания на сайте — они появятся здесь."
              : "У участника пока нет полученных достижений."}
          </CardContent>
        </Card>
      ) : (
        <>
          {isOwner && pinError && !modalOpen && (
            <p className="text-xs text-[#e16162]">{pinError}</p>
          )}

          <div className="grid grid-cols-1 gap-3">
            {previewItems.map((item, index) => {
              const isPinned = pinnedSlugs.includes(item.slug);
              const pinDisabled = !item.unlocked || savingPinSlug !== null;

              return (
                <AchievementListCard
                  key={item.slug}
                  item={item}
                  index={index}
                  compact
                  isOwner={isOwner}
                  isPinned={isPinned}
                  pinDisabled={pinDisabled}
                  savingPinSlug={savingPinSlug}
                  onTogglePin={isOwner ? togglePin : undefined}
                />
              );
            })}
          </div>

          {hasMoreAchievements && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="w-full border-[#f9bc60]/30 bg-[#f9bc60]/10 text-[#f9bc60] hover:bg-[#f9bc60]/15"
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
