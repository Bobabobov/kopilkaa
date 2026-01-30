"use client";

export type SettingsUser = {
  id: string;
  email: string;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  hideEmail?: boolean;
  phone?: string | null;
  phoneVerified?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string;
};

export interface UseSettingsReturn {
  user: SettingsUser | null;
  loading: boolean;
  saving: boolean;

  isChangingPassword: boolean;
  setIsChangingPassword: (changing: boolean) => void;
  passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData: (data: Partial<UseSettingsReturn["passwordData"]>) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;

  localNotification: {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  };

  loadUser: () => Promise<void>;
  handleUsernameChange: (newUsername: string) => Promise<void>;
  handleNameChange: (newName: string) => Promise<void>;
  handleEmailChange: (newEmail: string) => Promise<void>;
  handleEmailVisibilityChange: (hideEmail: boolean) => Promise<void>;
  handlePhoneChange: (phone: string) => Promise<void>;
  handleSocialLinkChange: (
    field: "vkLink" | "telegramLink" | "youtubeLink",
    link: string,
  ) => Promise<void>;
  handleAvatarChange: (avatarUrl: string | null) => void;
  handleAvatarUpload: (file: File) => Promise<void>;
  handleAvatarDelete: () => Promise<void>;
  handlePasswordChange: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  handlePasswordSubmit: () => Promise<void>;
  cancelPasswordChange: () => void;
  handleExportData: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  showLocalNotification: (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => void;
}
