import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/Card";
import { ProfileImageIcon } from "@/components/profile/ProfileImageIcon";

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
    <CardHeader className="!mb-0 flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <ProfileImageIcon src="/icon/pig.png" alt="Мои друзья" size="sm" />
          <h3 className="text-base font-bold text-[#fffffe] sm:text-lg">
            Мои друзья
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {pendingRequests > 0 && (
            <Badge variant="default" className="font-semibold">
              {pendingRequests} заявок
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#abd1c6]/25 bg-transparent text-[#fffffe] hover:bg-white/5 hover:text-[#fffffe]"
            onClick={onAllClick}
          >
            Все
          </Button>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[#abd1c6] sm:text-sm">
        {subtitle}
        {pendingRequests > 0 && " · есть новые заявки"}
      </p>
    </CardHeader>
  );
}
