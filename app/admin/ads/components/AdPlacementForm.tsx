// app/admin/ads/components/AdPlacementForm.tsx
"use client";
import type { Advertisement, AdFormData } from "./types";
import RichTextEditor from "@/components/applications/RichTextEditor";

interface AdPlacementFormProps {
  formData: AdFormData;
  editingAd: Advertisement | null;
  onFormDataChange: (data: AdFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AdPlacementForm({
  formData,
  editingAd,
  onFormDataChange,
  onSubmit,
  onCancel,
}: AdPlacementFormProps) {
  const updateField = (field: keyof AdFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const updateStoryImageUrl = (index: number, value: string) => {
    const next = [...formData.storyImageUrls];
    next[index] = value;
    updateField("storyImageUrls", next);
  };

  const addStoryImageUrl = () => {
    if (formData.storyImageUrls.length < 5) {
      updateField("storyImageUrls", [...formData.storyImageUrls, ""]);
    }
  };

  return (
    <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
      <h2 className="text-xl font-bold text-[#fffffe] mb-4">
        {editingAd ? "Редактировать размещение" : "Новое размещение"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.placement !== "stories" &&
            formData.placement !== "home_sidebar" &&
            formData.placement !== "home_banner" && (
              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                  placeholder="Краткий привлекательный заголовок"
                  maxLength={40}
                  required={formData.placement !== "stories"}
                />
                <p className="text-xs text-[#abd1c6]/70 mt-1">
                  Рекомендуемая длина: 20–40 символов ({formData.title.length}/40)
                </p>
              </div>
            )}

          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Ссылка (опционально)
            </label>
            <input
              type="url"
              value={formData.linkUrl}
              onChange={(e) => updateField("linkUrl", e.target.value)}
              className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              {formData.placement === "stories"
                ? "Картинка для превью в /stories (URL, опционально)"
                : "URL изображения (опционально)"}
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
              placeholder="https://example.com/banner.jpg"
            />
            <p className="text-xs text-[#abd1c6]/70 mt-1">
              {formData.placement === "home_banner" && (
                <>
                  <strong>Большой баннер наверху (для десктопа):</strong> по ширине
                  блока, высота ~180–250px. Лучше использовать картинку 1600–1920px
                  по ширине.
                </>
              )}
              {formData.placement === "home_sidebar" && (
                <>
                  <strong>Блок под кнопками на главной:</strong> горизонтальный баннер
                  примерно 600–900×220–260px.
                </>
              )}
              {formData.placement === "stories" && (
                <>
                  <strong>Для раздела историй:</strong> эта картинка
                  используется только как превью карточки на странице{" "}
                  <code>/stories</code>. Картинки ниже — внутри самой истории.
                </>
              )}
              {formData.placement === "other" && (
                <>Рекомендуемый размер зависит от места размещения.</>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Истекает (опционально)
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => updateField("expiresAt", e.target.value)}
              className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Тип размещения
            </label>
            <select
              value={formData.placement}
              onChange={(e) => updateField("placement", e.target.value)}
              className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
            >
              <option value="home_sidebar">Главная — блок под кнопками</option>
              <option value="home_banner">Главная — большой баннер</option>
              <option value="stories">Раздел историй</option>
              <option value="other">Другое / вручную</option>
            </select>
            <p className="text-xs text-[#abd1c6]/70 mt-1">
              Это влияет только на то, где на сайте будет использоваться это размещение.
            </p>
          </div>
        </div>

        {/* Дополнительные поля для историй */}
        {formData.placement === "stories" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                Заголовок рекламной истории
              </label>
              <input
                type="text"
                value={formData.storyTitle}
                onChange={(e) => updateField("storyTitle", e.target.value)}
                className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                placeholder="Например: Как мы помогли авторам собрать 100 000 ₽"
                maxLength={80}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                Текст истории
              </label>
              <RichTextEditor
                value={formData.storyText || ""}
                onChange={(value) => updateField("storyText", value)}
                placeholder="Кратко опишите историю, которая будет показана в ленте /stories"
                rows={6}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                Название проекта в подписи
              </label>
              <input
                type="text"
                value={formData.advertiserName}
                onChange={(e) => updateField("advertiserName", e.target.value)}
                className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                placeholder="Например: Кофейня «Утренний кот»"
                maxLength={80}
              />
              <p className="text-xs text-[#abd1c6]/70 mt-1">
                Это название будет показано рядом с зелёным кружком «Команда проекта» и будет кликабельным.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                Ссылка для подписи проекта (URL)
              </label>
              <input
                type="url"
                value={formData.advertiserLink}
                onChange={(e) => updateField("advertiserLink", e.target.value)}
                className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
                placeholder="https://example.com"
              />
              <p className="text-xs text-[#abd1c6]/70 mt-1">
                Клик по названию проекта откроет эту ссылку в новой вкладке. Если оставить пустой — подпись будет без ссылки.
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-medium text-[#abd1c6]">
                Картинки для истории (до 5 штук, URL)
              </label>
              {formData.storyImageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateStoryImageUrl(index, e.target.value)}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
                    placeholder={`https://example.com/story-image-${index + 1}.jpg`}
                  />
                </div>
              ))}
              {formData.storyImageUrls.length < 5 && (
                <button
                  type="button"
                  onClick={addStoryImageUrl}
                  className="text-xs text-[#f9bc60] hover:text-[#e8a545] font-semibold"
                >
                  + Добавить ещё картинку
                </button>
              )}
              <p className="text-xs text-[#abd1c6]/70">
                Эти картинки показываются внутри самой истории в /stories/ad.
                Превью карточки на странице <code>/stories</code> берётся из поля выше
                «Картинка для превью».
              </p>
            </div>
          </div>
        )}

        {formData.placement === "home_banner" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                URL изображения для мобильного баннера (опционально)
              </label>
              <input
                type="url"
                value={formData.bannerMobileImageUrl}
                onChange={(e) => updateField("bannerMobileImageUrl", e.target.value)}
                className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
                placeholder="https://example.com/mobile-banner.jpg"
              />
              <p className="text-xs text-[#abd1c6]/70 mt-1">
                Если заполнить, этот баннер будет показан на телефонах. Рекомендуемый
                размер 800–1080px по ширине, ориентир по высоте 200–300px.
              </p>
            </div>
          </div>
        )}

        {formData.placement !== "stories" &&
          formData.placement !== "home_sidebar" &&
          formData.placement !== "home_banner" && (
            <div>
              <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                Содержание
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                placeholder="Подробное описание рекламы с призывом к действию"
                maxLength={120}
                required
              />
              <p className="text-xs text-[#abd1c6]/70 mt-1">
                Рекомендуемая длина: 60–120 символов ({formData.content.length}/120)
              </p>
            </div>
          )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
              className="w-4 h-4 text-[#f9bc60] bg-[#004643] border-[#abd1c6]/30 rounded focus:ring-[#f9bc60]"
            />
            <span className="text-[#abd1c6]">Активно</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
          >
            {editingAd ? "Обновить" : "Создать"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

