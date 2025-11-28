"use client";

import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  placement?: string;
  config?: {
    storyTitle?: string;
    storyText?: string;
    storyImageUrls?: string[];
    advertiserName?: string;
    advertiserLink?: string;
    bannerMobileImageUrl?: string;
  } | null;
}

export default function AdsPlacementsSection() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    linkUrl: "",
    expiresAt: "",
    isActive: true,
    placement: "home_sidebar" as string,
    storyTitle: "",
    storyText: "",
    storyImageUrls: [""] as string[],
    advertiserName: "",
    advertiserLink: "",
    bannerMobileImageUrl: "",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/ads");
      if (response.ok) {
        const data = await response.json();
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAd ? `/api/admin/ads/${editingAd.id}` : "/api/admin/ads";
      const method = editingAd ? "PUT" : "POST";

      const cleanedStoryImages =
        formData.placement === "stories"
          ? formData.storyImageUrls.map((url) => url.trim()).filter(Boolean)
          : [];

      const isStoriesPlacement = formData.placement === "stories";

      // Формируем config в зависимости от типа размещения
      let config: any = null;

      if (formData.placement === "stories") {
        config = {
          storyTitle: formData.storyTitle,
          storyText: formData.storyText,
          storyImageUrls: cleanedStoryImages,
          advertiserName: formData.advertiserName,
          advertiserLink: formData.advertiserLink,
        };
      } else if (formData.placement === "home_banner") {
        config = {
          bannerMobileImageUrl: formData.bannerMobileImageUrl || undefined,
        };
      }

      const payload = {
        // Для "раздел историй" заголовок и текст берём из полей рекламной истории,
        // чтобы не дублировать ввод для администратора
        title: isStoriesPlacement
          ? formData.storyTitle || formData.title
          : formData.title,
        content: isStoriesPlacement
          ? formData.storyText || formData.content
          : formData.content,
        imageUrl: formData.imageUrl,
        linkUrl: formData.linkUrl,
        expiresAt: formData.expiresAt,
        isActive: formData.isActive,
        placement: formData.placement,
        config,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchAds();
        resetForm();
        setShowForm(false);
        setEditingAd(null);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      content: ad.content,
      imageUrl: ad.imageUrl || "",
      linkUrl: ad.linkUrl || "",
      expiresAt: ad.expiresAt ? ad.expiresAt.split("T")[0] : "",
      isActive: ad.isActive,
      placement: ad.placement || "home_sidebar",
      storyTitle: ad.config?.storyTitle || "",
      storyText: ad.config?.storyText || "",
      storyImageUrls: ad.config?.storyImageUrls?.length
        ? ad.config.storyImageUrls
        : [""],
      advertiserName: ad.config?.advertiserName || "",
      advertiserLink: ad.config?.advertiserLink || "",
      bannerMobileImageUrl: ad.config?.bannerMobileImageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить это размещение?")) return;

    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAds();
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      linkUrl: "",
      expiresAt: "",
      isActive: true,
      placement: "home_sidebar",
      storyTitle: "",
      storyText: "",
      storyImageUrls: [""],
      advertiserName: "",
      advertiserLink: "",
      bannerMobileImageUrl: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    setEditingAd(null);
  };

  const handleCleanup = async () => {
    if (!confirm("Деактивировать все истёкшие размещения?")) return;

    try {
      const response = await fetch("/api/admin/ads/cleanup", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Деактивировано размещений: ${data.deactivatedCount}`);
        await fetchAds();
      }
    } catch (error) {
      console.error("Error cleaning up ads:", error);
      alert("Ошибка при очистке рекламы");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#abd1c6]">Загрузка размещений...</div>
      </div>
    );
  }

  return (
    <>
      {/* Панель действий по размещениям */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-[#abd1c6]">
          Активных размещений:{" "}
          <span className="text-[#f9bc60] font-semibold">
            {ads.filter((ad) => ad.isActive).length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCleanup}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LucideIcons.Trash2 size="sm" />
            Очистить истёкшие
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors flex items-center gap-2"
          >
            <LucideIcons.Plus size="sm" />
            Добавить размещение
          </button>
        </div>
      </div>

      {/* Форма размещения */}
      {showForm && (
        <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
          <h2 className="text-xl font-bold text-[#fffffe] mb-4">
            {editingAd ? "Редактировать размещение" : "Новое размещение"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                    placeholder="Краткий привлекательный заголовок"
                    maxLength={40}
                    required={formData.placement !== "stories"}
                  />
                  <p className="text-xs text-[#abd1c6]/70 mt-1">
                    Рекомендуемая длина: 20–40 символов ({formData.title.length}
                    /40)
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
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Тип размещения
                </label>
                <select
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData({ ...formData, placement: e.target.value })
                  }
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
                    onChange={(e) =>
                      setFormData({ ...formData, storyTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                    placeholder="Например: Как мы помогли авторам собрать 100 000 ₽"
                    maxLength={80}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Текст истории
                  </label>
                  <textarea
                    value={formData.storyText}
                    onChange={(e) =>
                      setFormData({ ...formData, storyText: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                    placeholder="Кратко опишите историю, которая будет показана в ленте /stories"
                  />
                  <p className="text-xs text-[#abd1c6]/70 mt-1">
                    Можно использовать переносы строк — так текст будет выглядеть аккуратнее.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Название проекта в подписи
                  </label>
                  <input
                    type="text"
                    value={formData.advertiserName}
                    onChange={(e) =>
                      setFormData({ ...formData, advertiserName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, advertiserLink: e.target.value })
                    }
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
                        onChange={(e) => {
                          const next = [...formData.storyImageUrls];
                          next[index] = e.target.value;
                          setFormData({ ...formData, storyImageUrls: next });
                        }}
                        className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none text-sm"
                        placeholder={`https://example.com/story-image-${index + 1}.jpg`}
                      />
                    </div>
                  ))}
                  {formData.storyImageUrls.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          storyImageUrls: [...formData.storyImageUrls, ""],
                        })
                      }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bannerMobileImageUrl: e.target.value,
                      })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                  placeholder="Подробное описание рекламы с призывом к действию"
                  maxLength={120}
                  required
                />
                <p className="text-xs text-[#abd1c6]/70 mt-1">
                  Рекомендуемая длина: 60–120 символов (
                  {formData.content.length}/120)
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
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
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список размещений */}
      <div className="space-y-4">
        {ads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#abd1c6] text-lg">
              Пока нет активных размещений
            </div>
          </div>
        ) : (
          ads.map((ad) => (
            <div
              key={ad.id}
              className="p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#fffffe]">
                      {ad.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ad.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {ad.isActive ? "Активно" : "Выключено"}
                    </span>
                    {ad.expiresAt && new Date(ad.expiresAt) > new Date() && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                        Истекает:{" "}
                        {new Date(ad.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-[#abd1c6] mb-3">{ad.content}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#abd1c6]/75">
                    <span>
                      Создано: {new Date(ad.createdAt).toLocaleDateString()}
                    </span>
                    {ad.placement && (
                      <span className="px-2 py-0.5 rounded-full bg-[#004643] text-[#abd1c6] border border-[#0b3b33]/70 text-[11px] uppercase tracking-wide">
                        {ad.placement === "home_sidebar" && "Главная • блок под кнопками"}
                        {ad.placement === "home_banner" && "Главная • баннер"}
                        {ad.placement === "stories" && "Истории"}
                        {ad.placement === "other" && "Другое"}
                        {!["home_sidebar","home_banner","stories","other"].includes(ad.placement) && ad.placement}
                      </span>
                    )}
                    {ad.linkUrl && (
                      <a
                        href={ad.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f9bc60] hover:underline"
                      >
                        Ссылка
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(ad)}
                    className="p-2 bg-[#f9bc60] text-[#001e1d] rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
                  >
                    <LucideIcons.Edit size="sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LucideIcons.Trash2 size="sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}


