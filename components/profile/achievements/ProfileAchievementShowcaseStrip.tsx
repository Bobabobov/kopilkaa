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
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  getShowcaseChipEnterClass,
  getShowcaseChipEnterStyle,
} from "@/components/profile/achievements/showcaseAchievementMotion";
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
  "h-8 w-8 rounded-full border border-[#abd1c6]/35 bg-[#001e1d]/95 text-[#f9bc60]",
  "shadow-[0_4px_16px_rgba(0,0,0,0.35)]",
  "hover:bg-[#001e1d] hover:border-[#f9bc60]/50",
  "disabled:opacity-20",
);

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
        />
      </div>
      <span
        className={cn(
          "transition-colors duration-200",
          variant === "mobile"
            ? "line-clamp-2 w-full text-center text-xs leading-snug text-[#abd1c6]"
            : "truncate text-sm font-medium text-[#fffffe] group-hover:text-[#f9bc60]",
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
        isDragging
          ? "cursor-grabbing select-none"
          : "cursor-grab",
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
  }, [loadShowcase]);

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
  const editButtonClass = `inline-flex shrink-0 items-center gap-1.5 rounded-xl border text-sm font-semibold transition-colors ${
    pickerOpen
      ? "border-[#f9bc60]/50 bg-[#f9bc60]/15 text-[#f9bc60]"
      : "border-white/10 bg-white/5 text-[#abd1c6] hover:border-[#f9bc60]/35 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
  }`;

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex min-w-0 flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:gap-4 sm:p-5",
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
          className="drop-shadow-[0_3px_12px_rgba(249,188,96,0.4)]"
        />
        <span className="text-xs uppercase tracking-wider text-[#abd1c6]/90">
          Достижения
        </span>
        {!isEmpty && (
          <Badge variant="default" className="font-semibold">
            {items.length}
          </Badge>
        )}

        {isOwner && (
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className={`${editButtonClass} ml-auto px-2.5 py-2 sm:hidden`}
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
        <p className="w-full min-w-0 text-sm text-[#abd1c6]/90 sm:flex-1">
          {emptyMessage}
        </p>
      ) : (
        <>
          <AchievementMobileCarousel
            items={items}
            reducedMotion={reducedMotion}
          />

          <span className="hidden h-5 w-px shrink-0 bg-[#abd1c6]/30 sm:inline" />

          <AchievementDesktopScrollRow
            items={items}
            reducedMotion={reducedMotion}
          />
        </>
      )}

      {isOwner && (
        <>
          <span className="hidden h-5 w-px shrink-0 bg-[#abd1c6]/30 sm:inline" />
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            className={`${editButtonClass} hidden px-3 py-2 sm:inline-flex`}
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
