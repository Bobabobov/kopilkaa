import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { SocialLinks } from "./SocialLinks";
import { FriendActions, type FriendshipStatus } from "./FriendActions";
import { OwnerActionsMenu } from "./OwnerActionsMenu";
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
  onOpenSettings?: () => void;
  onOpenCover?: () => void;
  onTriggerAvatar?: () => void;
  actionsButtonRef: React.RefObject<HTMLElement | null>;
  guestActionsButtonRef: React.RefObject<HTMLElement | null>;
  ownerMenuStyle: { top: number; right: number };
  guestMenuStyle: { top: number; right: number };
  mounted: boolean;
  isActionsMenuOpen: boolean;
  setIsActionsMenuOpen: (v: boolean | ((p: boolean) => boolean)) => void;
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
  onOpenSettings,
  onOpenCover,
  onTriggerAvatar,
  actionsButtonRef,
  guestActionsButtonRef,
  ownerMenuStyle,
  guestMenuStyle,
  mounted,
  isActionsMenuOpen,
  setIsActionsMenuOpen,
  isGuestActionsOpen,
  setIsGuestActionsOpen,
}: CtaRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {isOwner ? (
        <>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
            >
              <LucideIcons.Heart size="sm" />
              <span className="hidden xs:inline">Стать героем</span>
              <span className="xs:hidden">Герой</span>
            </Link>
          </motion.div>
          {hasSocialLinks && <SocialLinks user={user} />}
          <motion.button
            ref={actionsButtonRef as React.RefObject<HTMLButtonElement>}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsActionsMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
            aria-label="Меню ещё"
          >
            <LucideIcons.More size="sm" />
            <span className="hidden sm:inline">Ещё</span>
          </motion.button>
          {mounted &&
            isActionsMenuOpen &&
            createPortal(
              <OwnerActionsMenu
                isOpen={isActionsMenuOpen}
                style={ownerMenuStyle}
                onClose={() => setIsActionsMenuOpen(false)}
                onOpenSettings={onOpenSettings}
                onOpenCover={onOpenCover}
                onTriggerAvatar={onTriggerAvatar}
              />,
              document.body,
            )}
        </>
      ) : (
        <>
          {hasSocialLinks && <SocialLinks user={user} />}
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition-all duration-200 whitespace-nowrap"
          >
            <LucideIcons.Heart size="sm" />
            <span className="hidden xs:inline">Стать героем</span>
            <span className="xs:hidden">Герой</span>
          </Link>
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
                    new CustomEvent("open-report-user-modal", { detail: { userId: user.id } }),
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
