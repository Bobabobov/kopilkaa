import { LucideIcons } from "@/components/ui/LucideIcons";

interface SettingsModalHeaderProps {
  onClose: () => void;
}

export function SettingsModalHeader({ onClose }: SettingsModalHeaderProps) {
  return (
    <div className="p-4 sm:p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center flex-shrink-0">
            <LucideIcons.Settings size="md" className="text-[#001e1d]" />
          </div>
          <div>
            <h2 id="profile-settings-title" className="text-xl sm:text-2xl font-bold text-[#fffffe]">
              Настройки профиля
            </h2>
            <p id="profile-settings-desc" className="text-[#abd1c6]">
              Управление вашим аккаунтом
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
          aria-label="Закрыть настройки"
        >
          <LucideIcons.X size="sm" className="text-[#fffffe]" />
        </button>
      </div>
    </div>
  );
}
