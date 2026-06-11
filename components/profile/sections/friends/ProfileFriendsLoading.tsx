import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFriendsLoading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-14 w-full rounded-xl bg-white/5" />
      <Skeleton className="h-14 w-full rounded-xl bg-white/5" />
      <div className="flex justify-end pt-1">
        <Skeleton className="h-9 w-32 rounded-md bg-white/5" />
      </div>
    </div>
  );
}
