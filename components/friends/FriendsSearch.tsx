"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";

const MIN_SEARCH_LENGTH = 2;

interface FriendsSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: any[];
  searchLoading: boolean;
  currentUserId: string | null;
  getUserStatus: (lastSeen: string | null) => {
    status: "online" | "offline";
    text: string;
  };
  sendingRequests: Set<string>;
  onSendRequest: (userId: string) => Promise<void> | void;
  onCancelRequest: (
    friendshipId: string,
    userId: string,
  ) => Promise<void> | void;
}

export function FriendsSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  getUserStatus,
  sendingRequests,
  onSendRequest,
  onCancelRequest,
}: FriendsSearchProps) {
  const trimmedQuery = searchQuery.trim();
  const hasEnoughChars = trimmedQuery.length >= MIN_SEARCH_LENGTH;
  const showEmptyState = !hasEnoughChars && !searchLoading;
  const showNoResults =
    hasEnoughChars && !searchLoading && searchResults.length === 0;

  const [onlineOnly, setOnlineOnly] = useState(false);

  // Сначала онлайн, потом остальные
  const sortedResults = useMemo(() => {
    return [...searchResults].sort((a, b) => {
      const statusA = getUserStatus(a.lastSeen ?? null).status;
      const statusB = getUserStatus(b.lastSeen ?? null).status;
      if (statusA === "online" && statusB !== "online") return -1;
      if (statusA !== "online" && statusB === "online") return 1;
      return 0;
    });
  }, [searchResults, getUserStatus]);

  const onlineCount = useMemo(
    () =>
      searchResults.filter(
        (u) => getUserStatus(u.lastSeen ?? null).status === "online",
      ).length,
    [searchResults, getUserStatus],
  );

  const visibleResults = useMemo(
    () =>
      onlineOnly
        ? sortedResults.filter(
            (u) => getUserStatus(u.lastSeen ?? null).status === "online",
          )
        : sortedResults,
    [sortedResults, onlineOnly, getUserStatus],
  );

  let content: React.ReactNode;
  if (searchLoading) {
    content = (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#abd1c6]">Поиск...</p>
      </div>
    );
  } else if (showEmptyState) {
    content = (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-white/10 bg-[#004643]/40 backdrop-blur-sm">
        <div className="inline-flex w-14 h-14 rounded-full bg-white/10 items-center justify-center mb-4">
          <LucideIcons.Search size="lg" className="w-7 h-7 text-[#abd1c6]" />
        </div>
        <p className="text-[#fffffe] font-medium mb-1">
          Найдите друзей по имени или никнейму
        </p>
        <p className="text-[#abd1c6] text-sm">
          {trimmedQuery.length === 0
            ? "Введите минимум 2 символа для поиска"
            : `Введите ещё ${MIN_SEARCH_LENGTH - trimmedQuery.length} символ${MIN_SEARCH_LENGTH - trimmedQuery.length === 1 ? "" : "а"} для поиска`}
        </p>
      </div>
    );
  } else if (showNoResults) {
    content = (
      <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-[#004643]/40 backdrop-blur-sm">
        <p className="text-[#abd1c6]">Пользователи не найдены</p>
      </div>
    );
  } else {
    content = renderResultsList();
  }

  function renderResultsList() {
    return (
      <div className="space-y-3 min-w-0">
        {onlineCount > 0 && (
          <p className="text-xs text-[#10B981] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            В сети сейчас: {onlineCount}
          </p>
        )}
        {visibleResults.length === 0 && onlineOnly && (
          <p className="text-xs text-[#abd1c6]/80">
            Сейчас никто из найденных не в сети. Снимите фильтр "Только онлайн",
            чтобы увидеть всех.
          </p>
        )}
        {visibleResults.map((user: any) => {
          const status = getUserStatus(user.lastSeen ?? null);
          const isOnline = status.status === "online";
          return (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] w-full min-w-0 transition-all duration-200 hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
            >
              <Link
                href={`/profile/${user.id}`}
                prefetch={false}
                className="flex items-center gap-3 flex-1 group min-w-0"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#004643] rounded-full flex items-center justify-center group-hover:ring-2 group-hover:ring-[#f9bc60]/40 transition overflow-hidden">
                    <img
                      src={resolveAvatarUrl(user.avatar)}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#001e1d] bg-[#10B981]"
                      title="В сети"
                      aria-hidden
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <p
                      className="text-[#fffffe] font-medium group-hover:underline min-w-0 flex-1 truncate"
                      title={
                        user.name ||
                        (user.email
                          ? user.email.split("@")[0]
                          : "Пользователь")
                      }
                    >
                      {user.name ||
                        (user.email
                          ? user.email.split("@")[0]
                          : "Пользователь")}
                    </p>
                    {isOnline ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                        В сети
                      </span>
                    ) : (
                      <span className="text-[#abd1c6] text-sm shrink-0">
                        {status.text}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                {user.friendshipStatus !== "PENDING" &&
                  user.friendshipStatus !== "ACCEPTED" && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!sendingRequests.has(user.id)) {
                          await onSendRequest(user.id);
                        }
                      }}
                      disabled={sendingRequests.has(user.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingRequests.has(user.id)
                        ? "Отправка..."
                        : "Добавить"}
                    </button>
                  )}

                {user.friendshipStatus === "PENDING" &&
                  user.isRequester &&
                  user.friendshipId && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (
                          !sendingRequests.has(user.id) &&
                          user.friendshipId
                        ) {
                          await onCancelRequest(user.friendshipId, user.id);
                        }
                      }}
                      disabled={sendingRequests.has(user.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#6B7280] hover:bg-[#4B5563] text-[#fffffe] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отменить
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] flex items-center justify-center shadow-lg">
            <LucideIcons.Users size="sm" className="text-[#001e1d]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-[#fffffe]">
              Поиск друзей
            </p>
            <p className="text-[11px] sm:text-xs text-[#abd1c6]">
              Имя, @логин или email. Минимум 2 символа.
            </p>
          </div>
        </div>
        {onlineCount > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#10B981] bg-[#001e1d]/60 px-2.5 py-1 rounded-full border border-[#10B981]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            В сети: {onlineCount}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#abd1c6]">
          <LucideIcons.Search size="sm" className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Имя или @логин (минимум 2 символа)"
          className="w-full pl-10 pr-4 py-3 bg-[#001e1d]/40 border border-[#abd1c6]/25 rounded-2xl text-[#fffffe] placeholder-[#abd1c6] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent shadow-[0_18px_45px_-24px_rgba(0,0,0,0.8)]"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#abd1c6]">Фильтры:</span>
          <button
            type="button"
            onClick={() => setOnlineOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
              onlineOnly
                ? "bg-[#10B981]/20 border-[#10B981]/60 text-[#e0fdf4]"
                : "bg-[#001e1d]/40 border-[#abd1c6]/40 text-[#abd1c6] hover:border-[#f9bc60]/60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Только онлайн
            {onlineCount > 0 && (
              <span className="opacity-80">· {onlineCount}</span>
            )}
          </button>
        </div>
      )}
      {content}
    </div>
  );
}
