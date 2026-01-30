"use client";

import { useCallback } from "react";
import { patchProfileApi } from "../api";
import type { SettingsUser } from "../types";

type SocialField = "vkLink" | "telegramLink" | "youtubeLink";
type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

const SUCCESS_MESSAGES: Record<SocialField, string> = {
  vkLink: "Ссылка VK обновлена",
  telegramLink: "Ссылка Telegram обновлена",
  youtubeLink: "Ссылка YouTube обновлена",
};

export function useSocialHandler(
  setUser: (u: SettingsUser | null) => void,
  setSaving: (s: boolean) => void,
  showLocalNotification: ShowNotification,
) {
  const handleSocialLinkChange = useCallback(
    async (field: SocialField, link: string) => {
      try {
        setSaving(true);
        const updates =
          field === "vkLink"
            ? { vkLink: link }
            : field === "telegramLink"
              ? { telegramLink: link }
              : { youtubeLink: link };
        const { user } = await patchProfileApi(updates);
        setUser(user);
        showLocalNotification("success", "Успешно!", SUCCESS_MESSAGES[field]);
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось обновить ссылку",
        );
      } finally {
        setSaving(false);
      }
    },
    [setUser, setSaving, showLocalNotification],
  );

  return { handleSocialLinkChange };
}
