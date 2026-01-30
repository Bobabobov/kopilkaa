"use client";

export type LocalImage = { file: File; url: string };

export type UserShape = {
  id: string;
  email?: string | null;
  role?: "USER" | "ADMIN";
};

export type ActivityType = "LIKE_STORY" | "CHANGE_AVATAR" | "CHANGE_HEADER";

export interface ActivityModalState {
  isOpen: boolean;
  activityType: ActivityType | null;
  message: string;
}

export interface StoredFormData {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  bankName: string;
}
