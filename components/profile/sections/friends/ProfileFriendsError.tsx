import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ProfileFriendsErrorProps {
  onRetry: () => void;
}

export function ProfileFriendsError({ onRetry }: ProfileFriendsErrorProps) {
  return (
    <div className="py-4 text-center">
      <LucideIcons.AlertTriangle
        className="mx-auto mb-2 text-[#e16162]"
        size="lg"
      />
      <p className="mb-3 text-sm text-[#abd1c6]">Ошибка загрузки</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-[#abd1c6]/25 bg-transparent text-[#fffffe] hover:bg-white/5"
        onClick={onRetry}
      >
        Попробовать ещё раз
      </Button>
    </div>
  );
}
