import type { ReactNode } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/Card";
import type { Friendship } from "./types";
import { FriendPreviewCard } from "./FriendPreviewCard";

interface FriendsPreviewListProps {
  friends: Friendship[];
  currentUserId: string | null;
  totalFriends: number;
  pendingRequests: number;
  sentRequestsCount: number;
  newRequestsCount: number;
  onOpenProfile: (userId: string) => void;
  onNavigate: (tab: "friends" | "sent" | "received" | "search") => void;
}

function PreviewActionRow({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left transition-colors hover:border-[#abd1c6]/25 hover:bg-white/[0.07]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#fffffe]">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-[#abd1c6]">{subtitle}</p>
          )}
        </div>
      </div>
      <LucideIcons.ChevronRight className="shrink-0 text-[#abd1c6]" size="sm" />
    </button>
  );
}

export function FriendsPreviewList({
  friends,
  currentUserId,
  totalFriends,
  pendingRequests,
  sentRequestsCount,
  newRequestsCount,
  onOpenProfile,
  onNavigate,
}: FriendsPreviewListProps) {
  const previewFriends = friends.slice(0, 4);

  return (
    <div className="space-y-4">
      {previewFriends.length > 0 && (
        <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
          {previewFriends.map((friendship, index) => (
            <FriendPreviewCard
              key={friendship.id}
              friendship={friendship}
              currentUserId={currentUserId}
              index={index}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </div>
      )}

      {totalFriends > 4 && (
        <PreviewActionRow
          icon={<LucideIcons.Users className="text-[#abd1c6]" size="sm" />}
          title={`Ещё ${totalFriends - 4} друзей`}
          subtitle="Открыть полный список"
          onClick={() => onNavigate("friends")}
        />
      )}

      {pendingRequests > 0 && (
        <PreviewActionRow
          icon={
            <div className="relative">
              <LucideIcons.UserCheck className="text-[#f9bc60]" size="sm" />
              {newRequestsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#e16162]" />
              )}
            </div>
          }
          title={`${pendingRequests} заявок в друзья`}
          subtitle={
            newRequestsCount > 0
              ? `${newRequestsCount} новых`
              : "Принять или отклонить"
          }
          onClick={() => onNavigate("received")}
        />
      )}

      {sentRequestsCount > 0 && (
        <PreviewActionRow
          icon={<LucideIcons.Send className="text-[#abd1c6]" size="sm" />}
          title={`${sentRequestsCount} отправленных заявок`}
          subtitle="Можно отменить или подождать ответа"
          onClick={() => onNavigate("sent")}
        />
      )}

      {totalFriends > 0 && (
        <CardFooter className="!mt-0 flex flex-col gap-3 border-[#abd1c6]/10 !p-0 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-snug text-[#667a73] sm:text-xs">
            Ищите участников по имени или нику.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full shrink-0 border-[#abd1c6]/25 bg-transparent text-[#fffffe] hover:bg-white/5 hover:text-[#fffffe] sm:w-auto"
            onClick={() => onNavigate("search")}
          >
            <LucideIcons.UserPlus className="mr-2 h-4 w-4" />
            Найти друзей
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
