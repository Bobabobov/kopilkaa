"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useApplications } from "@/lib/useApplications";
import { StatsCards } from "@/components/applications/StatsCards";
import { FiltersAndSearch } from "@/components/applications/FiltersAndSearch";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { Pagination } from "@/components/applications/Pagination";
import { EmptyState } from "@/components/applications/EmptyState";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationsModal({ isOpen, onClose }: ApplicationsModalProps) {
  const { showToast, ToastComponent } = useBeautifulToast();
  const {
    items,
    stats,
    page,
    pages,
    loading,
    err,
    expanded,
    filter,
    setFilter,
    search,
    setSearch,
    sortBy,
    setSortBy,
    load,
    toggleExpanded,
  } = useApplications();

  // Локальные уведомления
  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Горячие клавиши и блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return;

    // Блокируем прокрутку фона более надежно
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;
    
    // Блокируем прокрутку
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      
      // Плавно восстанавливаем позицию прокрутки
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'instant'
        });
      });
    };
  }, [isOpen, onClose]);

  // Функция для показа локального уведомления
  const showLocalNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setLocalNotification({ show: true, type, title, message });
    setTimeout(() => {
      setLocalNotification({ show: false, type: 'info', title: '', message: '' });
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="applications-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="applications-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden backdrop-blur-xl"
          style={{ 
            backgroundColor: '#004643',
            border: '1px solid #abd1c6'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="p-4" style={{ backgroundColor: '#f9bc60' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 30, 29, 0.2)' }}>
                  <LucideIcons.FileText size="md" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#001e1d' }}>Мои заявки</h2>
                  <p style={{ color: '#001e1d', opacity: 0.8 }}>
                    {stats.total} {stats.total === 1 ? 'заявка' : stats.total < 5 ? 'заявки' : 'заявок'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl backdrop-blur-xl flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: 'rgba(0, 30, 29, 0.2)' }}
              >
                <span className="text-xl" style={{ color: '#001e1d' }}>✕</span>
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mb-4 p-3 rounded-lg text-sm font-medium shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #f9bc60, #fac570)',
                  color: '#001e1d'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {localNotification.type === 'success' ? '✅' :
                     localNotification.type === 'error' ? '❌' : 'ℹ️'}
                  </span>
                  <div>
                    <div className="font-bold">{localNotification.title}</div>
                    <div className="text-sm" style={{ color: '#001e1d', opacity: 0.8 }}>{localNotification.message}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="p-6 max-h-[calc(90vh-150px)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#f9bc60' }}></div>
                <p style={{ color: '#abd1c6' }}>Загрузка заявок...</p>
              </div>
            ) : err ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4" style={{ color: '#f9bc60' }}>⚠️</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#fffffe' }}>Ошибка загрузки</h3>
                <p style={{ color: '#abd1c6' }}>{err}</p>
              </div>
            ) : (
              <>
                <StatsCards stats={stats} />
                <FiltersAndSearch
                  search={search}
                  setSearch={setSearch}
                  filter={filter}
                  setFilter={setFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
                <div className="space-y-3 sm:space-y-4 mt-4">
                  {items.length === 0 ? (
                    <EmptyState search={search} filter={filter} />
                  ) : (
                    items.map((item, index) => (
                      <ApplicationCard
                        key={item.id}
                        item={item}
                        index={index}
                        isExpanded={!!expanded[item.id]}
                        onToggleExpanded={toggleExpanded}
                      />
                    ))
                  )}
                </div>
                <Pagination
                  page={page}
                  pages={pages}
                  onPageChange={load}
                />
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
      <ToastComponent key="toast-component" />
    </AnimatePresence>
  );
}
