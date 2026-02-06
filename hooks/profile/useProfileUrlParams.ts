// hooks/profile/useProfileUrlParams.ts
// Обработка URL параметров для страницы профиля
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useProfileUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Перенаправление на страницу друзей, если пришёл friendsTab
  useEffect(() => {
    const requestedTab = searchParams.get("friendsTab");
    if (!requestedTab) return;

    const allowedTabs = new Set(["friends", "sent", "received", "online", "search"]);
    const tab = allowedTabs.has(requestedTab)
      ? (requestedTab as "friends" | "sent" | "received" | "online" | "search")
      : "friends";

    const params = new URLSearchParams(searchParams.toString());
    params.delete("friendsTab");
    const nextUrl = params.toString()
      ? `/profile?${params.toString()}`
      : "/profile";
    router.replace(nextUrl, { scroll: true });
    router.push(`/friends?tab=${tab}`);
  }, [searchParams, router]);
}
