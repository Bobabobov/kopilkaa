"use client";
import { useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

type LocalImage = { file: File; url: string };

interface ApplicationPreviewProps {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  photos: LocalImage[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function ApplicationPreview({
  title,
  summary,
  story,
  amount,
  payment,
  photos,
  onClose,
  onConfirm,
}: ApplicationPreviewProps) {
  // Блокируем скролл body при открытом модальном окне
  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    
    // Блокируем скролл более надежным способом
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Восстанавливаем скролл при закрытии
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Предотвращаем скролл фона при скролле модального окна
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  // Предотвращаем скролл через клавиатуру
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Блокируем клавиши скролла
    if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-start md:items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-green-900/20"></div>
      
      <div
        className="relative bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[#abd1c6]/30 animate-slideUp backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(171, 209, 198, 0.1)',
        }}
      >
        {/* Декоративная рамка */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-transparent to-green-500/10 pointer-events-none"></div>
        
        {/* Блестящий эффект сверху */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#abd1c6]/50 to-transparent"></div>
        {/* Заголовок */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LucideIcons.Eye size="lg" className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent">
                Предпросмотр заявки
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-3 hover:bg-[#abd1c6]/10 rounded-2xl transition-all duration-300 text-[#fffffe] hover:text-[#abd1c6] hover:scale-110 border border-transparent hover:border-[#abd1c6]/20 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60"
            aria-label="Закрыть предпросмотр"
          >
            <LucideIcons.X size="lg" className="group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
          </button>
        </div>

        {/* Содержимое предпросмотра */}
        <div 
          className="overflow-y-auto max-h-[calc(92vh-220px)] space-y-4 sm:space-y-6 pr-2 sm:pr-3 scrollbar-thin scrollbar-thumb-[#abd1c6]/30 scrollbar-track-transparent"
          onWheel={handleWheel}
        >
          {/* Заголовок заявки */}
          <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <LucideIcons.Home size="sm" className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#abd1c6]">
                Заголовок
              </h3>
            </div>
            <p className="text-[#fffffe] break-words leading-relaxed text-lg font-medium">{title}</p>
          </div>

          {/* Краткое описание */}
          <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <LucideIcons.MessageCircle size="sm" className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#abd1c6]">
                Краткое описание
              </h3>
            </div>
            <p className="text-[#fffffe] break-words leading-relaxed">{summary}</p>
          </div>

          {/* Подробная история */}
          <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LucideIcons.FileText size="sm" className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#abd1c6]">
                Подробная история
              </h3>
            </div>
            <div 
              className="text-[#fffffe] break-words leading-relaxed max-w-full overflow-wrap-anywhere prose prose-sm max-w-none"
              style={{ color: "#fffffe" }}
              dangerouslySetInnerHTML={{ __html: story }}
            />
          </div>

          {/* Сумма */}
          <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <LucideIcons.DollarSign size="sm" className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#abd1c6]">
                Сумма запроса
              </h3>
            </div>
            <p className="text-[#fffffe] text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {parseInt(amount).toLocaleString('ru-RU')} ₽
            </p>
          </div>

          {/* Реквизиты */}
          <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <LucideIcons.CreditCard size="sm" className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#abd1c6]">
                Реквизиты для получения помощи
              </h3>
            </div>
            <p className="text-[#fffffe] break-words leading-relaxed font-mono text-sm bg-gradient-to-br from-[#001e1d]/60 to-[#001e1d]/40 p-4 rounded-xl border border-[#abd1c6]/30">
              {payment}
            </p>
          </div>

          {/* Фотографии */}
          {photos.length > 0 && (
            <div className="group bg-gradient-to-br from-[#001e1d]/40 to-[#001e1d]/20 rounded-2xl p-6 border border-[#abd1c6]/20 hover:border-[#abd1c6]/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <LucideIcons.Image size="sm" className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#abd1c6]">
                  Фотографии ({photos.length})
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group/image">
                    <img
                      src={photo.url}
                      alt={`Фото ${index + 1}`}
                      loading="lazy"
                      width={320}
                      height={240}
                      className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                      <LucideIcons.ZoomIn size="sm" className="text-white" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="relative mt-8 pt-6 border-t border-gradient-to-r from-transparent via-[#abd1c6]/20 to-transparent">
          {/* Декоративная линия */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#abd1c6]/50 to-transparent"></div>
          
          <div className="flex gap-4 justify-end flex-wrap">
            <button
              onClick={onClose}
              className="group px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-500/20 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
            >
              <LucideIcons.Edit3 size="sm" className="group-hover:rotate-12 transition-transform duration-300" />
              Редактировать
            </button>
            <button
              onClick={onConfirm}
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-emerald-400/20 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              <LucideIcons.Send size="sm" className="group-hover:translate-x-1 transition-transform duration-300" />
              Отправить заявку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
