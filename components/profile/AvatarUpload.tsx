// components/profile/AvatarUpload.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAvatarFrame } from "@/lib/header-customization";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName: string;
  avatarFrame?: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
  onFrameChange?: (frame: string) => void;
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  avatarFrame,
  onAvatarChange,
  onFrameChange,
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
      console.log("Uploading avatar:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const formData = new FormData();
      formData.append("avatar", file);

      console.log("Sending request to /api/profile/avatar");
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

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
  const frame = getAvatarFrame(avatarFrame || "none");
  const frameKey = avatarFrame || "none";

  return (
    <>
      <div className="relative inline-block group">
        {/* Аватарка */}
        <div className="relative">
          {frame.type === "image" ? (
            // Рамка-картинка
            <div className="w-24 h-24 rounded-lg mx-auto mb-4 overflow-hidden relative">
              {/* Рамка как фон */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                style={{
                  backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                }}
              />
              {/* Аватар поверх рамки */}
              <div className="absolute inset-2 rounded-md overflow-hidden">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Аватарка"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl">
                    <span className="relative z-10">{avatarLetter}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // CSS рамка
            <div
              className={`w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-2xl mx-auto mb-4 overflow-hidden ${frame.className} ${
                displayAvatar
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
              }`}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Аватарка"
                  className={`w-full h-full object-cover rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                >
                  <span className="relative z-10">{avatarLetter}</span>
                </div>
              )}
            </div>
          )}

          {/* Индикатор загрузки */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-white text-2xl"
              >
                ⏳
              </motion.div>
            </div>
          )}
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-2 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-xs rounded-lg transition-colors"
          >
            {uploading ? "Загрузка..." : "Изменить"}
          </motion.button>

          {onFrameChange && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFrameChange("")}
              disabled={uploading}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white text-xs rounded-lg transition-colors"
            >
              Рамка
            </motion.button>
          )}

          {currentAvatar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={removeAvatar}
              disabled={uploading}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xs rounded-lg transition-colors"
            >
              Удалить
            </motion.button>
          )}
        </div>

        {/* Скрытый input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Toast уведомления */}
      <ToastComponent />
    </>
  );
}
