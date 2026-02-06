import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { SocialLinks } from "./SocialLinks";
import { FriendActions, type FriendshipStatus } from "./FriendActions";
import { GuestActionsMenu } from "./GuestActionsMenu";

type SocialUser = {
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
};

interface CtaRowProps {
  isOwner: boolean;
  hasSocialLinks: boolean;
  user: { id: string } & SocialUser;
  friendshipStatus: FriendshipStatus;
  onSendRequest?: () => Promise<void> | void;
  onAcceptIncoming?: () => Promise<void> | void;
  onDeclineIncoming?: () => Promise<void> | void;
  onRemoveFriend?: () => Promise<void> | void;
  guestActionsButtonRef: React.RefObject<HTMLElement | null>;
  guestMenuStyle: { top: number; right: number };
  mounted: boolean;
  isGuestActionsOpen: boolean;
  setIsGuestActionsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}

export function CtaRow({
  isOwner,
  hasSocialLinks,
  user,
  friendshipStatus,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
  guestActionsButtonRef,
  guestMenuStyle,
  mounted,
  isGuestActionsOpen,
  setIsGuestActionsOpen,
}: CtaRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
      {isOwner ? (
        <>{hasSocialLinks && <SocialLinks user={user} />}</>
      ) : (
        <>
          {hasSocialLinks && <SocialLinks user={user} />}
          <FriendActions
            isOwner={isOwner}
            status={friendshipStatus}
            onSendRequest={onSendRequest}
            onAcceptIncoming={onAcceptIncoming}
            onDeclineIncoming={onDeclineIncoming}
            onRemoveFriend={onRemoveFriend}
          />
          <button
            ref={guestActionsButtonRef as React.RefObject<HTMLButtonElement>}
            onClick={() => setIsGuestActionsOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
            aria-label="Меню действий гостя"
          >
            <LucideIcons.More size="sm" />
            <span className="hidden sm:inline">Ещё</span>
          </button>
          {mounted &&
            isGuestActionsOpen &&
            createPortal(
              <GuestActionsMenu
                isOpen={isGuestActionsOpen}
                style={guestMenuStyle}
                onClose={() => setIsGuestActionsOpen(false)}
                onReport={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-report-user-modal", {
                      detail: { userId: user.id },
                    }),
                  );
                }}
              />,
              document.body,
            )}
        </>
      )}
    </div>
  );
}
