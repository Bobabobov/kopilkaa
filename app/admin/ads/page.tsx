"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
}

export default function AdsManagementPage() {
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
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
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
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      expiresAt: ad.expiresAt ? ad.expiresAt.split('T')[0] : "",
      isActive: ad.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту рекламу?")) return;

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
    });
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    setEditingAd(null);
  };

  const handleCleanup = async () => {
    if (!confirm("Деактивировать все истекшие рекламы?")) return;

    try {
      const response = await fetch("/api/admin/ads/cleanup", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Деактивировано реклам: ${data.deactivatedCount}`);
        await fetchAds();
      }
    } catch (error) {
      console.error("Error cleaning up ads:", error);
      alert("Ошибка при очистке рекламы");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24" style={{ backgroundColor: "#004643" }}>
        <div className="text-[#abd1c6]">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-6 px-6" style={{ backgroundColor: "#004643" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#fffffe] mb-2">Управление рекламой</h1>
            <p className="text-[#abd1c6]">Создание и управление рекламными блоками</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Навигация */}
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки
              </Link>
              <Link
                href="/admin/ads"
                className="px-4 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
              >
                Реклама
              </Link>
              <Link
                href="/admin/ad-requests"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки на рекламу
              </Link>
            </div>
            
                 <div className="flex gap-2">
                   <Link
                     href="/standards"
                     className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors flex items-center gap-2"
                   >
                     📏 Стандарты
                   </Link>
                   <Link
                     href="/ad-examples"
                     className="px-4 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors flex items-center gap-2"
                   >
                     👀 Примеры
                   </Link>
                   <button
                     onClick={handleCleanup}
                     className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                   >
                     <LucideIcons.Trash2 size="sm" />
                     Очистить истекшие
                   </button>
                   <button
                     onClick={() => setShowForm(true)}
                     className="px-6 py-3 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors flex items-center gap-2"
                   >
                     <LucideIcons.Plus size="sm" />
                     Добавить рекламу
                   </button>
                 </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
            <h2 className="text-xl font-bold text-[#fffffe] mb-4">
              {editingAd ? "Редактировать рекламу" : "Новая реклама"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                    placeholder="Краткий привлекательный заголовок"
                    maxLength={40}
                    required
                  />
                  <p className="text-xs text-[#abd1c6]/70 mt-1">
                    Рекомендуемая длина: 20-40 символов ({formData.title.length}/40)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Ссылка (опционально)
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    URL изображения (опционально)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                    placeholder="https://example.com/banner.jpg"
                  />
                  <p className="text-xs text-[#abd1c6]/70 mt-1">
                    <strong>Горизонтальный баннер:</strong> 100% × 150px<br/>
                    <strong>Боковые блоки:</strong> 320x112px (соотношение 2.86:1)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Истекает (опционально)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Содержание
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
                  placeholder="Подробное описание рекламы с призывом к действию"
                  maxLength={120}
                  required
                />
                <p className="text-xs text-[#abd1c6]/70 mt-1">
                  Рекомендуемая длина: 60-120 символов ({formData.content.length}/120)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#f9bc60] bg-[#004643] border-[#abd1c6]/30 rounded focus:ring-[#f9bc60]"
                  />
                  <span className="text-[#abd1c6]">Активна</span>
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

        <div className="space-y-4">
          {ads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#abd1c6] text-lg">Реклама не найдена</div>
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
                      <h3 className="text-xl font-bold text-[#fffffe]">{ad.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ad.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {ad.isActive ? "Активна" : "Неактивна"}
                      </span>
                      {ad.expiresAt && new Date(ad.expiresAt) > new Date() && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                          Истекает: {new Date(ad.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#abd1c6] mb-3">{ad.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#abd1c6]/70">
                      <span>Создано: {new Date(ad.createdAt).toLocaleDateString()}</span>
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
      </div>
    </div>
  );
}
