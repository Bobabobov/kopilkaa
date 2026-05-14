"use client";

import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import type { SettingsUser } from "./types";

export async function loadUserApi(): Promise<{
  user: SettingsUser | null;
}> {
  const response = await fetch("/api/profile/me", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load user data");
  const data = await response.json();
  return { user: data.user ?? null };
}

type ProfilePatch =
  | { name: string }
  | { username: string }
  | { email: string }
  | { hideEmail: boolean }
  | { vkLink: string }
  | { telegramLink: string }
  | { youtubeLink: string };

export async function patchProfileApi(
  updates: ProfilePatch,
): Promise<{ user: SettingsUser }> {
  const response = await fetch("/api/profile/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      getMessageFromApiJson(data, "Не удалось обновить данные"),
    );
  }
  if (!data.user) throw new Error("No user in response");
  return { user: data.user };
}

export async function postAvatarApi(file: File): Promise<{ avatar: string }> {
  const form = new FormData();
  form.append("avatar", file);
  const response = await fetch("/api/profile/avatar", {
    method: "POST",
    body: form,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(
      getMessageFromApiJson(data, "Не удалось загрузить аватарку"),
    );
  }
  return { avatar: data.avatar as string };
}

export async function deleteAvatarApi(): Promise<{ ok: boolean }> {
  const response = await fetch("/api/profile/avatar", { method: "DELETE" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(
      getMessageFromApiJson(data, "Не удалось удалить аватарку"),
    );
  }
  return { ok: true };
}

export async function patchPasswordApi(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch("/api/profile/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      getMessageFromApiJson(data, "Ошибка изменения пароля"),
    );
  }
}

export async function fetchExportBlob(): Promise<Blob> {
  const response = await fetch("/api/profile/export");
  if (!response.ok) throw new Error("Не удалось экспортировать данные");
  return response.blob();
}

export async function deleteAccountApi(): Promise<void> {
  const response = await fetch("/api/profile/delete", { method: "DELETE" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      getMessageFromApiJson(data, "Не удалось удалить аккаунт"),
    );
  }
}
