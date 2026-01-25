"use client";

// Loading States Component
export function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Header Loading */}
      <div className="bg-[#001e1d]/20 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-[#abd1c6]/20 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#abd1c6]/20 rounded w-3/4"></div>
          <div className="h-4 bg-[#abd1c6]/20 rounded w-1/2"></div>
        </div>
      </div>

      {/* Settings Loading */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#001e1d]/20 rounded-xl p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-[#abd1c6]/20 rounded w-1/3"></div>
                <div className="h-3 bg-[#abd1c6]/10 rounded w-2/3"></div>
              </div>
              <div className="h-10 w-20 bg-[#abd1c6]/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Notification Message Component
interface NotificationMessageProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function NotificationMessage({
  message,
  type,
  onClose,
}: NotificationMessageProps) {
  const bgColor = {
    success: "bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-[#f9bc60]/20 border-[#f9bc60]/30 text-[#f9bc60]",
  }[type];

  return (
    <div
      className={`p-4 rounded-xl border ${bgColor} flex items-center justify-between`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {type === "success" && <span className="text-lg">✓</span>}
          {type === "error" && <span className="text-lg">✗</span>}
          {type === "info" && <span className="text-lg">ℹ</span>}
        </div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <span className="text-sm">✕</span>
      </button>
    </div>
  );
}

// Error State Component
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Ошибка загрузки",
  message = "Не удалось загрузить данные профиля",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <span className="text-2xl text-red-400">⚠</span>
      </div>
      <h3 className="text-lg font-semibold text-[#fffffe] mb-2">{title}</h3>
      <p className="text-[#abd1c6] mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-xl transition-colors"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-[#fffffe] mb-2">{title}</h3>
      <p className="text-[#abd1c6] mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-xl transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Settings Loading State
export function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-[#001e1d]/20 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-[#abd1c6]/20 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#abd1c6]/20 rounded w-3/4"></div>
          <div className="h-4 bg-[#abd1c6]/20 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

// Settings Unauthorized State
export function SettingsUnauthorized({ message }: { message?: string }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
        <div className="text-2xl">🔒</div>
      </div>
      <div className="space-y-2">
        <p className="text-[#fffffe] font-medium">Доступ запрещен</p>
        <p className="text-[#abd1c6] text-sm">
          {message || "Вы не авторизованы"}
        </p>
      </div>
    </div>
  );
}
