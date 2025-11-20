"use client";
import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { useProfileDashboard } from "@/lib/useProfileDashboard";

interface ProfileContextType {
  user: any;
  friends: any[];
  stats: any;
  achievements: any[];
  notifications: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { data, loading, error, refetch } = useProfileDashboard();

  const contextValue: ProfileContextType = {
    user: data?.user || null,
    friends: data?.friends || [],
    stats: data?.stats || {},
    achievements: data?.achievements || [],
    notifications: data?.notifications || [],
    loading,
    error,
    refetch,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}

// Хуки для отдельных секций профиля
export function useProfileUser() {
  const { user } = useProfile();
  return user;
}

export function useProfileFriends() {
  const { friends } = useProfile();
  return friends;
}

export function useProfileStats() {
  const { stats } = useProfile();
  return stats;
}

export function useProfileAchievements() {
  const { achievements } = useProfile();
  return achievements;
}

export function useProfileNotifications() {
  const { notifications } = useProfile();
  return notifications;
}














