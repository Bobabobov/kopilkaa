// app/admin/AdminClient.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ApplicationItem, Stats, StatusModal as StatusModalType, ApplicationStatus } from "./types";
import Badge from "./components/Badge";
import StatsCards from "./components/StatsCards";
import ControlPanel from "./components/ControlPanel";
import ApplicationsList from "./components/ApplicationsList";
import StatusModal from "./components/StatusModal";
import ImageLightbox from "./components/ImageLightbox";
import Pagination from "./components/Pagination";
import PageTimeStats from "./components/PageTimeStats";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAvatarFrame } from "@/lib/header-customization";
import UniversalBackground from "@/components/ui/UniversalBackground";

export default function AdminClient() {
  // фильтры/поиск
  const [q, setQ] = useState("");
  const [status, setStatus] =
    useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // список
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // модалка статуса
  const [modal, setModal] = useState<{
    id: string;
    status: ApplicationStatus;
    comment: string;
  }>({
    id: "",
    status: "PENDING",
    comment: "",
  });

  // модалка удаления
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    title: string;
  }>({
    id: "",
    title: "",
  });

  // счётчики
  const [stats, setStats] = useState<{
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    totalAmount: number;
  }>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
    totalAmount: 0,
  });

  // показанные email'ы
  const [shownEmails, setShownEmails] = useState<Set<string>>(new Set());

  // переключение показа email'а
  const toggleEmail = (id: string) => {
    setShownEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // лайтбокс
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<string[]>([]);
  const [lbIndex, setLbIndex] = useState(0);
  
  // уведомления
  const { showToast, ToastComponent } = useBeautifulToast();
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft")
        setLbIndex((i) => (i - 1 + lbImages.length) % lbImages.length);
      if (e.key === "ArrowRight")
        setLbIndex((i) => (i + 1) % lbImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, lbImages.length]);

  // debounce поиска
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  async function loadStats() {
    try {
      const r = await fetch("/api/admin/applications/stats", {
        cache: "no-store",
      });
      if (!r.ok) return;
      const s = await r.json();
      setStats(s);
    } catch {}
  }

  const load = async (p = 1) => {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "10" });
      if (debouncedQ) params.set("q", debouncedQ);
      if (status !== "ALL") params.set("status", status);
      if (minAmount) params.set("minAmount", minAmount);
      if (maxAmount) params.set("maxAmount", maxAmount);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      const r = await fetch(`/api/admin/applications?${params}`, {
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      setItems(d.items);
      setPage(d.page);
      setPages(d.pages);
    } catch (e: any) {
      setErr(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    loadStats();
  }, [debouncedQ, status, minAmount, maxAmount, sortBy, sortOrder]);

  // 🔴 SSE-подписка: живые обновления из /api/admin/stream
  useEffect(() => {
    const es = new EventSource("/api/admin/stream");

    const onUpdate = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setItems((arr) =>
          arr.map((x) =>
            x.id === data.id
              ? {
                  ...x,
                  status: data.status as ApplicationStatus,
                  adminComment: data.adminComment ?? x.adminComment,
                }
              : x
          )
        );
        loadStats();
      } catch {}
    };
    const onStatsDirty = () => {
      loadStats();
    };

    es.addEventListener("application:update", onUpdate);
    es.addEventListener("stats:dirty", onStatsDirty);
    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // быстрые действия
  async function quickUpdate(
    id: string,
    newStatus: ApplicationStatus,
    comment?: string
  ) {
    const r = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        adminComment: comment ?? "",
      }),
    });
    const d = await r.json();
    if (!r.ok) {
      showToast("error", "Ошибка обновления", d?.error || "Не удалось обновить статус заявки");
      return;
    }

    // локально обновим запись (до прихода SSE)
    setItems((arr) => arr.map((x) => (x.id === id ? d.item : x)));

    // и счётчики
    setStats((s) => {
      const prev = items.find((x) => x.id === id)?.status;
      if (!prev || prev === newStatus) return s;
      const u = { ...s };
      if (prev === "PENDING") u.pending--;
      if (prev === "APPROVED") u.approved--;
      if (prev === "REJECTED") u.rejected--;
      if (newStatus === "PENDING") u.pending++;
      if (newStatus === "APPROVED") u.approved++;
      if (newStatus === "REJECTED") u.rejected++;
      return u;
    });
  }

  // удаление заявки
  async function deleteApplication(id: string) {
    const r = await fetch(`/api/admin/applications/${id}`, {
      method: "DELETE",
    });
    const d = await r.json();
    if (!r.ok) {
      showToast("error", "Ошибка удаления", d?.error || "Не удалось удалить заявку");
      return;
    }

    // удаляем из локального списка
    setItems((arr) => arr.filter((x) => x.id !== id));
    
    // обновляем счётчики
    setStats((s) => {
      const item = items.find((x) => x.id === id);
      if (!item) return s;
      const u = { ...s };
      if (item.status === "PENDING") u.pending--;
      if (item.status === "APPROVED") u.approved--;
      if (item.status === "REJECTED") u.rejected--;
      return u;
    });

    showToast("success", "Заявка удалена", "Заявка была успешно удалена");
    setDeleteModal({ id: "", title: "" });
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <div className="container-p mx-auto pt-32 pb-4 sm:pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-6 shadow-lg shadow-emerald-500/30"
          >
            <span className="text-4xl">⚡</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Админ-панель
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Управление заявками и модерация контента
          </motion.p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container-p mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Статистика */}
          <StatsCards stats={stats} />


          {/* Панель управления */}
          <ControlPanel
            searchQuery={q}
            status={status}
            minAmount={minAmount}
            maxAmount={maxAmount}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setQ}
            onStatusChange={setStatus}
            onMinAmountChange={setMinAmount}
            onMaxAmountChange={setMaxAmount}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            onReset={() => {
              setQ("");
              setStatus("ALL");
              setMinAmount("");
              setMaxAmount("");
              setSortBy("date");
              setSortOrder("desc");
              load(1);
              loadStats();
            }}
          />

          {/* Список */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {q ? 'Ищем заявки...' : 'Загружаем заявки...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {q ? `Поиск по запросу: "${q}"` : 'Пожалуйста, подождите'}
              </p>
            </motion.div>
          )}

          {err && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 text-center"
            >
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                Ошибка загрузки
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{err}</p>
            </motion.div>
          )}

          {!loading && !err && items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-12 text-center"
            >
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Заявки не найдены
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {q || status !== "ALL"
                  ? "Попробуйте изменить поисковый запрос или фильтры"
                  : "Пока нет заявок для модерации"}
              </p>
            </motion.div>
          )}

          {!loading && !err && items.length > 0 && (
            <>
              {/* Индикатор результатов поиска */}
              {q && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                        Результаты поиска
                      </h4>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Найдено {items.length} заявок по запросу: <span className="font-medium">"{q}"</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="grid gap-6">
              {items.map((it, index) => {
                const preview =
                  it.story.length > 260 ? it.story.slice(0, 260) + "…" : it.story;

                return (
                  <motion.div
                    key={it.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-lime-500/5 group-hover:from-emerald-500/10 group-hover:via-green-500/10 group-hover:to-lime-500/10 transition-all duration-500"></div>

                    <div className="relative">
                      {/* Шапка */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 sm:mb-6">
                        <div className="min-w-0 flex-1 basis-0">
                          <a
                            href={`/admin/applications/${it.id}`}
                            className="text-lg sm:text-xl font-bold clamp-2 break-words max-w-full text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors cursor-pointer group-hover:scale-105 transform duration-300"
                            title="Открыть полную заявку"
                          >
                            {it.title}
                          </a>
                          
                          {/* Сумма запроса - выделенная */}
                          <div className="mt-3 mb-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-700/50">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                ₽{it.amount.toLocaleString()}
                              </span>
                              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                Сумма запроса
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-2">
                            {/* Аватарка автора */}
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              {(() => {
                                const frame = getAvatarFrame(it.user.avatarFrame || 'none');
                                const frameKey = it.user.avatarFrame || 'none';
                                
                                if (frame.type === 'image') {
                                  // Рамка-картинка
                                  return (
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                      {/* Рамка как фон */}
                                      <div
                                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-full"
                                        style={{ backgroundImage: `url(${(frame as any).imageUrl || '/default-avatar.png'})` }}
                                      />
                                      {/* Аватар поверх рамки */}
                                      <div className="absolute inset-0.5 rounded-full overflow-hidden">
                                        {it.user.avatar ? (
                                          <img
                                            src={it.user.avatar}
                                            alt={it.user.name || "Автор"}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xs">
                                            {(it.user.name || (!it.user.hideEmail ? it.user.email : 'Пользователь'))[0].toUpperCase()}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // CSS рамка (only 'none' remains now)
                                  return (
                                    <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs ${frame.className} ${
                                      it.user.avatar ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600'
                                    }`}>
                                      {it.user.avatar ? (
                                        <img
                                          src={it.user.avatar}
                                          alt={it.user.name || "Автор"}
                                          className={`w-full h-full object-cover rounded-full ${frameKey === 'rainbow' ? 'rounded-full' : ''}`}
                                        />
                                      ) : (
                                        <div className={`w-full h-full flex items-center justify-center rounded-full ${frameKey === 'rainbow' ? 'rounded-full' : ''}`}>
                                          {(it.user.name || (!it.user.hideEmail ? it.user.email : 'Пользователь'))[0].toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                            
                            {/* Информация об авторе */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-500 dark:text-gray-400 break-words">
                                <span className="font-medium">Автор:</span>{" "}
                                <Link 
                                  href={`/profile/${it.user.id}`}
                                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline transition-colors"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {it.user.name || (!it.user.hideEmail ? it.user.email.split('@')[0] : 'Пользователь')}
                                </Link>
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {shownEmails.has(it.id) ? (
                                  <span>{!it.user.hideEmail ? it.user.email : 'Email скрыт'}</span>
                                ) : (
                                  <button
                                    onClick={() => toggleEmail(it.id)}
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    {!it.user.hideEmail ? 'Показать email' : 'Email скрыт'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full lg:w-auto">
                          <Badge status={it.status} />
                          
                          {/* Кнопки действий */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              className="group px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                              onClick={() =>
                                setModal({
                                  id: it.id,
                                  status: it.status,
                                  comment: it.adminComment || "",
                                })
                              }
                            >
                              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                              <span className="hidden sm:inline">Изменить</span>
                            </button>

                            <button
                              className="group px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                              onClick={() =>
                                quickUpdate(
                                  it.id,
                                  "APPROVED",
                                  it.adminComment || ""
                                )
                              }
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="hidden sm:inline">Одобрить</span>
                            </button>
                            
                            <button
                              className="group px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                              onClick={() =>
                                quickUpdate(it.id, "REJECTED", it.adminComment || "")
                              }
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="hidden sm:inline">Отказать</span>
                            </button>

                            <button
                              className="group px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                              onClick={() => setDeleteModal({ id: it.id, title: it.title })}
                              title="Удалить заявку"
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden sm:inline">Удалить</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Кратко */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
                        <div className="text-gray-700 dark:text-gray-300 clamp-2 break-words max-w-full leading-relaxed">
                          {it.summary}
                        </div>
                      </div>

                      {/* Реквизиты */}
                      <details className="toggle text-sm mb-4 sm:mb-6">
                        <summary className="flex items-center gap-2 cursor-pointer select-none text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="label-closed">Показать реквизиты</span>
                          <span className="label-open">Скрыть реквизиты</span>
                        </summary>

                        <div className="open-only rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 mt-3 relative group">
                          <div className="px-4 py-3 break-words pr-16">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              Реквизиты:{" "}
                            </span>
                            <span className="select-all text-gray-900 dark:text-white">
                              {it.payment}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard
                                .writeText(it.payment)
                                .then(() => {
                                  const btn = e.target as HTMLButtonElement;
                                  const icon =
                                    btn.querySelector(".copy-icon") as HTMLElement;
                                  const text =
                                    btn.querySelector(".copy-text") as HTMLElement;
                                  if (icon && text) {
                                    icon.textContent = "✓";
                                    text.textContent = "Скопировано";
                                    btn.className = btn.className
                                      .replace("hover:bg-blue-100", "bg-green-100")
                                      .replace(
                                        "hover:text-blue-700",
                                        "text-green-700"
                                      );
                                    setTimeout(() => {
                                      icon.textContent = "📋";
                                      text.textContent = "Копировать";
                                      btn.className = btn.className
                                        .replace("bg-green-100", "hover:bg-blue-100")
                                        .replace(
                                          "text-green-700",
                                          "hover:text-blue-700"
                                        );
                                    }, 1500);
                                  }
                                })
                                .catch(() => {
                                  showToast("error", "Ошибка копирования", "Выделите текст вручную");
                                });
                            }}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300 backdrop-blur-sm shadow-sm"
                            title="Копировать реквизиты"
                          >
                            <span className="copy-icon">📋</span>
                            <span className="copy-text">Копировать</span>
                          </button>
                        </div>
                      </details>


                      {/* Картинки + лайтбокс */}
                      {it.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          {it.images.map((img: { url: string; sort: number }, i: number) => (
                            <div
                              key={i}
                              className="group relative overflow-hidden rounded-2xl"
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="w-full h-32 object-cover rounded-2xl border border-gray-200 dark:border-gray-600 cursor-zoom-in transition-all duration-300 group-hover:scale-105"
                                onClick={() => {
                                  setLbImages(it.images.map((x: { url: string; sort: number }) => x.url));
                                  setLbIndex(i);
                                  setLbOpen(true);
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Низ карточки */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium">Отправлено:</span>
                            <span>{new Date(it.createdAt).toLocaleString()}</span>
                          </div>
                          
                          {it.images.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-medium">Фото:</span>
                              <span>{it.images.length}</span>
                            </div>
                          )}
                        </div>
                        
                        <a
                          href={`/admin/applications/${it.id}`}
                          className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium text-sm shadow-lg hover:shadow-xl"
                        >
                          <span>Подробнее</span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      {/* Комментарий модератора (внутри карточки) */}
                      {it.adminComment && (
                        <div className="mt-4 text-sm rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 break-words">
                          <span className="opacity-70">Комментарий модератора: </span>
                          {it.adminComment}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </>
          )}
        </motion.div>

        {/* Пагинация */}
        {pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mt-8 sm:mt-12"
          >
            <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-2xl p-1 sm:p-2 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-sm sm:text-base"
                disabled={page <= 1}
                onClick={() => {
                  const p = page - 1;
                  setPage(p);
                  load(p);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 overflow-x-auto">
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === page;
                  return (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                        isActive
                          ? "bg-blue-500 text-white shadow-lg scale-110"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                      }`}
                      onClick={() => {
                        setPage(pageNum);
                        load(pageNum);
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pages > 5 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                        page === pages
                          ? "bg-blue-500 text-white shadow-lg scale-110"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                      }`}
                      onClick={() => {
                        setPage(pages);
                        load(pages);
                      }}
                    >
                      {pages}
                    </button>
                  </>
                )}
              </div>

              <button
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium text-sm sm:text-base"
                disabled={page >= pages}
                onClick={() => {
                  const p = page + 1;
                  setPage(p);
                  load(p);
                }}
              >
                <span className="hidden sm:inline">Вперёд</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Модалка смены статуса */}
      {modal.id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-lg mx-4 sm:mx-0 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Сменить статус заявки</h2>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Новый статус
                </label>
                <select
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white text-sm sm:text-base"
                  value={modal.status}
                  onChange={(e) =>
                    setModal((m) => ({
                      ...m,
                      status: e.target.value as ApplicationStatus,
                    }))
                  }
                >
                  <option value="PENDING">⏳ В обработке</option>
                  <option value="APPROVED">✅ Одобрено</option>
                  <option value="REJECTED">❌ Отказано</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Комментарий администратора
                </label>
                <textarea
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                  value={modal.comment}
                  onChange={(e) =>
                    setModal((m) => ({ ...m, comment: e.target.value }))
                  }
                  placeholder="Причина решения / уточнения для автора..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-end pt-3 sm:pt-4">
                <button
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base"
                  onClick={() =>
                    setModal({ id: "", status: "PENDING", comment: "" })
                  }
                >
                  Отмена
                </button>
                <button
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                  onClick={async () => {
                    const r = await fetch(
                      `/api/admin/applications/${modal.id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          status: modal.status,
                          adminComment: modal.comment,
                        }),
                      }
                    );
                    const d = await r.json();
                    if (r.ok) {
                      setModal({ id: "", status: "PENDING", comment: "" });
                      setItems((arr) =>
                        arr.map((x) => (x.id === d.item.id ? d.item : x))
                      );
                      loadStats();
                    } else {
                      showToast("error", "Ошибка обновления", d?.error || "Не удалось обновить статус заявки");
                    }
                  }}
                >
                  Сохранить изменения
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Модалка удаления */}
      {deleteModal.id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteModal({ id: "", title: "" })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Иконка предупреждения */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </motion.div>

              {/* Заголовок */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Удалить заявку?
              </h3>

              {/* Описание */}
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Вы собираетесь удалить заявку:
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6 break-words">
                "{deleteModal.title}"
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium mb-8">
                ⚠️ Это действие нельзя отменить!
              </p>

              {/* Кнопки */}
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                  onClick={() => setDeleteModal({ id: "", title: "" })}
                >
                  Отмена
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                  onClick={() => deleteApplication(deleteModal.id)}
                >
                  Удалить заявку
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Лайтбокс */}
      {lbOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLbOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className="absolute top-2 right-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLbOpen(false)}
            >
              ×
            </button>
            {lbImages.length > 1 && (
              <button
                aria-label="Prev"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                onClick={() =>
                  setLbIndex((i) => (i - 1 + lbImages.length) % lbImages.length)
                }
              >
                ‹
              </button>
            )}
            {lbImages.length > 1 && (
              <button
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                onClick={() => setLbIndex((i) => (i + 1) % lbImages.length)}
              >
                ›
              </button>
            )}
            <img
              src={lbImages[lbIndex]}
              alt=""
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
            {lbImages.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 text-center text-white/80 text-sm">
                {lbIndex + 1} / {lbImages.length}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Красивые уведомления */}
      <ToastComponent />
    </div>
  );
}
