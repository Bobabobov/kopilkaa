"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProfileAchievementBadge } from "@/components/profile/achievements/ProfileAchievementBadge";
import { ProfileAchievementPinPickerPanel } from "@/components/profile/achievements/ProfileAchievementPinPickerPanel";
import {
  PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT,
  type ProfileAchievementShowcaseItem,
} from "@/components/profile/achievements/profileAchievementPinsEvents";
import { ProfileImageIcon } from "@/components/profile/ProfileImageIcon";
import { PROFILE_EMERALD_PANEL } from "@/components/profile/profileEmerald";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getShowcaseChipEnterClass,
  getShowcaseChipEnterStyle,
} from "@/components/profile/achievements/showcaseAchievementMotion";
import { prefetchPinPickerData } from "@/components/profile/achievements/profileAchievementPinPickerCache";
import { useHorizontalScrollPan } from "@/hooks/useHorizontalScrollPan";
import { cn } from "@/lib/utils";

type ShowcaseResponse = {
  success: boolean;
  data: ProfileAchievementShowcaseItem[];
};

type ProfileAchievementShowcaseStripProps = {
  userId: string;
  isOwner?: boolean;
};

const CAROUSEL_NAV_CLASS = cn(
  "h-8 w-8 rounded-full border border-emerald-500/25 bg-emerald-950/90 text-emerald-400",
  "shadow-[0_4px_16px_rgba(0,0,0,0.35)]",
  "hover:border-emerald-400/50 hover:bg-emerald-950 hover:text-emerald-300",
  "disabled:opacity-20",
);

const STRIP_SEPARATOR = "hidden h-5 w-px shrink-0 bg-emerald-500/15 sm:inline";

function ShowcaseAchievementChip({
  item,
  variant,
  index,
  reducedMotion,
}: {
  item: ProfileAchievementShowcaseItem;
  variant: "mobile" | "desktop";
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      className={cn(
        "shrink-0",
        variant === "mobile"
          ? "flex w-full flex-col items-center gap-2.5"
          : "group flex max-w-[15rem] items-center gap-3",
        getShowcaseChipEnterClass(reducedMotion),
      )}
      style={getShowcaseChipEnterStyle(index, reducedMotion)}
      title={item.name}
    >
      <div
        className={cn(
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          variant === "desktop" &&
            "group-hover:scale-[1.05] group-active:scale-[0.98] motion-reduce:group-hover:scale-100",
        )}
      >
        <ProfileAchievementBadge
          icon={item.icon}
          name={item.name}
          size="strip"
          variant="floating"
          className="drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]"
        />
      </div>
      <span
        className={cn(
          "transition-colors duration-200",
          variant === "mobile"
            ? "line-clamp-2 w-full text-center text-xs leading-snug text-zinc-400"
            : "truncate text-sm font-medium text-zinc-100 group-hover:text-emerald-400",
        )}
      >
        {item.name}
      </span>
    </div>
  );
}

function AchievementDesktopScrollRow({
  items,
  reducedMotion,
}: {
  items: ProfileAchievementShowcaseItem[];
  reducedMotion: boolean;
}) {
  const { ref, isDragging, scrollProps } = useHorizontalScrollPan();

  return (
    <div
      ref={ref}
      {...scrollProps}
      className={cn(
        "custom-scrollbar hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto overscroll-x-contain pb-0.5 sm:flex [scrollbar-width:thin]",
        "touch-pan-x",
        isDragging ? "cursor-grabbing select-none" : "cursor-grab",
      )}
      aria-label="Список закреплённых достижений"
      title="Листайте: Shift + колёсико или перетащите мышью"
    >
      {items.map((item, index) => (
        <ShowcaseAchievementChip
          key={item.slug}
          item={item}
          variant="desktop"
          index={index}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function AchievementMobileCarousel({
  items,
  reducedMotion,
}: {
  items: ProfileAchievementShowcaseItem[];
  reducedMotion: boolean;
}) {
  return (
    <div className="w-full min-w-0 sm:hidden">
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          dragFree: true,
        }}
        className="relative w-full px-9"
      >
        <CarouselContent className="-ml-2 py-1">
          {items.map((item, index) => (
            <CarouselItem key={item.slug} className="basis-[6.75rem] pl-2">
              <ShowcaseAchievementChip
                item={item}
                variant="mobile"
                index={index}
                reducedMotion={reducedMotion}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className={cn(CAROUSEL_NAV_CLASS, "left-0 top-[calc(50%-4px)]")}
        />
        <CarouselNext
          variant="outline"
          className={cn(CAROUSEL_NAV_CLASS, "right-0 top-[calc(50%-4px)]")}
        />
      </Carousel>
    </div>
  );
}

export function ProfileAchievementShowcaseStrip({
  userId,
  isOwner = false,
}: ProfileAchievementShowcaseStripProps) {
  const [items, setItems] = useState<ProfileAchievementShowcaseItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const loadShowcase = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/users/${encodeURIComponent(userId)}/achievements/showcase`,
        { cache: "no-store" },
      );
      const json = (await response.json().catch(() => null)) as
        | ShowcaseResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(json, "Не удалось загрузить достижения профиля"),
        );
      }

      setItems((json as ShowcaseResponse).data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, [userId]);

  useEffect(() => {
    void loadShowcase();
    if (isOwner) {
      prefetchPinPickerData();
    }
  }, [loadShowcase, isOwner]);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (!detail?.userId || detail.userId === userId) {
        void loadShowcase();
      }
    };

    window.addEventListener(PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(
        PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT,
        handleUpdate,
      );
    };
  }, [loadShowcase, userId]);

  if (!loaded) {
    return null;
  }

  const isEmpty = items.length === 0;
  const emptyMessage = isOwner
    ? "Закрепите полученные достижения — они появятся здесь"
    : "Участник ещё не закрепил достижения в профиле";

  const editButtonLabel = isEmpty ? "Выбрать" : "Изменить";
  const editButtonClass = cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded-xl border text-sm font-semibold transition-colors",
    pickerOpen
      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-400"
      : "border-emerald-500/15 bg-emerald-950/40 text-zinc-400 hover:border-emerald-400/30 hover:bg-emerald-950/60 hover:text-emerald-400",
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        PROFILE_EMERALD_PANEL,
        "relative flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:py-5",
        !reducedMotion &&
          "animate-in fade-in-0 slide-in-from-bottom-3 duration-500",
      )}
      role="region"
      aria-label="Закреплённые достижения"
    >
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
        <ProfileImageIcon
          src="/icon/pig7.png"
          alt=""
          size="sm"
          className="drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]"
        />
        <span className="text-xs font-bold uppercase tracking-wide text-emerald-400">
          Достижения
        </span>
        {!isEmpty && (
          <Badge
            variant="outline"
            className="border-emerald-500/25 bg-emerald-500/10 font-semibold text-emerald-400"
          >
            {items.length}
          </Badge>
        )}

        {isOwner && (
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className={cn(editButtonClass, "ml-auto px-2.5 py-2 sm:hidden")}
            aria-expanded={pickerOpen}
            aria-label={
              isEmpty ? "Выбрать достижения" : "Изменить достижения"
            }
          >
            <LucideIcons.Plus className="h-4 w-4" />
            <span className="sr-only">{editButtonLabel}</span>
          </button>
        )}
      </div>

      {isEmpty ? (
        <p className="w-full min-w-0 text-sm text-zinc-400 sm:flex-1">
          {emptyMessage}
        </p>
      ) : (
        <>
          <AchievementMobileCarousel
            items={items}
            reducedMotion={reducedMotion}
          />

          <span className={STRIP_SEPARATOR} aria-hidden />

          <AchievementDesktopScrollRow
            items={items}
            reducedMotion={reducedMotion}
          />
        </>
      )}

      {isOwner && (
        <>
          <span className={STRIP_SEPARATOR} aria-hidden />
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className={cn(editButtonClass, "hidden px-3 py-2 sm:inline-flex")}
            aria-expanded={pickerOpen}
            aria-label={
              isEmpty ? "Выбрать достижения" : "Изменить достижения"
            }
          >
            <LucideIcons.Plus className="h-4 w-4" />
            {editButtonLabel}
          </button>
        </>
      )}

      {pickerOpen && isOwner && (
        <ProfileAchievementPinPickerPanel
          userId={userId}
          anchorRef={rootRef}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
