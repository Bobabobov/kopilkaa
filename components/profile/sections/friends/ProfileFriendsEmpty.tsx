import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsEmptyProps {
  onFindFriends: () => void;
}

export function ProfileFriendsEmpty({
  onFindFriends,
}: ProfileFriendsEmptyProps) {
  return (
    <div className="py-4 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <LucideIcons.UserPlus className="text-[#abd1c6]" size="lg" />
      </div>
      <p className="mb-1 text-sm font-medium text-[#fffffe]">Пока нет друзей</p>
      <p className="mb-4 text-xs text-[#abd1c6] sm:text-sm">
        Найдите интересных людей и заводите новые знакомства
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[#abd1c6]/25 bg-transparent text-[#fffffe] hover:bg-white/5 hover:text-[#fffffe]"
        onClick={onFindFriends}
      >
        Найти друзей
      </Button>
    </div>
  );
}
