import { useState } from "react";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import { throwIfApiFailed } from "@/lib/api/parseApiError";

interface ImageFile {
  file: File;
  url: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<ImageFile | null>(null);
  const { showToast } = useBeautifulNotifications();

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Пожалуйста, выберите изображение";
    }

    const maxSize = 20 * 1024 * 1024; // 20MB для админов
    if (file.size > maxSize) {
      return `Файл слишком большой. Максимальный размер: 20 МБ`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);
    throwIfApiFailed(response, data, "Ошибка загрузки");
    const uploadedUrl = data?.files?.[0]?.url as string | undefined;

    if (!uploadedUrl) {
      throw new Error("Не удалось получить URL загруженного файла");
    }

    return uploadedUrl;
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      showToast("warning", "Неверный файл", validationError);
      return;
    }

    // Создаем превью
    const previewUrl = URL.createObjectURL(file);
    setPreviewFile({ file, url: previewUrl });

    // Автоматически загружаем файл
    setUploading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      onSuccess(uploadedUrl);
      URL.revokeObjectURL(previewUrl);
      setPreviewFile(null);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showToast(
        "error",
        "Не удалось загрузить изображение",
        error?.message || "Попробуйте ещё раз",
      );
      URL.revokeObjectURL(previewUrl);
      setPreviewFile(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  return {
    uploading,
    previewFile,
    handleFileSelect,
    clearPreview,
  };
}

export function useVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<ImageFile | null>(null);
  const { showToast } = useBeautifulNotifications();

  const validateFile = (file: File): string | null => {
    const allowed = ["video/mp4", "video/webm"];
    if (!allowed.includes(file.type)) {
      return "Пожалуйста, выберите видео (MP4 или WebM)";
    }

    const maxSize = 20 * 1024 * 1024; // 20MB для админов (совпадает с backend)
    if (file.size > maxSize) {
      return `Файл слишком большой. Максимальный размер: 20 МБ`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);
    throwIfApiFailed(response, data, "Ошибка загрузки");
    const uploadedUrl = data?.files?.[0]?.url as string | undefined;

    if (!uploadedUrl) {
      throw new Error("Не удалось получить URL загруженного файла");
    }

    return uploadedUrl;
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      showToast("warning", "Неверный файл", validationError);
      return;
    }

    // Превью
    const previewUrl = URL.createObjectURL(file);
    setPreviewFile({ file, url: previewUrl });

    setUploading(true);
    try {
      const uploadedUrl = await uploadFile(file);
      onSuccess(uploadedUrl);
      URL.revokeObjectURL(previewUrl);
      setPreviewFile(null);
    } catch (error: any) {
      console.error("Error uploading video:", error);
      showToast(
        "error",
        "Не удалось загрузить видео",
        error?.message || "Попробуйте ещё раз",
      );
      URL.revokeObjectURL(previewUrl);
      setPreviewFile(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  return {
    uploading,
    previewFile,
    handleFileSelect,
    clearPreview,
  };
}

export function useMultipleImageUpload() {
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [previewFiles, setPreviewFiles] = useState<Record<number, ImageFile>>(
    {},
  );
  const { showToast } = useBeautifulNotifications();

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Пожалуйста, выберите изображение";
    }

    const maxSize = 20 * 1024 * 1024; // 20MB для админов
    if (file.size > maxSize) {
      return `Файл слишком большой. Максимальный размер: 20 МБ`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);
    throwIfApiFailed(response, data, "Ошибка загрузки");
    const uploadedUrl = data?.files?.[0]?.url as string | undefined;

    if (!uploadedUrl) {
      throw new Error("Не удалось получить URL загруженного файла");
    }

    return uploadedUrl;
  };

  const handleFileSelect = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (index: number, url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      showToast("warning", "Неверный файл", validationError);
      return;
    }

    // Создаем превью
    const previewUrl = URL.createObjectURL(file);
    setPreviewFiles((prev) => ({
      ...prev,
      [index]: { file, url: previewUrl },
    }));

    // Автоматически загружаем файл
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const uploadedUrl = await uploadFile(file);
      onSuccess(index, uploadedUrl);
      URL.revokeObjectURL(previewUrl);
      setPreviewFiles((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      showToast(
        "error",
        "Не удалось загрузить изображение",
        error?.message || "Попробуйте ещё раз",
      );
      URL.revokeObjectURL(previewUrl);
      setPreviewFiles((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } finally {
      setUploading((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const clearPreview = (index: number) => {
    const previewFile = previewFiles[index];
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFiles((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  return {
    uploading,
    previewFiles,
    handleFileSelect,
    clearPreview,
  };
}
