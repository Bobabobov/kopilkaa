import type { SettingsUser } from "../hooks/useSettings";

interface SettingsAvatarSectionProps {
  user: SettingsUser;
  saving: boolean;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function SettingsAvatarSection({ user, saving, avatarInputRef, onUpload, onDelete }: SettingsAvatarSectionProps) {

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full border border-white/10 bg-[#001e1d]/30 overflow-hidden flex items-center justify-center">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="Аватар" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#f9bc60] text-2xl font-bold">{(user.name || user.email)[0].toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[#fffffe] mb-1">Аватарка</h3>
          <p className="text-[#abd1c6] text-sm">PNG/JPG/WEBP, до 5 МБ</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <input
          ref={avatarInputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            await onUpload(file);
            e.currentTarget.value = "";
          }}
          disabled={saving}
        />
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold transition-colors"
        >
          {user.avatar ? "Заменить" : "Загрузить"}
        </button>
        {user.avatar && (
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:bg-[#6B7280] text-[#fffffe] font-semibold border border-white/10 transition-colors"
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}
