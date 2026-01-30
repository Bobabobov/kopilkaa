"use client";

import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import TrustLevelCard from "@/components/profile/TrustLevelCard";
import ProfileReviewSection from "@/components/profile/sections/ProfileReviewSection";
import ProfileStoriesSection from "@/components/profile/sections/ProfileStoriesSection";
import MutualFriends from "./widgets/MutualFriends";
import OtherUserPersonalStats from "./OtherUserPersonalStats";
import OtherUserActivity from "./OtherUserActivity";
import { OtherUserProfileBackLink } from "./OtherUserProfileBackLink";
import type { OtherUserProfileUser } from "./types";

interface OtherUserProfileContentProps {
  user: OtherUserProfileUser;
  resolvedUserId: string;
  friendshipStatus: "none" | "requested" | "incoming" | "friends";
  friendship: { status: string } | null;
  trustDerived: {
    trustStatus: string;
    supportText: string;
    progressText: string | null;
    progressValue: number | null;
    progressCurrent: number | null;
    progressTotal: number | null;
  };
  onSendRequest: () => Promise<void>;
  onAcceptIncoming: () => Promise<void>;
  onDeclineIncoming: () => Promise<void>;
  onRemoveFriend: (() => Promise<void>) | undefined;
}

export function OtherUserProfileContent({
  user,
  resolvedUserId,
  friendshipStatus,
  friendship,
  trustDerived,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
  onRemoveFriend,
}: OtherUserProfileContentProps) {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 pt-0 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <OtherUserProfileBackLink />

        <div className="mb-4 sm:mb-6">
          <ProfileHeaderCard
            user={user}
            isOwner={false}
            friendshipStatus={friendshipStatus}
            onSendRequest={onSendRequest}
            onAcceptIncoming={onAcceptIncoming}
            onDeclineIncoming={onDeclineIncoming}
            onRemoveFriend={onRemoveFriend}
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <MutualFriends userId={resolvedUserId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          <section className="lg:col-span-7 space-y-4 sm:space-y-5 md:space-y-6">
            <TrustLevelCard
              status={trustDerived.trustStatus}
              supportText={trustDerived.supportText}
              progressText={trustDerived.progressText}
              progressValue={trustDerived.progressValue}
              progressCurrent={trustDerived.progressCurrent}
              progressTotal={trustDerived.progressTotal}
              titleOverride="Уровень доверия участника"
              descriptionOverride="Расчёт по одобренным заявкам этого профиля"
              extraOverride="Показывает доступный диапазон поддержки для этого участника"
            />
            <ProfileReviewSection userId={resolvedUserId} isOwner={false} />
            <OtherUserPersonalStats userId={resolvedUserId} />
          </section>

          <aside className="lg:col-span-5 space-y-4 sm:space-y-5 md:space-y-6">
            <ProfileStoriesSection userId={resolvedUserId} isOwner={false} />
            <OtherUserActivity userId={resolvedUserId} />
          </aside>
        </div>
      </div>
    </div>
  );
}
