"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AdRequestSuccessScreen } from "./AdRequestSuccessScreen";
import { AdImageUploadSection } from "./AdImageUploadSection";

const MAX_IMAGES = 5;

export function AdvertisingContact() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    telegram: "",
    website: "",
    format: "",
    duration: "",
    message: "",
    imageUrls: [] as string[],
    mobileBannerUrls: [] as string[],
  });

  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [mobileImages, setMobileImages] = useState<{ file: File; url: string }[]>([]);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [mobileInputMode, setMobileInputMode] = useState<"upload" | "url">("upload");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [mobileUrlInput, setMobileUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Используем ref для предотвращения двойной отправки
  const isSubmittingRef = useRef(false);

  // Читаем параметр формата из URL и устанавливаем его в форму
  useEffect(() => {
    const parseFormatFromHash = () => {
      const hash = window.location.hash;
      if (hash.includes('#contact')) {
        // Парсим query параметры из hash (например, #contact?format=banner)
        const hashParts = hash.split('?');
        if (hashParts.length > 1) {
          const params = new URLSearchParams(hashParts[1]);
          const format = params.get('format');
          if (format && ['banner', 'side', 'story', 'tg', 'other'].includes(format)) {
            setFormData((prev) => ({ ...prev, format }));
            // Очищаем ошибку формата, если она была
            setErrors((prev) => ({ ...prev, format: "" }));
          }
        }
      }
    };

    // Парсим при монтировании
    parseFormatFromHash();

    // Слушаем изменения hash
    const handleHashChange = () => {
      parseFormatFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const uploadImages = async (files: { file: File; url: string }[]): Promise<string[]> => {
    if (!files.length) return [];

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((item) => {
        formData.append("files", item.file);
      });

      const response = await fetch("/api/ad-requests/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Ошибка загрузки изображений");
      }

      return (data.files as { url: string }[]).map((f) => f.url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Предотвращаем двойную отправку
    if (isSubmittingRef.current || isSubmitting || isUploading) {
      return;
    }
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const email = formData.contact.trim();
      const newErrors: Record<string, string> = {};

      // Валидация имени
      if (!formData.name.trim()) {
        newErrors.name = "Пожалуйста, укажите ваше имя";
      }

      // Валидация email
      if (!email) {
        newErrors.contact = "Пожалуйста, укажите email";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          newErrors.contact = "Некорректный email адрес. Пример: your@email.com";
        }
      }

      // Валидация ссылки на сайт (если заполнена, должна быть валидным URL)
      if (formData.website && formData.website.trim()) {
        try {
          const url = new URL(formData.website.trim());
          // Проверяем, что это http или https
          if (!url.protocol.match(/^https?:$/)) {
            newErrors.website = "Ссылка должна начинаться с http:// или https://";
          }
        } catch (e) {
          newErrors.website = "Введите корректную ссылку. Пример: https://example.com";
        }
      }

      // Валидация формата
      if (!formData.format || formData.format.trim() === "") {
        newErrors.format = "Пожалуйста, выберите формат размещения";
      }

      // Валидация срока
      const durationNum = parseInt(formData.duration || "0", 10);
      if (!formData.duration || !durationNum || durationNum < 1 || durationNum > 365) {
        newErrors.duration = "Укажите срок размещения от 1 до 365 дней";
      }

      // Валидация комментария
      const comment = formData.message.trim();
      if (!comment) {
        newErrors.message = "Пожалуйста, заполните это поле";
      } else if (comment.length > 400) {
        newErrors.message = "Максимум 400 символов";
      }

      // Если есть ошибки, показываем их и не отправляем форму
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        // Прокручиваем к первой ошибке
        const firstErrorField = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`) as HTMLElement;
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      setErrors({});

      // Загружаем изображения, если есть
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages(images);
      }

      // Загружаем мобильные изображения, если есть
      let uploadedMobileUrls: string[] = [];
      if (mobileImages.length > 0 && formData.format === "banner") {
        uploadedMobileUrls = await uploadImages(mobileImages);
      }

      // Объединяем загруженные и введенные URL
      const allImageUrls = [...uploadedImageUrls, ...formData.imageUrls].filter(Boolean);
      const allMobileUrls = [...uploadedMobileUrls, ...formData.mobileBannerUrls].filter(Boolean);

      const body = {
        companyName: formData.name.trim(),
        email,
        telegram: formData.telegram.trim() || null,
        website: formData.website.trim() || null,
        format: formData.format.trim(),
        duration: durationNum,
        imageUrls: allImageUrls.length > 0 ? allImageUrls : null,
        mobileBannerUrls: allMobileUrls.length > 0 ? allMobileUrls : null,
        comment: comment,
      };

      const response = await fetch("/api/ad-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to send ad request", data);
        alert(data?.error || "Не удалось отправить заявку. Попробуйте ещё раз позже.");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        contact: "",
        telegram: "",
        website: "",
        format: "",
        duration: "",
        message: "",
        imageUrls: [],
        mobileBannerUrls: [],
      });
      setImages([]);
      setMobileImages([]);
      setImageUrlInput("");
      setMobileUrlInput("");
    } catch (error) {
      console.error("Error sending ad request:", error);
      alert("Произошла ошибка при отправке заявки.");
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isBannerFormat = formData.format === "banner";

  if (isSubmitted) {
    return <AdRequestSuccessScreen onReset={() => setIsSubmitted(false)} />;
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-[#fffffe] mb-4">Оставьте заявку</h2>
          <p className="text-xl md:text-2xl text-[#abd1c6] max-w-2xl mx-auto">
            Расскажите о себе. Остальное обсудим лично.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative space-y-10"
          noValidate
        >
          <div className="space-y-10">
          {/* Имя */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Как вас зовут? <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => {
                handleChange(e);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.name 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25`}
              placeholder="Иван"
            />
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={(e) => {
                handleChange(e);
                // Очищаем ошибку, если email становится валидным
                const value = e.target.value;
                if (errors.contact) {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(value) || !value) {
                    setErrors((prev) => ({ ...prev, contact: "" }));
                  }
                }
              }}
              onBlur={(e) => {
                // Проверяем формат email при потере фокуса
                const value = e.target.value.trim();
                if (value) {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    setErrors((prev) => ({ ...prev, contact: "Некорректный email адрес. Пример: your@email.com" }));
                  }
                }
              }}
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.contact 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25`}
              placeholder="your@email.com"
            />
            {errors.contact && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.contact}
              </motion.p>
            )}
          </motion.div>

          {/* Telegram */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Telegram для быстрой связи
            </label>
            <input
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-[#001e1d]/40 border-2 border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20 text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25"
              placeholder="@username"
            />
          </motion.div>

          {/* Ссылка на сайт/товар */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Ссылка на ваш сайт, товар или страницу
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => {
                handleChange(e);
                if (errors.website) setErrors((prev) => ({ ...prev, website: "" }));
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value) {
                  try {
                    const url = new URL(value);
                    if (!url.protocol.match(/^https?:$/)) {
                      setErrors((prev) => ({ ...prev, website: "Ссылка должна начинаться с http:// или https://" }));
                    }
                  } catch (e) {
                    setErrors((prev) => ({ ...prev, website: "Введите корректную ссылку. Пример: https://example.com" }));
                  }
                }
              }}
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.website 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25`}
              placeholder="https://example.com"
            />
            {errors.website && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.website}
              </motion.p>
            )}
          </motion.div>

          {/* Формат размещения */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Формат размещения <span className="text-red-400">*</span>
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={(e) => {
                handleChange(e);
                if (errors.format) setErrors((prev) => ({ ...prev, format: "" }));
              }}
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.format 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23abd1c6%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-[length:20px]`}
              style={{ paddingRight: '3rem' }}
            >
              <option value="" className="bg-[#001e1d] text-[#abd1c6]">Выберите формат</option>
              <option value="banner" className="bg-[#001e1d] text-[#fffffe]">Большой баннер наверху (3000₽)</option>
              <option value="side" className="bg-[#001e1d] text-[#fffffe]">Блок сбоку (1500₽)</option>
              <option value="story" className="bg-[#001e1d] text-[#fffffe]">Рекламная история (2000₽)</option>
              <option value="tg" className="bg-[#001e1d] text-[#fffffe]">Telegram пост (1000₽)</option>
              <option value="other" className="bg-[#001e1d] text-[#fffffe]">Не знаю, помогите выбрать</option>
            </select>
            {errors.format && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.format}
              </motion.p>
            )}
          </motion.div>

          {/* Изображения */}
          <AdImageUploadSection
            label="Изображения"
            maxImages={MAX_IMAGES}
            images={images}
            imageUrls={formData.imageUrls}
            urlInput={imageUrlInput}
            inputMode={imageInputMode}
            onImagesChange={setImages}
            onImageUrlsChange={(urls) => setFormData((prev) => ({ ...prev, imageUrls: urls }))}
            onUrlInputChange={setImageUrlInput}
            onInputModeChange={setImageInputMode}
            onRemoveImage={(index) => setImages((prev) => prev.filter((_, i) => i !== index))}
            onRemoveImageUrl={(index) =>
              setFormData((prev) => ({
                ...prev,
                imageUrls: prev.imageUrls.filter((_, i) => i !== index),
              }))
            }
            inputId="image-upload"
          />

          {/* Мобильный баннер (только для большого баннера) */}
          {isBannerFormat && (
            <AdImageUploadSection
              label="URL изображения для мобильного баннера"
              description="Если заполнить, этот баннер будет показан на телефонах. Рекомендуемый размер 800–1080px по ширине, ориентир по высоте 200–300px."
              maxImages={MAX_IMAGES}
              images={mobileImages}
              imageUrls={formData.mobileBannerUrls}
              urlInput={mobileUrlInput}
              inputMode={mobileInputMode}
              onImagesChange={setMobileImages}
              onImageUrlsChange={(urls) =>
                setFormData((prev) => ({ ...prev, mobileBannerUrls: urls }))
              }
              onUrlInputChange={setMobileUrlInput}
              onInputModeChange={setMobileInputMode}
              onRemoveImage={(index) =>
                setMobileImages((prev) => prev.filter((_, i) => i !== index))
              }
              onRemoveImageUrl={(index) =>
                setFormData((prev) => ({
                  ...prev,
                  mobileBannerUrls: prev.mobileBannerUrls.filter((_, i) => i !== index),
                }))
              }
              inputId="mobile-image-upload"
            />
          )}

          {/* Срок размещения */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pb-6 border-b border-[#abd1c6]/10"
          >
            <label className="block text-[#fffffe] text-lg md:text-xl font-semibold mb-4">
              Срок на сколько дней? <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={(e) => {
                handleChange(e);
                if (errors.duration) setErrors((prev) => ({ ...prev, duration: "" }));
              }}
              min="1"
              max="365"
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.duration 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25`}
              placeholder="7"
            />
            {errors.duration ? (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.duration}
              </motion.p>
            ) : (
              <p className="text-sm text-[#abd1c6] mt-3">От 1 до 365 дней</p>
            )}
          </motion.div>

          {/* Комментарий */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[#fffffe] text-lg md:text-xl font-semibold">
                Что-то ещё? <span className="text-red-400">*</span>
              </label>
              <span className={`text-sm font-medium transition-colors ${formData.message.length > 400 ? 'text-red-400' : 'text-[#abd1c6]'}`}>
                {formData.message.length} / 400
              </span>
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={(e) => {
                handleChange(e);
                if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
              }}
              maxLength={400}
              rows={5}
              className={`w-full px-6 py-4 bg-[#001e1d]/40 border-2 ${
                errors.message 
                  ? "border-red-400/60 focus:border-red-400 shadow-lg shadow-red-400/20" 
                  : "border-[#abd1c6]/15 focus:border-[#f9bc60] focus:shadow-lg focus:shadow-[#f9bc60]/20"
              } text-[#fffffe] text-lg focus:outline-none placeholder-[#abd1c6]/50 resize-none rounded-xl transition-all duration-300 hover:border-[#abd1c6]/25`}
              placeholder="Например: у меня интернет-магазин цветов, хочу больше заказов"
            ></textarea>
            {errors.message && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> {errors.message}
              </motion.p>
            )}
            {!errors.message && formData.message.length > 400 && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 flex items-center gap-2"
              >
                <span>⚠</span> Превышено максимальное количество символов (400)
              </motion.p>
            )}
          </motion.div>

          {/* Большая кнопка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="pt-4"
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || isUploading}
              className="relative w-full bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] py-6 text-xl font-bold rounded-xl shadow-lg shadow-[#f9bc60]/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group transition-all duration-300"
            >
              {/* Эффект свечения */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f9bc60] via-[#fff] to-[#f9bc60] opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                   style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting || isUploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-[#001e1d] border-t-transparent rounded-full"
                    />
                    {isUploading ? "Загружаем изображения..." : "Отправляем..."}
                  </>
                ) : (
                  <>
                    Отправить заявку
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>

            {/* Маленькая заметка */}
          </motion.div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
