import { CopyField, ReadOnlyField } from "./SettingsFields";
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
    </>
  );
}
