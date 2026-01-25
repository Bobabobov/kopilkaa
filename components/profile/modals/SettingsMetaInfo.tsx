import { CopyField, ReadOnlyField, SettingsSection } from "./SettingsFields";
import { getPublicProfilePath } from "@/lib/profileUrl";
import type { SettingsUser } from "../hooks/useSettings";

interface SettingsMetaInfoProps {
  user: SettingsUser;
  saving: boolean;
  onCopy: (text: string) => void;
}

export function SettingsMetaInfo({
  user,
  saving,
  onCopy,
}: SettingsMetaInfoProps) {
  const path = getPublicProfilePath(user);
  const url =
    typeof window !== "undefined" && window.location?.origin
      ? `${window.location.origin}${path}`
      : `https://kopilka-online.ru${path}`;

  return (
    <>
      <CopyField
        label="Технический ID"
        value={user.id}
        copyValue={user.id}
        onCopy={onCopy}
        disabled={saving}
      />

      <CopyField
        label="Ссылка на профиль"
        value={url}
        copyValue={url}
        onCopy={onCopy}
        disabled={saving}
      />

      <ReadOnlyField
        label="Дата регистрации"
        value={new Date(user.createdAt).toLocaleDateString("ru-RU")}
      />

      <ReadOnlyField
        label="Последний вход"
        value={new Date(user.lastSeen || user.createdAt).toLocaleString(
          "ru-RU",
        )}
      />

      <SettingsSection title="Пароль">
        <div className="p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
          <p className="text-[#abd1c6]">Изменение пароля временно недоступно</p>
        </div>
      </SettingsSection>
    </>
  );
}
