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
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#EBE6DA] bg-[#EDF7F1]">
        <LucideIcons.UserPlus className="text-[#2E6F40]" size="lg" />
      </div>
      <p className="mb-1 text-sm font-bold text-[#1C2E24]">Пока нет друзей</p>
      <p className="mb-4 text-xs text-[#4A5D53] sm:text-sm">
        Найдите интересных людей и заводите новые знакомства
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[#2E6F40]/20 bg-[#EDF7F1] text-[#2E6F40] hover:bg-[#DDF0E5]"
        onClick={onFindFriends}
      >
        Найти друзей
      </Button>
    </div>
  );
}
