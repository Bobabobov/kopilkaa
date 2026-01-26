"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface BugReportFormProps {
  onReportCreated: (report?: any) => void;
}

export default function BugReportForm({ onReportCreated }: BugReportFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const category = "MODERATOR"; // Категория по умолчанию
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mappedFiles = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...mappedFiles].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!images.length) return [];

    setUploading(true);
    try {
      const fd = new FormData();
      images.forEach((item) => {
        fd.append("files", item.file);
      });

      const r = await fetch("/api/uploads", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      return (d.files as { url: string }[]).map((f) => f.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Скрываем предыдущее сообщение об успехе при новой отправке
    setSuccessMessage(false);

    if (!title.trim() || !description.trim()) {
      showToast("error", "Ошибка", "Заполните все обязательные поля");
      return;
    }

    if (title.length > 40) {
      showToast("error", "Ошибка", "Заголовок не должен превышать 40 символов");
      return;
    }

    if (description.length > 700) {
      showToast("error", "Ошибка", "Описание не должно превышать 700 символов");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImages();

      const response = await fetch("/api/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          images: imageUrls,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Сервер вернул некорректный ответ");
      }

      if (!response.ok) {
        console.error("API error:", data);
        throw new Error(
          data.message || data.error || "Ошибка создания баг-репорта",
        );
      }

      // Показываем сообщение об успехе внутри формы
      setSuccessMessage(true);

      // Очищаем форму
      setTitle("");
      setDescription("");
      setImages([]);

      // Передаем созданный баг-репорт для немедленного отображения
      onReportCreated(data.report);

      // Автоматически скрываем сообщение через 5 секунд
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage = error.message || "Не удалось создать баг-репорт";
      // Сообщение про лимит уже показано в форме, тост не нужен
      if (!errorMessage.includes("5 баг-репортов")) {
        showToast("error", "Ошибка", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 border border-[#abd1c6]/30 shadow-xl"
    >
      {/* Декоративные элементы */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#e16162]/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#f9bc60]/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-xl font-bold text-[#fffffe] flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#e16162] to-[#d14d4e] rounded-xl flex items-center justify-center shadow-lg">
              <LucideIcons.AlertTriangle className="text-white" size="sm" />
            </div>
            Сообщить о проблеме
          </h2>
          <p className="text-xs text-[#f9bc60] bg-[#e16162]/10 border border-[#e16162]/30 rounded-lg px-3 py-2">
            Можно отправлять до 5 баг-репортов в сутки
          </p>
        </div>

        {/* Сообщение об успешной отправке */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/40 p-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-300">
                  Баг-репорт создан
                </p>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Ваш отчёт успешно отправлен
                </p>
              </div>
              <button
                onClick={() => setSuccessMessage(false)}
                className="flex-shrink-0 p-1 rounded-md hover:bg-emerald-500/20 transition-colors"
                aria-label="Закрыть"
              >
                <LucideIcons.X size="xs" className="text-emerald-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Заголовок */}
          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Краткое описание проблемы"
              maxLength={40}
              className="w-full px-4 py-2.5 bg-[#001e1d]/40 border border-[#abd1c6]/20 rounded-lg text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60] transition-colors"
              required
            />
            <p className="text-xs text-[#abd1c6]/70 mt-1">
              До {40 - title.length} символов
            </p>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание проблемы"
              maxLength={700}
              rows={6}
              className="w-full px-4 py-2.5 bg-[#001e1d]/40 border border-[#abd1c6]/20 rounded-lg text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60] transition-colors resize-none"
              required
            />
            <p className="text-xs text-[#abd1c6]/70 mt-1">
              До {700 - description.length} символов
            </p>
          </div>

          {/* Фото */}
          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Фото
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="bug-photo-upload"
            />
            <motion.label
              htmlFor="bug-photo-upload"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#001e1d]/40 border-2 border-dashed border-[#abd1c6]/30 rounded-lg cursor-pointer hover:border-[#f9bc60]/50 transition-colors"
            >
              <LucideIcons.Camera size="sm" className="text-[#abd1c6]" />
              <span className="text-sm text-[#abd1c6]">Загрузить фото</span>
            </motion.label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-[#abd1c6]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#e16162] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <LucideIcons.X size="xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка отправки */}
          <motion.button
            type="submit"
            disabled={submitting || uploading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-[#8B5CF6]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting || uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LucideIcons.Loader2 size="sm" />
                </motion.div>
                <span>{uploading ? "Загрузка фото..." : "Отправка..."}</span>
              </>
            ) : (
              <>
                <LucideIcons.ArrowRight size="sm" />
                <span>Отправить</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      <ToastComponent />
    </motion.div>
  );
}
