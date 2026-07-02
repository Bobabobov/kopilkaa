import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileSectionTitle } from "@/components/profile/ProfileSectionTitle";

interface ProfileFriendsHeaderProps {
  totalFriends: number;
  pendingRequests: number;
  onAllClick: () => void;
}

export function ProfileFriendsHeader({
  totalFriends,
  pendingRequests,
  onAllClick,
}: ProfileFriendsHeaderProps) {
  const subtitle =
    totalFriends > 0
      ? `${totalFriends} ${totalFriends === 1 ? "друг" : totalFriends < 5 ? "друга" : "друзей"}`
      : "Список друзей";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <ProfileSectionTitle
          imageSrc="/icon/pig.png"
          imageAlt="Мои друзья"
          title="Мои друзья"
          subtitle={
            pendingRequests > 0
              ? `${subtitle} · есть новые заявки`
              : subtitle
          }
          className="mb-0"
        />
        <div className="flex shrink-0 items-center gap-2">
          {pendingRequests > 0 && (
            <Badge
              variant="default"
              className="border-emerald-500/20 bg-emerald-600/80 font-semibold"
            >
              {pendingRequests} заявок
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-emerald-500/20 bg-transparent text-zinc-300 hover:bg-emerald-950/40 hover:text-emerald-400"
            onClick={onAllClick}
          >
            Все
          </Button>
        </div>
      </div>
    </div>
  );
}
