// hooks/profile/useProfileSettingsModal.ts
// Управление состоянием модального окна настроек
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useProfileSettingsModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Открываем модальное окно настроек (соцсети), если пришли с /support c параметром
  useEffect(() => {
    const settingsSource = searchParams.get("settings");
    if (!settingsSource) return;

    const timer = window.setTimeout(() => {
      setIsSettingsModalOpen(true);
    }, 150);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("settings");
    const nextUrl = params.toString()
      ? `/profile?${params.toString()}`
      : "/profile";
    router.replace(nextUrl, { scroll: true });

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
  };
}
