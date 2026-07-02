import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsErrorProps {
  onRetry: () => void;
}

export function ProfileFriendsError({ onRetry }: ProfileFriendsErrorProps) {
  return (
    <div className="py-4 text-center">
      <LucideIcons.AlertTriangle
        className="mx-auto mb-2 text-[#A23B3B]"
        size="lg"
      />
      <p className="mb-3 text-sm text-[#4A5D53]">Ошибка загрузки</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[#2E6F40]/20 bg-[#EDF7F1] text-[#2E6F40] hover:bg-[#DDF0E5]"
        onClick={onRetry}
      >
        Попробовать ещё раз
      </Button>
    </div>
  );
}
