// components/profile/AvatarUpload.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName: string;
  onAvatarChange: (avatarUrl: string | null) => void;
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastComponent } = useBeautifulToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast(
        "error",
        "Неподдерживаемый формат",
        "Выберите JPG, PNG, GIF или WebP файл",
      );
      return;
    }

    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Файл слишком большой", "Максимальный размер: 5 МБ");
      return;
    }

    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем файл
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onAvatarChange(data.avatar);
        setPreview(null);
        showToast(
          "success",
          "Аватарка загружена!",
          "Ваша аватарка успешно обновлена",
        );
      } else {
        console.error("Upload failed:", data);
        showToast(
          "error",
          "Ошибка загрузки",
          data.error || "Не удалось загрузить аватарку",
        );
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showToast("error", "Ошибка загрузки", "Не удалось загрузить аватарку");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    setUploading(true);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        onAvatarChange(null);
        setPreview(null);
        showToast("success", "Аватарка удалена", "Аватарка успешно удалена");
      } else {
        showToast(
          "error",
          "Ошибка удаления",
          data.error || "Не удалось удалить аватарку",
        );
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
      showToast("error", "Ошибка удаления", "Не удалось удалить аватарку");
    } finally {
      setUploading(false);
    }
  };

  const displayAvatar = preview || currentAvatar;
  const avatarLetter =
    userName && userName[0] ? userName[0].toUpperCase() : "?";

  return (
    <>
      <motion.div
        className="relative inline-block group z-[20]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Аватарка */}
        <div className="relative">
          <motion.div
            className={`relative w-28 h-28 rounded-2xl flex items-center justify-center text-[#abd1c6] font-bold text-2xl shadow-2xl mx-auto mb-6 overflow-hidden border-2 border-[#abd1c6]/30 group-hover:border-[#f9bc60]/50 group-hover:shadow-[#f9bc60]/30 transition-all duration-300 ${
              displayAvatar
                ? "bg-[#001e1d]/40"
                : "bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d]"
            }`}
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {/* Декоративное свечение */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/20 via-transparent to-[#abd1c6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

            {displayAvatar ? (
              <motion.img
                src={displayAvatar}
                alt="Аватарка"
                className="w-full h-full object-cover rounded-2xl relative z-10"
                whileHover={{ scale: 1.05 }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-2xl relative z-10">
                <span className="relative z-10">{avatarLetter}</span>
              </div>
            )}
          </motion.div>

          {/* Индикатор загрузки */}
          {uploading && (
            <div className="absolute inset-0 bg-[#001e1d]/80 rounded-2xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-[#f9bc60] text-2xl"
              >
                <LucideIcons.Loader2 size="lg" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Скрытый input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          data-avatar-file-input="true"
          className="hidden"
        />
      </motion.div>

      {/* Toast уведомления */}
      <ToastComponent />
    </>
  );
}
