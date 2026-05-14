"use client";

import { useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import type { Advertisement, AdFormData } from "./types";
import AdPlacementActions from "./AdPlacementActions";
import AdPlacementForm from "./AdPlacementForm";
import AdPlacementCard from "./AdPlacementCard";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

export default function AdsPlacementsSection() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cleaningUp, setCleaningUp] = useState(false);

  const { showToast, showDialog } = useBeautifulNotifications();
  const [formData, setFormData] = useState<AdFormData>({
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
    advertiserWebsite: "",
    advertiserTelegram: "",
    bannerMobileImageUrl: "",
    bannerVideoUrl: "",
    bannerMobileVideoUrl: "",
    sidebarMobileImageUrl: "",
    sidebarMobileTitle: "",
    sidebarMobileContent: "",
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
      } else {
        const data = await response.json().catch(() => null);
        showToast(
          "error",
          "Не удалось загрузить размещения",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      showToast(
        "error",
        "Не удалось загрузить размещения",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isStoriesPlacement = formData.placement === "stories";
    const hasWebsite = Boolean(formData.advertiserWebsite.trim());
    const hasTelegram = Boolean(formData.advertiserTelegram.trim());
    const hasLegacyLink = Boolean(formData.advertiserLink.trim());

    if (isStoriesPlacement && !hasWebsite && !hasTelegram && !hasLegacyLink) {
      showToast(
        "warning",
        "Добавьте контакт для рекламной истории",
        "Укажите сайт или Telegram (можно оба).",
      );
      return;
    }

    try {
      setSaving(true);
      const url = editingAd
        ? `/api/admin/ads/${editingAd.id}`
        : "/api/admin/ads";
      const method = editingAd ? "PUT" : "POST";

      const cleanedStoryImages =
        formData.placement === "stories"
          ? formData.storyImageUrls.map((url) => url.trim()).filter(Boolean)
          : [];

      // Формируем config в зависимости от типа размещения
      let config: any = null;

      if (formData.placement === "stories") {
        config = {
          storyTitle: formData.storyTitle,
          storyText: formData.storyText,
          storyImageUrls: cleanedStoryImages,
          advertiserName: formData.advertiserName,
          advertiserLink: formData.advertiserLink,
          advertiserWebsite: formData.advertiserWebsite,
          advertiserTelegram: formData.advertiserTelegram,
        };
      } else if (formData.placement === "home_banner") {
        config = {
          bannerMobileImageUrl: formData.bannerMobileImageUrl || undefined,
          bannerVideoUrl: formData.bannerVideoUrl || undefined,
          bannerMobileVideoUrl: formData.bannerMobileVideoUrl || undefined,
        };
      } else if (formData.placement === "home_sidebar") {
        config = {
          sidebarMobileImageUrl: formData.sidebarMobileImageUrl || undefined,
          sidebarMobileTitle: formData.sidebarMobileTitle || undefined,
          sidebarMobileContent: formData.sidebarMobileContent || undefined,
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
        setFormData(resetForm());
        setShowForm(false);
        setEditingAd(null);
        showToast(
          "success",
          editingAd ? "Размещение обновлено" : "Размещение создано",
        );
      } else {
        const data = await response.json().catch(() => null);
        showToast(
          "error",
          "Не удалось сохранить размещение",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      showToast(
        "error",
        "Не удалось сохранить размещение",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setSaving(false);
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
      advertiserWebsite: ad.config?.advertiserWebsite || "",
      advertiserTelegram: ad.config?.advertiserTelegram || "",
      bannerMobileImageUrl: ad.config?.bannerMobileImageUrl || "",
      bannerVideoUrl: ad.config?.bannerVideoUrl || "",
      bannerMobileVideoUrl: ad.config?.bannerMobileVideoUrl || "",
      sidebarMobileImageUrl: ad.config?.sidebarMobileImageUrl || "",
      sidebarMobileTitle: ad.config?.sidebarMobileTitle || "",
      sidebarMobileContent: ad.config?.sidebarMobileContent || "",
    });
    setShowForm(true);
  };

  const deleteAd = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        await fetchAds();
        showToast("success", "Размещение удалено");
      } else {
        console.error(
          "Failed to delete ad:",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
        showToast(
          "error",
          "Не удалось удалить размещение",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      showToast(
        "error",
        "Не удалось удалить размещение",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (id: string) => {
    showDialog({
      type: "confirm",
      title: "Удалить размещение?",
      message: "Действие необратимо. Размещение исчезнет с сайта.",
      confirmText: "Удалить",
      cancelText: "Отмена",
      onConfirm: () => void deleteAd(id),
    });
  };

  const resetForm = (): AdFormData => {
    return {
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
      advertiserWebsite: "",
      advertiserTelegram: "",
      bannerMobileImageUrl: "",
      bannerVideoUrl: "",
      bannerMobileVideoUrl: "",
      sidebarMobileImageUrl: "",
      sidebarMobileTitle: "",
      sidebarMobileContent: "",
    };
  };

  const handleCancel = () => {
    setFormData(resetForm());
    setShowForm(false);
    setEditingAd(null);
  };

  const handleCleanup = async () => {
    setCleaningUp(true);
    try {
      const response = await fetch("/api/admin/ads/cleanup", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json().catch(() => null);
        showToast(
          "success",
          "Очистка выполнена",
          `Деактивировано размещений: ${data?.deactivatedCount ?? 0}`,
        );
        await fetchAds();
      } else {
        const data = await response.json().catch(() => null);
        showToast(
          "error",
          "Не удалось выполнить очистку",
          getMessageFromApiJson(data, response.statusText || "Ошибка запроса"),
        );
      }
    } catch (error) {
      console.error("Error cleaning up ads:", error);
      showToast(
        "error",
        "Не удалось выполнить очистку",
        "Проверьте соединение и попробуйте ещё раз",
      );
    } finally {
      setCleaningUp(false);
    }
  };

  const handleCleanupConfirm = () => {
    showDialog({
      type: "confirm",
      title: "Деактивировать истёкшие размещения?",
      message:
        "Мы отключим все активные размещения, у которых срок действия уже прошёл.",
      confirmText: "Деактивировать",
      cancelText: "Отмена",
      onConfirm: () => void handleCleanup(),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f9bc60] mb-4"></div>
        <div className="text-[#abd1c6]">Загрузка размещений...</div>
      </div>
    );
  }

  return (
    <>
      <AdPlacementActions
        activeCount={ads.filter((ad) => ad.isActive).length}
        onCleanup={handleCleanupConfirm}
        onAddNew={() => {
          setEditingAd(null);
          setShowForm(true);
        }}
      />

      {showForm && (
        <AdPlacementForm
          formData={formData}
          editingAd={editingAd}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Список размещений */}
      <div className="space-y-4">
        {(saving || cleaningUp || deletingId) && (
          <div className="mb-2 text-xs text-[#abd1c6]/70">
            {saving
              ? "Сохраняем..."
              : cleaningUp
                ? "Выполняем очистку..."
                : "Удаляем..."}
          </div>
        )}
        {ads.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#001e1d] border border-[#abd1c6]/20 mb-4">
              <LucideIcons.LayoutGrid size="lg" className="text-[#abd1c6]/50" />
            </div>
            <h3 className="text-xl font-semibold text-[#fffffe] mb-2">
              Нет размещений
            </h3>
            <p className="text-[#abd1c6] mb-6 max-w-md mx-auto">
              Создайте первое размещение рекламы, чтобы начать управлять
              рекламными блоками на сайте
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#f9bc60]/20 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <LucideIcons.Plus size="sm" />
              Создать размещение
            </button>
          </div>
        ) : (
          ads.map((ad) => (
            <AdPlacementCard
              key={ad.id}
              ad={ad}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </>
  );
}
