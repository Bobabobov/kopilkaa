"use client";

import {
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ProfileAchievementBadge } from "@/components/profile/achievements/ProfileAchievementBadge";
import { PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT } from "@/components/profile/achievements/profileAchievementPinsEvents";
import {
  fetchPinPickerData,
  invalidatePinPickerCache,
} from "@/components/profile/achievements/profileAchievementPinPickerCache";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import { cn } from "@/lib/utils";

type ProfileAchievementPinPickerPanelProps = {
  userId: string;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

export function ProfileAchievementPinPickerPanel({
  userId,
  anchorRef,
  onClose,
}: ProfileAchievementPinPickerPanelProps) {
  const [items, setItems] = useState<
    { slug: string; name: string; icon: string }[]
  >([]);
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, [anchorRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (anchorRef.current?.contains(target)) return;
      if (target.closest('[data-achievement-pin-picker="true"]')) return;
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    // Откладываем, чтобы клик по «Изменить» не закрывал только что открытую панель.
    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", handlePointerDown);
    }, 0);

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anchorRef, onClose]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchPinPickerData();
      setItems(data.unlockedItems);
      setPinnedSlugs(data.pinnedSlugs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить достижения",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const togglePin = async (slug: string) => {
    setError(null);
    const isPinned = pinnedSlugs.includes(slug);
    const nextPinned = isPinned
      ? pinnedSlugs.filter((item) => item !== slug)
      : [...pinnedSlugs, slug];

    setSavingSlug(slug);
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
          getMessageFromApiJson(json, "Не удалось сохранить выбор"),
        );
      }

      const updated = json?.data?.pinnedSlugs ?? nextPinned;
      setPinnedSlugs(updated);
      invalidatePinPickerCache();
      window.dispatchEvent(
        new CustomEvent(PROFILE_ACHIEVEMENT_PINS_UPDATED_EVENT, {
          detail: { userId },
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить выбор");
    } finally {
      setSavingSlug(null);
    }
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      data-achievement-pin-picker="true"
      className="fixed z-[99999] w-[min(100vw-1.5rem,18rem)] rounded-xl border border-emerald-500/20 bg-emerald-950/95 p-3 shadow-xl backdrop-blur-md"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      role="dialog"
      aria-label="Выбор достижений для профиля"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-emerald-400">
          Достижения в профиле ({pinnedSlugs.length})
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-zinc-500 hover:bg-emerald-950/60 hover:text-zinc-200"
          aria-label="Закрыть"
        >
          <LucideIcons.X className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-zinc-500">
          <LucideIcons.Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-3 text-xs leading-relaxed text-zinc-400">
          Пока нет полученных достижений. Выполняйте задания на сайте — они
          появятся здесь.
        </p>
      ) : (
        <ul className="custom-scrollbar max-h-56 space-y-1 overflow-y-auto overscroll-contain touch-pan-y pr-1">
          {items.map((item) => {
            const isPinned = pinnedSlugs.includes(item.slug);
            const disabled = savingSlug !== null;

            return (
              <li key={item.slug}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => void togglePin(item.slug)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors disabled:opacity-50",
                    isPinned
                      ? "bg-emerald-500/15 text-zinc-100"
                      : "text-zinc-400 hover:bg-emerald-950/50",
                  )}
                >
                  <ProfileAchievementBadge
                    icon={item.icon}
                    name={item.name}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">
                    {item.name}
                  </span>
                  {savingSlug === item.slug ? (
                    <LucideIcons.Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-400" />
                  ) : isPinned ? (
                    <LucideIcons.Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <LucideIcons.Plus className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
    </div>,
    document.body,
  );
}
