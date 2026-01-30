"use client";

export type OtherUserProfileUser = {
  id: string;
  email: string | null;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string | null;
  isBanned?: boolean;
  bannedUntil?: string | null;
  bannedReason?: string | null;
};

export interface OtherUserProfileProps {
  userId: string;
}
