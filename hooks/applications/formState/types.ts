"use client";

export type LocalImage = { file: File; url: string };

export type UserShape = {
  id: string;
  email?: string | null;
  name?: string | null;
  username?: string | null;
  avatar?: string | null;
  role?: "USER" | "ADMIN";
};

export interface StoredFormData {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  bankName: string;
}
