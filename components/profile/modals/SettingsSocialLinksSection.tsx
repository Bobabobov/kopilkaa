import { SettingsSection } from "./SettingsFields";
import { SocialLinkEditor } from "../settings/ProfileEditors";
import type { SettingsUser } from "../hooks/useSettings";

interface SettingsSocialLinksSectionProps {
  user: SettingsUser;
  saving: boolean;
  onChange: (field: "vkLink" | "telegramLink" | "youtubeLink", link: string) => Promise<void>;
}

export function SettingsSocialLinksSection({ user, saving, onChange }: SettingsSocialLinksSectionProps) {
  return (
    <SettingsSection title="Социальные сети">
      <div className="space-y-4">
        <SocialLinkEditor
          label="Профиль VK"
          placeholder="https://vk.com/username"
          value={user.vkLink}
          type="vk"
          onSave={(link) => onChange("vkLink", link)}
          disabled={saving}
        />
        <SocialLinkEditor
          label="Telegram"
          placeholder="https://t.me/username"
          value={user.telegramLink}
          type="telegram"
          onSave={(link) => onChange("telegramLink", link)}
          disabled={saving}
        />
        <SocialLinkEditor
          label="YouTube"
          placeholder="https://youtube.com/@username"
          value={user.youtubeLink}
          type="youtube"
          onSave={(link) => onChange("youtubeLink", link)}
          disabled={saving}
        />
      </div>
    </SettingsSection>
  );
}
